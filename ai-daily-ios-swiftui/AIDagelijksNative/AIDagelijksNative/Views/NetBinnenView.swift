import SwiftUI

struct NetBinnenView: View {
    @ObservedObject var viewModel: NewsViewModel
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                Text("Net Binnen")
                    .font(.system(size: 24, weight: .bold, design: .default))
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.primary, .primary.opacity(0.8)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    .padding(.bottom, 12)

                ForEach(viewModel.latestArticles) { article in
                    NavigationLink(value: article) {
                        SmallNewsCardView(article: article)
                    }
                    .buttonStyle(PlainButtonStyle())
                    .padding(.horizontal, 16)
                    .padding(.bottom, 12)
                }
            }
            .padding(.bottom, 120) // Space for tab bar
        }
        .background(Color.brandBackground)
    }
}
