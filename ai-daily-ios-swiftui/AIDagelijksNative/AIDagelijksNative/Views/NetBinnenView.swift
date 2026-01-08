import SwiftUI

struct NetBinnenView: View {
    @ObservedObject var viewModel: NewsViewModel
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(viewModel.latestArticles) { article in
                    NavigationLink(value: article) {
                        SmallNewsCardView(article: article)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)
                }
            }
            .padding(.top, 12)
            .padding(.bottom, 120) // Space for tab bar
        }
        .background(Color.brandBackground)
    }
}
