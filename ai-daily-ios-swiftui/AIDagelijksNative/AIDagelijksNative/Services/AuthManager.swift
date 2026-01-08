//
//  AuthManager.swift
//  AIDagelijksNative
//

import Foundation
import SwiftUI
import Combine
import Supabase
import AuthenticationServices

@MainActor
final class AuthManager: ObservableObject {
    // MARK: - Public state

    @Published private(set) var session: Session?
    @Published private(set) var user: User?
    @Published private(set) var profile: ProfileRow?
    @Published private(set) var preferences: UserPreferencesRow?
    @Published private(set) var isLoading: Bool = true
    @Published var lastErrorMessage: String?

    // MARK: - Internals

    private let supabase: SupabaseClient
    private var authListenerTask: Task<Void, Never>?
    private var oauthPresentationContextProvider: AnchorPresentationContextProvider?

    init() {
        self.supabase = SupabaseSDK.client
        bootstrap()
    }

    init(supabase: SupabaseClient) {
        self.supabase = supabase
        bootstrap()
    }

    deinit {
        authListenerTask?.cancel()
    }

    // MARK: - Bootstrap / lifecycle

    func bootstrap() {
        isLoading = true
        lastErrorMessage = nil

        authListenerTask?.cancel()
        authListenerTask = Task { [weak self] in
            guard let self else { return }
            for await (event, session) in supabase.auth.authStateChanges {
                await self.handleAuthEvent(event: event, session: session)
            }
        }

        Task {
            // Load any existing session from storage (Keychain).
            session = supabase.auth.currentSession
            user = session?.user

            if user != nil {
                await refreshProfileAndPreferences()
            } else {
                profile = nil
                preferences = nil
            }

            isLoading = false
        }
    }

    private func handleAuthEvent(event: AuthChangeEvent, session: Session?) async {
        self.session = session
        self.user = session?.user

        switch event {
        case .signedIn, .tokenRefreshed:
            await refreshProfileAndPreferences()
        case .signedOut:
            profile = nil
            preferences = nil
        default:
            break
        }
    }

    // MARK: - URL handling (OAuth callback)

    func handleOpenURL(_ url: URL) async {
        do {
            _ = try await supabase.auth.session(from: url)
        } catch {
            lastErrorMessage = error.localizedDescription
        }
    }

    // MARK: - Auth actions

    func signIn(email: String, password: String) async -> Bool {
        lastErrorMessage = nil
        do {
            _ = try await supabase.auth.signIn(email: email, password: password)
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signUp(email: String, password: String) async -> Bool {
        lastErrorMessage = nil
        do {
            _ = try await supabase.auth.signUp(
                email: email,
                password: password,
                redirectTo: SupabaseSDK.redirectURL
            )
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signInWithGoogle(presentationAnchor: ASPresentationAnchor) async -> Bool {
        lastErrorMessage = nil
        do {
            // Keep a strong reference; `ASWebAuthenticationSession.presentationContextProvider` is weak.
            let provider = AnchorPresentationContextProvider(anchor: presentationAnchor)
            self.oauthPresentationContextProvider = provider

            _ = try await supabase.auth.signInWithOAuth(
                provider: .google,
                redirectTo: SupabaseSDK.redirectURL
            ) { session in
                session.presentationContextProvider = provider
                session.prefersEphemeralWebBrowserSession = false
            }
            self.oauthPresentationContextProvider = nil
            return true
        } catch {
            self.oauthPresentationContextProvider = nil
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func signOut() async {
        lastErrorMessage = nil
        do {
            try await supabase.auth.signOut()
        } catch {
            lastErrorMessage = error.localizedDescription
        }
    }

    // MARK: - Profile / Preferences

    func refreshProfileAndPreferences() async {
        guard let userId = user?.id else { return }
        lastErrorMessage = nil

        do {
            // Ensure profile exists / is populated (idempotent).
            _ = try await ensureProfile(userId: userId)

            // Fetch profile + preferences.
            profile = try await fetchProfile(userId: userId)
            preferences = try await fetchPreferencesOrCreateDefault(userId: userId)
        } catch {
            lastErrorMessage = error.localizedDescription
        }
    }

    func updateProfile(displayName: String? = nil, avatarURL: String? = nil) async -> Bool {
        guard let userId = user?.id else { return false }
        lastErrorMessage = nil

        do {
            var payload = ProfileUpdatePayload()
            if let displayName { payload.display_name = displayName }
            if let avatarURL { payload.avatar_url = avatarURL }

            try await supabase
                .from("profiles")
                .update(payload)
                .eq("user_id", value: userId)
                .execute()

            profile = try await fetchProfile(userId: userId)
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    func updateEmailOptIn(_ enabled: Bool) async -> Bool {
        guard let userId = user?.id else { return false }
        lastErrorMessage = nil

        do {
            let payload = UserPreferencesUpsertPayload(user_id: userId, email_opt_in: enabled)
            try await supabase
                .from("user_preferences")
                .upsert(payload, onConflict: "user_id")
                .execute()

            preferences = try await fetchPreferencesOrCreateDefault(userId: userId)
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

        do {
            let path = "\(userId.uuidString)/\(Int(Date().timeIntervalSince1970)).\(fileExtension)"

            try await supabase.storage
                .from("avatars")
                .upload(
                    path,
                    data: imageData,
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
            return true
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    // MARK: - Helpers

    private func ensureProfile(userId: UUID) async throws -> ProfileRow? {
        func metadataString(_ key: String) -> String? {
            // `userMetadata` is a JSON-like type from Supabase Auth; keep access isolated
            // to avoid compiler type-check blowups.
            return user?.userMetadata[key]?.stringValue
        }

        let displayNameFromMetadata =
            metadataString("full_name")
            ?? metadataString("name")
            ?? metadataString("display_name")

        let displayNameFromEmail: String? = {
            guard let email = user?.email else { return nil }
            return email.split(separator: "@").first.map(String.init)
        }()

        let displayName = displayNameFromMetadata ?? displayNameFromEmail ?? "Gebruiker"

        let avatarUrl = metadataString("avatar_url") ?? metadataString("picture")

        let payload = ProfileUpsertPayload(
            user_id: userId,
            display_name: displayName,
            avatar_url: avatarUrl
        )

        try await supabase
            .from("profiles")
            .upsert(payload, onConflict: "user_id")
            .execute()

        // Follow-up select (may be blocked by RLS on some setups; ignore errors upstream).
        return try? await fetchProfile(userId: userId)
    }

    private func fetchProfile(userId: UUID) async throws -> ProfileRow? {
        let rows: [ProfileRow] = try await supabase
            .from("profiles")
            .select()
            .eq("user_id", value: userId)
            .limit(1)
            .execute()
            .value
        return rows.first
    }

    private func fetchPreferencesOrCreateDefault(userId: UUID) async throws -> UserPreferencesRow? {
        let rows: [UserPreferencesRow] = try await supabase
            .from("user_preferences")
            .select()
            .eq("user_id", value: userId)
            .limit(1)
            .execute()
            .value

        if let existing = rows.first {
            return existing
        }

        // Create defaults (mirrors web behavior).
        let inserted: [UserPreferencesRow] = try await supabase
            .from("user_preferences")
            .insert(UserPreferencesUpsertPayload(user_id: userId, email_opt_in: true))
            .select()
            .execute()
            .value
        return inserted.first
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
    var id: UUID { UUID(uuidString: user_id) ?? UUID() }

    let user_id: String
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

