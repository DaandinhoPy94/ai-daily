//
//  SplashScreenView.swift
//  AIDagelijksNative
//

import SwiftUI

struct SplashScreenView: View {
    @Environment(\.colorScheme) private var colorScheme
    
    var body: some View {
        let imageName = colorScheme == .dark ? "splash-logo-dark" : "splash-logo"
        
        ZStack {
            Color.brandBackground
                .ignoresSafeArea()

            Image(imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 150, height: 150)
        }
    }
}

#Preview {
    SplashScreenView()
}

