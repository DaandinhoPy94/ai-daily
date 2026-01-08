//
//  SplashScreenView.swift
//  AIDagelijksNative
//

import SwiftUI

struct SplashScreenView: View {
    var body: some View {
        ZStack {
            Color.brandBackground
                .ignoresSafeArea()

            Image("splash-logo")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 150, height: 150)
        }
    }
}

#Preview {
    SplashScreenView()
}

