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
    @State private var showSplash = true

    var body: some Scene {
        WindowGroup {
            ZStack {
                if showSplash {
                    SplashScreenView()
                        .transition(.opacity)
                } else {
                    ContentView()
                        .transition(.opacity)
                }
            }
            .environmentObject(auth)
            .onOpenURL { url in
                Task { await auth.handleOpenURL(url) }
            }
            .task {
                guard showSplash else { return }
                try? await Task.sleep(for: .seconds(2))
                await MainActor.run {
                    withAnimation(.easeInOut(duration: 0.35)) {
                        showSplash = false
                    }
                }
            }
        }
    }
}
