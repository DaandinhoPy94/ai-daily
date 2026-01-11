import SwiftUI

struct SmallNewsCardView: View {
    let article: Article
    
    var body: some View {
        HStack(spacing: 12) {
            // Thumbnail (Left)
            AsyncImage(url: article.listThumbURL) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(Color(.systemGray5))
                case .success(let image):
                    image
                        .resizable()
                        .scaledToFill()
                case .failure:
                    Rectangle()
                        .fill(Color(.systemGray5))
                        .overlay(
                            Image(systemName: "photo")
                                .foregroundStyle(.secondary)
                        )
                @unknown default:
                    EmptyView()
                }
            }
            .frame(width: 80, height: 80)
            .clipShape(RoundedRectangle(cornerRadius: 20)) // 20pt radius as requested
            
            // Content (Right)
            VStack(alignment: .leading, spacing: 4) {
                // Topic / Meta
                HStack(spacing: 6) {
                    if let topicName = article.topicName {
                        Text(topicName)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(Color.brandTeal)
                    }
                    
                    if !article.readTimeDisplay.isEmpty {
                        Text(article.readTimeDisplay)
                            .font(.system(size: 11))
                            .foregroundStyle(.secondary)
                    }
                }
                
                // Title
                Text(article.title)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(.primary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                
                // Time / Source
                HStack(spacing: 4) {
                    if !article.timeAgo.isEmpty {
                        Text(article.timeAgo)
                            .font(.system(size: 11))
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            // Chevron
            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(.tertiary)
        }
        .padding(12)
        .background(.background, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .stroke(Color(.separator), lineWidth: 0.5)
        )
    }
}
