import SwiftUI

struct SearchView: View {
    @Binding var isPresented: Bool
    @State private var searchText = ""
    @FocusState private var isFocused: Bool
    
    var body: some View {
        ZStack(alignment: .top) {
            // Blurred Background
            Color.black.opacity(0.3)
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation {
                        isPresented = false
                    }
                }
            
            // Search Content
            VStack(spacing: 0) {
                // Header
                HStack(spacing: 12) {
                    // Search Bar
                    HStack(spacing: 8) {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(.secondary)
                        
                        TextField("Zoeken...", text: $searchText)
                            .focused($isFocused)
                            .submitLabel(.search)
                        
                        if !searchText.isEmpty {
                            Button(action: { searchText = "" }) {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color(.systemGray6))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    
                    // Close Button
                    Button("Annuleer") {
                        withAnimation {
                            isPresented = false
                        }
                    }
                    .foregroundStyle(Color.brandOrange)
                }
                .padding()
                .background(.ultraThinMaterial)
                
                // Results Placeholder
                if !searchText.isEmpty {
                    List {
                        Text("Zoekresultaten voor '\(searchText)'")
                            .foregroundStyle(.secondary)
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(Color.brandBackground)
                } else {
                    Spacer()
                }
            }
            .frame(maxHeight: searchText.isEmpty ? 100 : .infinity)
            .background(Color.brandBackground)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            .shadow(radius: 20)
            .padding(.top, 60) // Safe area inset
            .transition(.move(edge: .top))
        }
        .onAppear {
            isFocused = true
        }
    }
}
