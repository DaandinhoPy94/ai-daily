//
//  AuthManager.swift
//  AIDagelijksNative
//

import Foundation
import SwiftUI
import Combine
// import Supabase
import AuthenticationServices

@MainActor
final class AuthManager: ObservableObject {
    // MARK: - Public state

    @Published private(set) var session: Any? = nil // Session?
    @Published private(set) var user: UserStub? = nil // User?
    @Published private(set) var profile: ProfileRow?
    @Published private(set) var preferences: UserPreferencesRow?
    @Published private(set) var isLoading: Bool = false
    @Published var lastErrorMessage: String?

    // MARK: - Internals

    // private let supabase: SupabaseClient
    // private var authListenerTask: Task<Void, Never>?
    // private var oauthPresentationContextProvider: AnchorPresentationContextProvider?

    init() {
        // self.supabase = SupabaseSDK.client
        // bootstrap()
    }

    /*
    init(supabase: SupabaseClient) {
        self.supabase = supabase
        bootstrap()
    }
    */

    deinit {
        // authListenerTask?.cancel()
    }

    // MARK: - Bootstrap / lifecycle

    func bootstrap() {
        isLoading = false
    }

    // MARK: - URL handling (OAuth callback)

    func handleOpenURL(_ url: URL) async {
        // no-op
    }

    // MARK: - Auth actions

    func signIn(email: String, password: String) async -> Bool {
        lastErrorMessage = "Auth is currently disabled."
        return false
    }

    func signUp(email: String, password: String) async -> Bool {
        lastErrorMessage = "Auth is currently disabled."
        return false
    }

    func signInWithGoogle(presentationAnchor: ASPresentationAnchor) async -> Bool {
        lastErrorMessage = "Auth is currently disabled."
        return false
    }

    func signOut() async {
        // no-op
    }

    // MARK: - Profile / Preferences

    func refreshProfileAndPreferences() async {
        // no-op
    }

    func updateProfile(displayName: String? = nil, avatarURL: String? = nil) async -> Bool {
        return false
    }

    func updateEmailOptIn(_ enabled: Bool) async -> Bool {
        return false
    }

    // MARK: - Avatar upload

    func uploadAvatar(imageData: Data, contentType: String, fileExtension: String) async -> Bool {
        return false
    }
}

// Stub for User to satisfy ProfileView usage
struct UserStub: Codable, Hashable, Identifiable {
    var id: UUID = UUID()
    var email: String?
    var userMetadata: [String: AnyJSON] = [:]
    
    struct AnyJSON: Codable, Hashable {
        var stringValue: String?
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

