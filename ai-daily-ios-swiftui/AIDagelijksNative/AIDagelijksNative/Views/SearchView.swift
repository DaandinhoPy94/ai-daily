import SwiftUI

struct SearchView: View {
    @Binding var isPresented: Bool
    @State private var searchText = ""
    @FocusState private var isSearchFocused: Bool
    
    var body: some View {
        NavigationStack {
            List {
                if searchText.isEmpty {
                    ContentUnavailableView(
                        "Zoeken",
                        systemImage: "magnifyingglass",
                        description: Text("Typ om te zoeken.")
                    )
                } else {
                    Text("Zoekresultaten voor '\(searchText)'")
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Zoeken")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Annuleer") {
                        isPresented = false
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Zoeken…")
            .searchFocused($isSearchFocused)
            .onAppear { isSearchFocused = true }
        }
        .tint(Color.brandTeal)
    }
}
