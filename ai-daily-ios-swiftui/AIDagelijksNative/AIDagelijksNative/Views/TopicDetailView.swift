//
//  TopicDetailView.swift
//  AIDagelijksNative
//

import SwiftUI

struct TopicDetailView: View {
    let topic: Topic
    @EnvironmentObject var viewModel: NewsViewModel
    
    var body: some View {
        ZStack {
            Color.brandBackground
                .ignoresSafeArea()
            
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    
                    // MARK: - Content State Logic
                    if viewModel.isLoading {
                        VStack {
                            ProgressView()
                                .controlSize(.large)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.top, 100)
                    } else if let error = viewModel.error {
                        ContentUnavailableView {
                            Label("Fout bij laden", systemImage: "exclamationmark.triangle")
                        } description: {
                            Text(error)
                        }
                    } else if viewModel.topicArticles.isEmpty {
                        ContentUnavailableView {
                            Label("Geen artikelen", systemImage: "doc.text.magnifyingglass")
                        } description: {
                            Text("Er zijn momenteel geen artikelen gevonden voor dit onderwerp.")
                        }
                    } else {
                        // MARK: - Articles List
                        ForEach(viewModel.topicArticles) { article in
                            NavigationLink(destination: ArticleDetailView(article: article)) {
                                SmallNewsCardView(article: article)
                            }
                            .buttonStyle(.plain)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 16)
                        }
                    }
                }
            }
        }
        // MARK: - Apple UI Modifiers
        .navigationTitle(topic.name) // Nodig voor de 'Back' knop in de volgende view
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar) // Houdt de balk transparant
        .task {
            await viewModel.fetchArticles(forTopic: topic)
        }
    }
}