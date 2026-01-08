//
//  AuthView.swift
//  AIDagelijksNative
//

import SwiftUI
import AuthenticationServices

struct AuthView: View {
    enum Tab: String, CaseIterable, Identifiable {
        case signin = "Inloggen"
        case signup = "Registreren"

        var id: String { rawValue }
    }

    @EnvironmentObject private var auth: AuthManager

    @State private var tab: Tab = .signin
    @State private var email = ""
    @State private var password = ""
    @State private var showPassword = false
    @State private var isWorking = false
    @State private var infoMessage: String?

    var body: some View {
        VStack(spacing: 16) {
            VStack(spacing: 6) {
                Text("Welkom bij AI Dagelijks")
                    .font(.title2)
                    .fontWeight(.semibold)

                Text("Log in of maak een account aan.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding(.top, 12)

            Picker("Auth", selection: $tab) {
                ForEach(Tab.allCases) { tab in
                    Text(tab.rawValue).tag(tab)
                }
            }
            .pickerStyle(.segmented)

            VStack(spacing: 12) {
                Button {
                    Task {
                        await signInWithGoogle()
                    }
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "g.circle")
                        Text(tab == .signup ? "Registreren met Google" : "Inloggen met Google")
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .disabled(isWorking)

                Divider()
            }

            VStack(spacing: 12) {
                TextField("E-mailadres", text: $email)
                    .textContentType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .padding(12)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                HStack(spacing: 10) {
                    Group {
                        if showPassword {
                            TextField("Wachtwoord", text: $password)
                                .textContentType(tab == .signup ? .newPassword : .password)
                                .textInputAutocapitalization(.never)
                                .autocorrectionDisabled()
                        } else {
                            SecureField("Wachtwoord", text: $password)
                                .textContentType(tab == .signup ? .newPassword : .password)
                        }
                    }

                    Button {
                        showPassword.toggle()
                    } label: {
                        Image(systemName: showPassword ? "eye.slash" : "eye")
                            .foregroundStyle(.secondary)
                    }
                    .buttonStyle(.plain)
                }
                .padding(12)
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))

                if tab == .signup {
                    Text("Minimaal 6 karakters")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Button {
                    Task {
                        await submitEmailPassword()
                    }
                } label: {
                    Text(tab == .signup ? "Account aanmaken" : "Inloggen")
                        .fontWeight(.semibold)
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .disabled(isWorking || email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || password.isEmpty)
            }

            if let infoMessage {
                Text(infoMessage)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            if let err = auth.lastErrorMessage {
                Text(err)
                    .font(.footnote)
                    .foregroundStyle(.red)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            Spacer(minLength: 0)
        }
        .padding(20)
    }

    private func submitEmailPassword() async {
        isWorking = true
        infoMessage = nil
        defer { isWorking = false }

        let trimmedEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)

        if tab == .signin {
            _ = await auth.signIn(email: trimmedEmail, password: password)
        } else {
            let ok = await auth.signUp(email: trimmedEmail, password: password)
            if ok {
                infoMessage = "Account aangemaakt. Controleer je e-mail voor de bevestigingslink."
            }
        }
    }

    private func signInWithGoogle() async {
        guard let anchor = currentPresentationAnchor() else {
            infoMessage = "Kon geen venster vinden om Google login te starten."
            return
        }

        isWorking = true
        infoMessage = nil
        defer { isWorking = false }

        _ = await auth.signInWithGoogle(presentationAnchor: anchor)
    }

    private func currentPresentationAnchor() -> ASPresentationAnchor? {
        let scenes = UIApplication.shared.connectedScenes
        let windowScenes = scenes.compactMap { $0 as? UIWindowScene }
        let windows = windowScenes.flatMap { $0.windows }
        return windows.first(where: { $0.isKeyWindow }) ?? windows.first
    }
}

