//
//  AuthManager.swift
//  AIDagelijksNative
//

import Foundation
import SwiftUI
import Combine
import Supabase
import Auth
import Storage
import AuthenticationServices

@MainActor
final class AuthManager: ObservableObject {
    // MARK: - Public state

    @Published private(set) var session: Session? = nil
    @Published private(set) var user: User? = nil
    @Published private(set) var profile: ProfileRow?
    @Published private(set) var preferences: UserPreferencesRow?
    @Published private(set) var isLoading: Bool = false
    @Published var lastErrorMessage: String?

    // MARK: - Internals

    private let supabase: SupabaseClient
    private var authListenerTask: Task<Void, Never>?
    private var oauthPresentationContextProvider: AnchorPresentationContextProvider?
    private var webAuthSession: ASWebAuthenticationSession?

    init() {
        self.supabase = SupabaseSDK.client
        bootstrap()
    }

    deinit {
        authListenerTask?.cancel()
    }

    // MARK: - Bootstrap / lifecycle

    func bootstrap() {
        authListenerTask?.cancel()

        authListenerTask = Task { [supabase] in
            for await (event, session) in await supabase.auth.authStateChanges {
                await MainActor.run {
                    self.handleAuthStateChange(event: event, session: session)
                }
            }
        }

        Task { await loadInitialSession() }
    }

    // MARK: - URL handling (OAuth callback)

    func handleOpenURL(_ url: URL) async {
        do {
            _ = try await supabase.auth.session(from: url)
            // authStateChanges will update published state; still refresh eagerly for UX.
            await refreshProfileAndPreferences()
        } catch {
            // Not all URLs are auth callbacks; ignore silently unless we're in an auth flow.
        }
    }

    // MARK: - Auth actions

    func signIn(email: String, password: String) async -> Bool {
        lastErrorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            try await supabase.auth.signIn(email: email, password: password)
            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signUp(email: String, password: String) async -> Bool {
        lastErrorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            try await supabase.auth.signUp(email: email, password: password)
            // Depending on Supabase settings, the session may be nil until email confirmation.
            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signInWithGoogle(presentationAnchor: ASPresentationAnchor) async -> Bool {
        lastErrorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            let signInURL = try await supabase.auth.getOAuthSignInURL(
                provider: .google,
                redirectTo: SupabaseSDK.redirectURL
            )

            let callbackURL = try await startWebAuthentication(
                signInURL: signInURL,
                callbackURLScheme: "aidagelijksnative",
                presentationAnchor: presentationAnchor
            )

            _ = try await supabase.auth.session(from: callbackURL)
            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signOut() async {
        lastErrorMessage = nil
        isLoading = true
        defer { isLoading = false }

        do {
            try await supabase.auth.signOut()
        } catch {
            lastErrorMessage = error.localizedDescription
        }

        session = nil
        user = nil
        profile = nil
        preferences = nil
    }

    // MARK: - Profile / Preferences

    func refreshProfileAndPreferences() async {
        guard let userId = user?.id else {
            profile = nil
            preferences = nil
            return
        }

        do {
            let profiles: [ProfileRow] = try await supabase
                .from("profiles")
                .select()
                .eq("user_id", value: userId)
                .limit(1)
                .execute()
                .value

            if let p = profiles.first {
                profile = p
            } else {
                let defaultName = user?.email?.split(separator: "@").first.map(String.init) ?? "Gebruiker"
                let payload = ProfileUpsertPayload(user_id: userId, display_name: defaultName, avatar_url: nil)
                try await supabase
                    .from("profiles")
                    .upsert(payload, onConflict: "user_id")
                    .execute()
                await refreshProfileAndPreferences()
                return
            }
        } catch {
            lastErrorMessage = error.localizedDescription
            profile = nil
        }

        do {
            let prefs: [UserPreferencesRow] = try await supabase
                .from("user_preferences")
                .select()
                .eq("user_id", value: userId)
                .limit(1)
                .execute()
                .value

            if let pref = prefs.first {
                preferences = pref
            } else {
                let payload = UserPreferencesUpsertPayload(user_id: userId, email_opt_in: true)
                try await supabase
                    .from("user_preferences")
                    .upsert(payload, onConflict: "user_id")
                    .execute()
                await refreshProfileAndPreferences()
                return
            }
        } catch {
            lastErrorMessage = error.localizedDescription
            preferences = nil
        }
    }

    func updateProfile(displayName: String? = nil, avatarURL: String? = nil) async -> Bool {
        guard let userId = user?.id else { return false }

        let payload = ProfileUpdatePayload(
            display_name: displayName,
            avatar_url: avatarURL
        )

        do {
            try await supabase
                .from("profiles")
                .update(payload)
                .eq("user_id", value: userId)
                .execute()

            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func updateEmailOptIn(_ enabled: Bool) async -> Bool {
        guard let userId = user?.id else { return false }

        let payload = UserPreferencesUpsertPayload(user_id: userId, email_opt_in: enabled)

        do {
            try await supabase
                .from("user_preferences")
                .upsert(payload, onConflict: "user_id")
                .execute()
            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    // MARK: - Avatar upload

    func uploadAvatar(imageData: Data, contentType: String, fileExtension: String) async -> Bool {
        guard let userId = user?.id else { return false }

        lastErrorMessage = nil
        isLoading = true
        defer { isLoading = false }

        let cleanedExt = fileExtension.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let path = "\(userId.uuidString)/avatar.\(cleanedExt.isEmpty ? "jpg" : cleanedExt)"

        do {
            try await supabase.storage
                .from("avatars")
                .upload(
                    path: path,
                    file: imageData,
                    options: FileOptions(
                        cacheControl: "3600",
                        contentType: contentType,
                        upsert: true
                    )
                )

            let publicURL = try supabase.storage
                .from("avatars")
                .getPublicURL(path: path)

            _ = await updateProfile(avatarURL: publicURL.absoluteString)
            await refreshProfileAndPreferences()
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }
}

// MARK: - Models (match DB schema)

struct ProfileRow: Codable, Hashable, Identifiable {
    var id: UUID { user_id }

    let user_id: UUID
    var display_name: String
    var role: String?
    var avatar_url: String?
    var created_at: String?
    var updated_at: String?
}

struct UserPreferencesRow: Codable, Hashable, Identifiable {
    var id: UUID { user_id }

    let user_id: UUID
    var theme: String?
    var locale: String?
    var email_opt_in: Bool?
    var updated_at: String?
}

private struct ProfileUpsertPayload: Encodable {
    let user_id: UUID
    let display_name: String
    let avatar_url: String?
}

private struct ProfileUpdatePayload: Encodable {
    var display_name: String?
    var avatar_url: String?
}

private struct UserPreferencesUpsertPayload: Encodable {
    let user_id: UUID
    let email_opt_in: Bool
}

// MARK: - OAuth presentation helper

private final class AnchorPresentationContextProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    private let anchor: ASPresentationAnchor

    init(anchor: ASPresentationAnchor) {
        self.anchor = anchor
    }

    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        anchor
    }
}

// MARK: - Private helpers

private extension AuthManager {
    func loadInitialSession() async {
        isLoading = true
        defer { isLoading = false }

        do {
            let existing = try await supabase.auth.session
            session = existing
            user = existing.user
            await refreshProfileAndPreferences()
        } catch {
            // No session is a valid state.
            session = nil
            user = nil
            profile = nil
            preferences = nil
        }
    }

    func handleAuthStateChange(event: AuthChangeEvent, session: Session?) {
        switch event {
        case .initialSession, .signedIn, .tokenRefreshed, .userUpdated:
            self.session = session
            self.user = session?.user
            if session != nil {
                Task { await self.refreshProfileAndPreferences() }
            } else {
                self.profile = nil
                self.preferences = nil
            }

        case .signedOut:
            self.session = nil
            self.user = nil
            self.profile = nil
            self.preferences = nil

        default:
            // Other events (password recovery, MFA, etc.) not used in this app yet.
            break
        }
    }

    func startWebAuthentication(
        signInURL: URL,
        callbackURLScheme: String,
        presentationAnchor: ASPresentationAnchor
    ) async throws -> URL {
        try await withCheckedThrowingContinuation { continuation in
            let provider = AnchorPresentationContextProvider(anchor: presentationAnchor)
            self.oauthPresentationContextProvider = provider

            let session = ASWebAuthenticationSession(
                url: signInURL,
                callbackURLScheme: callbackURLScheme
            ) { callbackURL, error in
                if let callbackURL {
                    continuation.resume(returning: callbackURL)
                } else if let error {
                    continuation.resume(throwing: error)
                } else {
                    continuation.resume(throwing: CancellationError())
                }
            }

            session.presentationContextProvider = provider
            session.prefersEphemeralWebBrowserSession = false
            self.webAuthSession = session

            let started = session.start()
            if !started {
                continuation.resume(throwing: CancellationError())
            }
        }
    }
}
