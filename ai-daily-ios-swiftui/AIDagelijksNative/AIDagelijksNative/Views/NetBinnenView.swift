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
            .padding(.top, 16)
            .padding(.bottom, 16)
        }
        .navigationTitle("Net Binnen")
        .background(Color.brandBackground)
    }
}
