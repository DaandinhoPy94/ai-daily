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
        ZStack(alignment: .topLeading) {
            ScrollView {
                LazyVStack(spacing: 0) {
                    if viewModel.isLoading {
                        ProgressView()
                            .padding(.top, 100)
                    } else if let error = viewModel.error {
                        Text(error)
                            .foregroundStyle(.red)
                            .padding()
                            .padding(.top, 60)
                    } else if viewModel.topicArticles.isEmpty {
                        Text("Geen artikelen gevonden voor dit onderwerp.")
                            .foregroundStyle(.secondary)
                            .padding(.top, 100)
                    } else {
                        ForEach(viewModel.topicArticles) { article in
                            NavigationLink(destination: ArticleDetailView(article: article)) {
                                SmallNewsCardView(article: article)
                            }
                            .buttonStyle(PlainButtonStyle())
                            .padding(.horizontal, 16)
                            .padding(.bottom, 12)
                        }
                    }
                }
                .padding(.top, 60) // Space for the fixed header
                .padding(.bottom, 16)
            }
            
            // Fixed Header
            Text(topic.name)
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
                .background(Color.brandBackground.opacity(0.95)) // Add background for readability when scrolling
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(Color.brandBackground)
        .navigationBarTitleDisplayMode(.inline) // Use inline title or hide it since we have a custom header
        .toolbarBackground(.hidden, for: .navigationBar) // Hide default nav bar background if needed
        .task {
            await viewModel.fetchArticles(forTopic: topic)
        }
    }
}
