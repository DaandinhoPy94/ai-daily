import SwiftUI

struct ProfileView: View {
    @Environment(\.dismiss) var dismiss
    @State private var name = "Gebruiker"
    @State private var email = "gebruiker@example.com"
    @State private var newsletter = true
    
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack {
                        Spacer()
                        VStack(spacing: 12) {
                            Circle()
                                .fill(Color(.systemGray5))
                                .frame(width: 80, height: 80)
                                .overlay(
                                    Text(String(name.prefix(1)))
                                        .font(.largeTitle)
                                        .fontWeight(.semibold)
                                        .foregroundStyle(.secondary)
                                )
                            
                            Button("Foto wijzigen") {
                                // TODO: Implement image picker
                            }
                            .font(.footnote)
                            .foregroundStyle(Color.brandOrange)
                        }
                        Spacer()
                    }
                    .listRowBackground(Color.clear)
                }
                
                Section(header: Text("Profielinformatie")) {
                    TextField("Naam", text: $name)
                    
                    TextField("E-mailadres", text: $email)
                        .disabled(true)
                        .foregroundStyle(.secondary)
                }
                
                Section(header: Text("Voorkeuren")) {
                    Toggle("Nieuwsbrief", isOn: $newsletter)
                        .tint(Color.brandOrange)
                }
                
                Section {
                    Button("Profiel opslaan") {
                        dismiss()
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(Color.brandOrange)
                    .fontWeight(.semibold)
                }
            }
            .navigationTitle("Profiel")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Gereed") {
                        dismiss()
                    }
                    .foregroundStyle(Color.brandOrange)
                }
            }
        }
    }
}
