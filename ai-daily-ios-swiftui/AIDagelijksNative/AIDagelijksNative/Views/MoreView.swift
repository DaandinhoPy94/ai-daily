import SwiftUI

struct MoreView: View {
    var body: some View {
        NavigationStack {
            List {
                Section {
                    NavigationLink {
                        ProfileView()
                    } label: {
                        Label("Account", systemImage: "person.circle")
                    }
                    
                    NavigationLink {
                        Text("Voorkeuren")
                    } label: {
                        Label("Voorkeuren", systemImage: "gearshape")
                    }
                }
                
                Section {
                    Link(destination: URL(string: "https://aidagelijks.nl/over-ons")!) {
                        Label("Over ons", systemImage: "info.circle")
                    }
                    
                    Link(destination: URL(string: "https://aidagelijks.nl/privacy")!) {
                        Label("Privacybeleid", systemImage: "hand.raised")
                    }
                }
                
                Section {
                    Text("Versie 1.0.0 (Build 1)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Meer")
            .background(Color.brandBackground)
            .scrollContentBackground(.hidden)
        }
    }
}
