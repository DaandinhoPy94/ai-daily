//
//  SupabaseSDK.swift
//  AIDagelijksNative
//
//  Official Supabase Swift SDK client used for authenticated flows.
//

import Foundation
import Supabase
import Auth

enum SupabaseSDK {
    static let redirectURL = URL(string: "aidagelijksnative://auth/callback")!

    static let client: SupabaseClient = {
        let supabaseURL = URL(string: SupabaseConfig.url)!

        return SupabaseClient(
            supabaseURL: supabaseURL,
            supabaseKey: SupabaseConfig.anonKey,
            options: SupabaseClientOptions(
                auth: .init(
                    storage: KeychainLocalStorage(service: "nl.aidagelijks.AIDagelijksNative.supabase"),
                    redirectToURL: redirectURL,
                    flowType: .pkce
                )
            )
        )
    }()
}

