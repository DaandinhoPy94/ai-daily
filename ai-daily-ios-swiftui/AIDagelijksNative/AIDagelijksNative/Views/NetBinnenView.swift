import SwiftUI

struct NetBinnenView: View {
    @ObservedObject var viewModel: NewsViewModel
    
    var body: some View {
        ZStack(alignment: .topLeading) {
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
                .padding(.top, 60) // Space for the fixed header
                .padding(.bottom, 16)
            }

            Text("Net Binnen")
                .font(.system(size: 24, weight: .bold, design: .default))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.primary, .primary.opacity(0.8)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 12)
        }
        .background(Color.brandBackground)
    }
}
