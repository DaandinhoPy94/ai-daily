import SwiftUI
import PhotosUI
import UIKit
import Auth

struct ProfileView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject private var auth: AuthManager

    /// When `true`, shows a trailing "Gereed" button that dismisses the current presentation.
    /// Keep this `false` when `ProfileView` is used inside a tab or pushed via navigation.
    let showsDoneButton: Bool

    @State private var displayName = ""
    @State private var newsletter = false
    @State private var selectedAvatarItem: PhotosPickerItem?
    @State private var avatarPreview: Image?
    @State private var isUploadingAvatar = false
    
    init(showsDoneButton: Bool = false) {
        self.showsDoneButton = showsDoneButton
    }

    var body: some View {
        Group {
            if auth.isLoading {
                ProgressView("Bezig met laden…")
            } else if auth.user == nil {
                AuthView()
            } else if auth.profile == nil {
                ProgressView("Je profiel wordt ingesteld…")
            } else {
                profileForm
            }
        }
        .navigationTitle("Profiel")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if showsDoneButton {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Gereed") { dismiss() }
                        .foregroundStyle(Color.brandTeal)
                }
            }
        }
        .onAppear {
            syncFromAuth()
        }
        .onChange(of: auth.profile) { _ in
            syncFromAuth()
        }
        .onChange(of: auth.preferences) { _ in
            syncFromAuth()
        }
    }

    private var profileForm: some View {
        Form {
            Section {
                HStack {
                    Spacer()
                    VStack(spacing: 12) {
                        avatarView

                        PhotosPicker(selection: $selectedAvatarItem, matching: .images) {
                            Text(isUploadingAvatar ? "Uploaden…" : "Foto wijzigen")
                                .font(.footnote)
                                .foregroundStyle(Color.brandTeal)
                        }
                        .disabled(isUploadingAvatar)
                    }
                    Spacer()
                }
                .listRowBackground(Color.clear)
            }

            Section(header: Text("Profielinformatie")) {
                TextField("Naam", text: $displayName)

                TextField("E-mailadres", text: .constant(auth.user?.email ?? ""))
                    .disabled(true)
                    .foregroundStyle(.secondary)
            }

            Section(header: Text("Voorkeuren")) {
                Toggle("Nieuwsbrief", isOn: $newsletter)
                    .tint(Color.brandTeal)
                    .onChange(of: newsletter) { newValue in
                        Task { _ = await auth.updateEmailOptIn(newValue) }
                    }
            }

            if let err = auth.lastErrorMessage {
                Section {
                    Text(err)
                        .font(.footnote)
                        .foregroundStyle(.red)
                }
            }

            Section {
                Button("Profiel opslaan") {
                    Task {
                        _ = await auth.updateProfile(displayName: displayName)
                        dismiss()
                    }
                }
                .frame(maxWidth: .infinity)
                .foregroundStyle(Color.brandTeal)
                .fontWeight(.semibold)

                Button("Uitloggen") {
                    Task {
                        await auth.signOut()
                    }
                }
                .frame(maxWidth: .infinity)
                .foregroundStyle(.red)
            }
        }
        .onChange(of: selectedAvatarItem) { newItem in
            guard let newItem else { return }
            Task {
                isUploadingAvatar = true
                defer { isUploadingAvatar = false }

                do {
                    guard let data = try await newItem.loadTransferable(type: Data.self),
                          let uiImage = UIImage(data: data),
                          let jpg = uiImage.jpegData(compressionQuality: 0.85) else {
                        return
                    }

                    avatarPreview = Image(uiImage: uiImage)
                    _ = await auth.uploadAvatar(imageData: jpg, contentType: "image/jpeg", fileExtension: "jpg")
                } catch {
                    // AuthManager will surface errors in lastErrorMessage when upload fails.
                }
            }
        }
    }

    private var avatarView: some View {
        let size: CGFloat = 80

        return Group {
            if let avatarPreview {
                avatarPreview
                    .resizable()
                    .scaledToFill()
            } else if let urlString = auth.profile?.avatar_url, let url = URL(string: urlString) {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().scaledToFill()
                    case .failure:
                        fallbackAvatar
                    case .empty:
                        ProgressView()
                    @unknown default:
                        fallbackAvatar
                    }
                }
            } else {
                fallbackAvatar
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
    }

    private var fallbackAvatar: some View {
        Circle()
            .fill(Color(.systemGray5))
            .overlay(
                Text(initials)
                    .font(.largeTitle)
                    .fontWeight(.semibold)
                    .foregroundStyle(.secondary)
            )
    }

    private var initials: String {
        let name = auth.profile?.display_name.trimmingCharacters(in: .whitespacesAndNewlines)
        if let name, !name.isEmpty {
            let parts = name.split(separator: " ")
            if parts.count >= 2 {
                let first = parts.first?.first.map(String.init) ?? ""
                let second = parts.dropFirst().first?.first.map(String.init) ?? ""
                return (first + second).uppercased()
            }
            return String(name.prefix(2)).uppercased()
        }
        if let email = auth.user?.email {
            return String(email.prefix(2)).uppercased()
        }
        return "U"
    }

    private func syncFromAuth() {
        if let p = auth.profile {
            displayName = p.display_name
        }
        newsletter = auth.preferences?.email_opt_in ?? false
    }
}
