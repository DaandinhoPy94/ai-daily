import SwiftUI

struct NetBinnenView: View {
    @ObservedObject var viewModel: NewsViewModel
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {
                Section {
                    ForEach(viewModel.latestArticles) { article in
                        NavigationLink(value: article) {
                            SmallNewsCardView(article: article)
                        }
                        .buttonStyle(PlainButtonStyle())
                        .padding(.horizontal, 16)
                        .padding(.bottom, 12)
                    }
                } header: {
                    HStack {
                        Text("Net Binnen")
                            .font(.title2)
                            .fontWeight(.bold)
                        Spacer()
                    }
                    .padding()
                    .background(.ultraThinMaterial)
                }
            }
            .padding(.top, 20)
            .padding(.bottom, 120) // Space for tab bar
        }
        .background(Color.brandBackground)
    }
}
