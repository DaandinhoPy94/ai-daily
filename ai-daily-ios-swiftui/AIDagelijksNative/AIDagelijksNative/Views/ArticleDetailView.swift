import SwiftUI

struct ArticleDetailView: View {
    let article: Article
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Hero Image
                AsyncImage(url: article.heroImageURL) { phase in
                    switch phase {
                    case .empty:
                        Rectangle()
                            .fill(Color(.systemGray5))
                            .frame(height: 250)
                    case .success(let image):
                        image
                            .resizable()
                            .scaledToFill()
                            .frame(height: 250)
                            .clipped()
                    case .failure:
                        Rectangle()
                            .fill(Color(.systemGray5))
                            .frame(height: 250)
                    @unknown default:
                        EmptyView()
                    }
                }
                
                VStack(alignment: .leading, spacing: 16) {
                    // Meta
                    HStack {
                        if let topic = article.topicName {
                            Text(topic)
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundStyle(Color.brandOrange)
                        }
                        
                        Spacer()
                        
                        Text(article.timeAgo)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    
                    // Title
                    Text(article.title)
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundStyle(.primary)
                    
                    // Summary / Content
                    if let summary = article.summary {
                        Text(summary)
                            .font(.body)
                            .lineSpacing(6)
                            .foregroundStyle(.primary)
                    }
                    
                    // Placeholder for full content if not available
                    Text("Lees het volledige artikel op onze website.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .padding(.top, 20)
                }
                .padding(20)
            }
        }
        .background(Color.brandBackground)
        .ignoresSafeArea(edges: .top)
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
    }
}
