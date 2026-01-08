import SwiftUI

struct LargeNewsCardView: View {
    let article: Article
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Hero Image
            AsyncImage(url: article.heroImageURL) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(Color(.systemGray5))
                        .overlay(ProgressView())
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                case .failure:
                    Rectangle()
                        .fill(Color(.systemGray5))
                        .overlay(
                            Image(systemName: "photo")
                                .font(.largeTitle)
                                .foregroundStyle(.secondary)
                        )
                @unknown default:
                    EmptyView()
                }
            }
            .frame(height: 220)
            .clipShape(RoundedRectangle(cornerRadius: 20))
            
            // Content
            VStack(alignment: .leading, spacing: 8) {
                // Meta info
                HStack(spacing: 8) {
                    if let topicName = article.topicName {
                        Text(topicName)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(Color.brandTeal)
                    }
                    
                    if !article.timeAgo.isEmpty {
                        Text("•")
                            .foregroundStyle(.secondary)
                        Text(article.timeAgo)
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                    }
                }
                
                // Title
                Text(article.title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(.primary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                
                // Snippet / Summary
                if let summary = article.summary {
                    Text(summary)
                        .font(.system(size: 15))
                        .foregroundStyle(.secondary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .background(.background, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(Color(.separator), lineWidth: 0.5)
        )
    }
}
