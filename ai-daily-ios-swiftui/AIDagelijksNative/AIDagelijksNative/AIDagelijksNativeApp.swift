//
//  AIDagelijksNativeApp.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 08/01/2026.
//

import SwiftUI

@main
struct AIDagelijksNativeApp: App {
    @StateObject private var auth = AuthManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(auth)
                .onOpenURL { url in
                    Task { await auth.handleOpenURL(url) }
                }
        }
    }
}
