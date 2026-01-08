//
//  TopicDetailView.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 09/01/2026.
//

import SwiftUI

struct TopicDetailView: View {
    let topic: Topic
    @EnvironmentObject var viewModel: NewsViewModel
    
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                if viewModel.isLoading {
                    ProgressView()
                        .padding(.top, 40)
                } else if let error = viewModel.error {
                    Text(error)
                        .foregroundStyle(.red)
                        .padding()
                } else if viewModel.topicArticles.isEmpty {
                    Text("Geen artikelen gevonden voor dit onderwerp.")
                        .foregroundStyle(.secondary)
                        .padding(.top, 40)
                } else {
                    ForEach(viewModel.topicArticles) { article in
                        NavigationLink(destination: ArticleDetailView(article: article)) {
                            SmallNewsCardView(article: article)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding()
        }
        .navigationTitle(topic.name)
        .navigationBarTitleDisplayMode(.large)
        .background(Color.brandBackground)
        .task {
            await viewModel.fetchArticles(forTopic: topic.slug)
        }
    }
}
