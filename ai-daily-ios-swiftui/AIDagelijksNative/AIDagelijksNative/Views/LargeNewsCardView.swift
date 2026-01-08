import SwiftUI

struct LargeNewsCardView: View {
    let article: Article
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
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
                            .foregroundStyle(Color.brandOrange)
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
            .padding(.horizontal, 4)
            .padding(.bottom, 12)
        }
        .background(Color(.systemBackground))
        // We don't necessarily need a background container if it's just the image and text, 
        // but the prompt implies "Cards". 
        // "Style: Full-width high-quality image at the top, with the title and a snippet... positioned clearly below"
        // I'll keep it clean without a visible card border/shadow for the large one unless requested, 
        // or maybe just the image has the radius.
        // Wait, "Cards: Use a clean 20pt corner radius for all images and card containers."
        // I'll wrap it in a card style just to be safe and consistent.
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.05), radius: 10, x: 0, y: 4)
    }
}
