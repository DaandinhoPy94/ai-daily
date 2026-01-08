import SwiftUI

struct ArticleDetailView: View {
    let article: Article
    @StateObject private var viewModel = NewsViewModel()
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
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
                
                VStack(alignment: .leading, spacing: 24) {
                    // Header Info
                    VStack(alignment: .leading, spacing: 16) {
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
                        
                        Text(article.title)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundStyle(.primary)
                            .lineSpacing(4)
                        
                        if let author = viewModel.currentArticle?.author {
                            HStack(spacing: 12) {
                                if let avatarURL = author.avatarURL, let url = URL(string: avatarURL) {
                                    AsyncImage(url: url) { image in
                                        image.resizable().scaledToFill()
                                    } placeholder: {
                                        Color.gray.opacity(0.3)
                                    }
                                    .frame(width: 40, height: 40)
                                    .clipShape(Circle())
                                }
                                
                                Text("Door \(author.name)")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    
                    // "In het kort" Summary Section
                    if let summary = viewModel.currentArticle?.summary {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("In het kort")
                                .font(.headline)
                                .fontWeight(.bold)
                            
                            // Simulating bullet points since we only have a summary string
                            HStack(alignment: .top, spacing: 12) {
                                Circle()
                                    .fill(Color.brandOrange)
                                    .frame(width: 6, height: 6)
                                    .padding(.top, 8)
                                
                                Text(summary)
                                    .font(.body)
                                    .lineSpacing(6)
                            }
                        }
                        .padding(20)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                    
                    // Body Content
                    if let bodyContent = viewModel.currentArticle?.body {
                        HTMLText(html: bodyContent, width: UIScreen.main.bounds.width - 40)
                    } else {
                        // Loading state or fallback
                        if viewModel.isLoading {
                            ProgressView()
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding(.vertical, 40)
                        }
                    }
                    
                    Divider()
                        .padding(.vertical, 16)
                    
                    // "Het laatste nieuws" Section
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            Text("Het laatste nieuws")
                                .font(.title3)
                                .fontWeight(.bold)
                            
                            Spacer()
                            
                            NavigationLink(destination: Text("Net Binnen Pagina")) { // Replace with actual destination
                                Text("Net binnen")
                                    .font(.subheadline)
                                    .foregroundStyle(Color.brandOrange)
                            }
                        }
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(viewModel.latestArticles.prefix(5)) { item in
                                    NavigationLink(destination: ArticleDetailView(article: item)) {
                                        VStack(alignment: .leading, spacing: 8) {
                                            AsyncImage(url: item.listThumbURL) { image in
                                                image.resizable().scaledToFill()
                                            } placeholder: {
                                                Color.gray.opacity(0.3)
                                            }
                                            .frame(width: 160, height: 100)
                                            .cornerRadius(8)
                                            .clipped()
                                            
                                            Text(item.title)
                                                .font(.caption)
                                                .fontWeight(.semibold)
                                                .lineLimit(3)
                                                .multilineTextAlignment(.leading)
                                                .foregroundStyle(.primary)
                                                .frame(width: 160, alignment: .leading)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    Divider()
                        .padding(.vertical, 16)
                    
                    // "Lees ook" (Related Articles)
                    if !viewModel.relatedArticles.isEmpty {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Lees ook")
                                .font(.title3)
                                .fontWeight(.bold)
                            
                            ForEach(viewModel.relatedArticles) { related in
                                NavigationLink(destination: ArticleDetailView(article: related)) {
                                    HStack(spacing: 12) {
                                        AsyncImage(url: related.listThumbURL) { image in
                                            image.resizable().scaledToFill()
                                        } placeholder: {
                                            Color.gray.opacity(0.3)
                                        }
                                        .frame(width: 80, height: 60)
                                        .cornerRadius(6)
                                        .clipped()
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            if let topic = related.topicName {
                                                Text(topic)
                                                    .font(.caption2)
                                                    .fontWeight(.bold)
                                                    .foregroundStyle(Color.brandOrange)
                                            }
                                            
                                            Text(related.title)
                                                .font(.subheadline)
                                                .fontWeight(.semibold)
                                                .lineLimit(2)
                                                .multilineTextAlignment(.leading)
                                                .foregroundStyle(.primary)
                                        }
                                        Spacer()
                                    }
                                }
                                Divider()
                            }
                        }
                    }
                    
                    // "Gerelateerde onderwerpen" (Topics)
                    if let topics = viewModel.currentArticle?.topics, !topics.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Gerelateerde onderwerpen")
                                .font(.headline)
                                .fontWeight(.bold)
                            
                            FlowLayout(spacing: 8) {
                                ForEach(topics) { topic in
                                    Text(topic.name)
                                        .font(.caption)
                                        .fontWeight(.medium)
                                        .padding(.horizontal, 12)
                                        .padding(.vertical, 6)
                                        .background(Color(.systemGray6))
                                        .cornerRadius(16)
                                }
                            }
                        }
                        .padding(.vertical, 16)
                    }
                    
                    // Comments Section
                    VStack(alignment: .leading, spacing: 20) {
                        Text("Reacties (\(viewModel.comments.count))")
                            .font(.title3)
                            .fontWeight(.bold)
                        
                        if viewModel.comments.isEmpty {
                            Text("Nog geen reacties. Wees de eerste!")
                                .font(.body)
                                .foregroundStyle(.secondary)
                                .padding(.vertical, 20)
                        } else {
                            ForEach(viewModel.comments) { comment in
                                CommentRow(comment: comment)
                                Divider()
                            }
                        }
                    }
                    .padding(.bottom, 40)
                }
                .padding(20) // Horizontal padding for the content
            }
        }
        .background(Color.brandBackground)
        .ignoresSafeArea(edges: .top)
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
        .onAppear {
            Task {
                await viewModel.fetchArticleDetail(id: article.id)
                await viewModel.fetchLatestArticles(limit: 5) // Fetch for "Latest News" rail
            }
        }
    }
}

// Helper for FlowLayout (Chips)
struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = computeRows(proposal: proposal, subviews: subviews)
        let height = rows.map { $0.height }.reduce(0, +) + CGFloat(max(0, rows.count - 1)) * spacing
        return CGSize(width: proposal.width ?? 0, height: height)
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let rows = computeRows(proposal: proposal, subviews: subviews)
        var y = bounds.minY
        for row in rows {
            var x = bounds.minX
            for item in row.items {
                item.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
                x += item.dimensions(in: .unspecified).width + spacing
            }
            y += row.height + spacing
        }
    }
    
    struct Row {
        var items: [LayoutSubview]
        var height: CGFloat
    }
    
    func computeRows(proposal: ProposedViewSize, subviews: Subviews) -> [Row] {
        var rows: [Row] = []
        var currentRowItems: [LayoutSubview] = []
        var currentRowWidth: CGFloat = 0
        var currentRowHeight: CGFloat = 0
        let maxWidth = proposal.width ?? 0
        
        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if currentRowWidth + size.width + spacing > maxWidth {
                rows.append(Row(items: currentRowItems, height: currentRowHeight))
                currentRowItems = [subview]
                currentRowWidth = size.width
                currentRowHeight = size.height
            } else {
                currentRowItems.append(subview)
                currentRowWidth += size.width + spacing
                currentRowHeight = max(currentRowHeight, size.height)
            }
        }
        if !currentRowItems.isEmpty {
            rows.append(Row(items: currentRowItems, height: currentRowHeight))
        }
        return rows
    }
}
