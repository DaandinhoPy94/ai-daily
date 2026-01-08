//
//  NewsViewModel.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 08/01/2026.
//

import Foundation
import SwiftUI
import Combine

// MARK: - Article Model (matches Supabase schema)

struct Article: Identifiable, Codable, Hashable {
    let id: String
    let slug: String
    let title: String
    let summary: String?
    let body: String?
    let publishedAt: Date?
    let readTimeMinutes: Int?
    let imagePath: String?
    let imageAlt: String?
    let topicName: String?
    let topicSlug: String?
    let author: Author?
    let topics: [Topic]?

    // Computed properties for different image types
    var heroImageURL: URL? {
        return constructImageURL(type: "hero", width: 1200)
    }

    var listThumbURL: URL? {
        return constructImageURL(type: "list", width: 480)
    }

    var standardImageURL: URL? {
        return constructImageURL(type: "standard", width: 400)
    }

    private func constructImageURL(type: String, width: Int) -> URL? {
        // Use the article ID to construct the path as per imagesBase.ts
        // Path: {storageURL}/media/articles/{id}/{type}_{width}.webp
        let urlString = "\(SupabaseConfig.storageURL)/media/articles/\(id)/\(type)_\(width).webp"
        return URL(string: urlString)
    }

    // Formatted time ago
    var timeAgo: String {
        guard let date = publishedAt else { return "" }
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "nl_NL")
        formatter.unitsStyle = .full
        return formatter.localizedString(for: date, relativeTo: Date())
    }

    // Reading time display
    var readTimeDisplay: String {
        guard let minutes = readTimeMinutes else { return "" }
        return "\(minutes) min"
    }
}

struct Author: Codable, Hashable {
    let name: String
    let avatarURL: String?
}

struct Topic: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let slug: String
}

struct Comment: Identifiable, Codable, Hashable {
    let id: String
    let content: String
    let createdAt: Date
    let userName: String
    let userAvatarURL: String?
    
    var timeAgo: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = Locale(identifier: "nl_NL")
        formatter.unitsStyle = .short
        return formatter.localizedString(for: createdAt, relativeTo: Date())
    }
}

// MARK: - Supabase View Response (v_latest_published)

struct LatestArticleResponse: Codable {
    let id: String
    let slug: String
    let title: String
    let summary: String?
    let publishedAt: Date?
    let readTimeMinutes: Int?
    let imagePath: String?
    let imageAlt: String?
    let topicName: String?
    let topicSlug: String?
}

// MARK: - News ViewModel

@MainActor
class NewsViewModel: ObservableObject {
    @Published var latestArticles: [Article] = []
    @Published var mostReadArticles: [Article] = []
    @Published var currentArticle: Article?
    @Published var relatedArticles: [Article] = []
    @Published var comments: [Comment] = []
    @Published var isLoading = false
    @Published var error: String?

    private let client = SupabaseClient.shared

    // MARK: - Fetch Latest Articles

    func fetchLatestArticles(limit: Int = 20) async {
        isLoading = true
        error = nil

        do {
            let articles: [LatestArticleResponse] = try await client.fetch(
                from: "v_latest_published",
                select: "*",
                limit: limit
            )

            self.latestArticles = articles.map { response in
                Article(
                    id: response.id,
                    slug: response.slug,
                    title: response.title,
                    summary: response.summary,
                    body: nil,
                    publishedAt: response.publishedAt,
                    readTimeMinutes: response.readTimeMinutes,
                    imagePath: response.imagePath,
                    imageAlt: response.imageAlt,
                    topicName: response.topicName,
                    topicSlug: response.topicSlug,
                    author: nil,
                    topics: nil
                )
            }
        } catch {
            self.error = error.localizedDescription
            print("[NewsViewModel] Error fetching latest: \(error)")
        }

        isLoading = false
    }

    // MARK: - Fetch Most Read (24h)

    func fetchMostRead(limit: Int = 10) async {
        do {
            let articles: [LatestArticleResponse] = try await client.fetch(
                from: "v_most_read_24h",
                select: "*",
                limit: limit
            )

            self.mostReadArticles = articles.map { response in
                Article(
                    id: response.id,
                    slug: response.slug,
                    title: response.title,
                    summary: response.summary,
                    body: nil,
                    publishedAt: response.publishedAt,
                    readTimeMinutes: response.readTimeMinutes,
                    imagePath: response.imagePath,
                    imageAlt: response.imageAlt,
                    topicName: response.topicName,
                    topicSlug: response.topicSlug,
                    author: nil,
                    topics: nil
                )
            }
        } catch {
            print("[NewsViewModel] Error fetching most read: \(error)")
        }
    }
    
    // MARK: - Fetch Article Detail
    
    func fetchArticleDetail(id: String) async {
        isLoading = true
        error = nil
        
        do {
            // 1. Fetch main article data with author
            struct ArticleDetailResponse: Decodable {
                let id: String
                let slug: String
                let title: String
                let summary: String?
                let body: String?
                let published_at: String?
                let read_time_minutes: Int?
                let hero_image_id: String?
                let author: AuthorResponse?
                
                enum CodingKeys: String, CodingKey {
                    case id, slug, title, summary, body, published_at, read_time_minutes, hero_image_id, author
                }
            }
            
            struct AuthorResponse: Decodable {
                let name: String
                let avatar_url: String?
            }
            
            let articleDataList: [ArticleDetailResponse] = try await client.fetch(
                from: "articles",
                select: "id, slug, title, summary, body, published_at, read_time_minutes, hero_image_id, author:authors(name, avatar_url)",
                filters: ["id": "eq.\(id)"],
                limit: 1
            )
            
            guard let articleData = articleDataList.first else {
                self.error = "Artikel niet gevonden"
                isLoading = false
                return
            }
            
            // 2. Fetch image path if needed
            var imagePath: String?
            var imageAlt: String?
            
            if let heroId = articleData.hero_image_id {
                struct MediaResponse: Decodable {
                    let path: String
                    let alt: String?
                }
                
                let mediaList: [MediaResponse] = try await client.fetch(
                    from: "media_assets",
                    select: "path, alt",
                    filters: ["id": "eq.\(heroId)"],
                    limit: 1
                )
                if let media = mediaList.first {
                    imagePath = media.path
                    imageAlt = media.alt
                }
            }
            
            // 3. Fetch topics
            struct ArticleTopicResponse: Decodable {
                let topics: TopicResponse
            }
            struct TopicResponse: Decodable {
                let id: String
                let name: String
                let slug: String
            }
            
            let topicData: [ArticleTopicResponse] = try await client.fetch(
                from: "article_topics",
                select: "topics(id, name, slug)",
                filters: ["article_id": "eq.\(id)"]
            )
            
            let topics = topicData.map { Topic(id: $0.topics.id, name: $0.topics.name, slug: $0.topics.slug) }
            let primaryTopic = topics.first
            
            // Construct Article
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            let publishedDate = articleData.published_at.flatMap { formatter.date(from: $0) }
            
            let author = articleData.author.map { Author(name: $0.name, avatarURL: $0.avatar_url) }
            
            self.currentArticle = Article(
                id: articleData.id,
                slug: articleData.slug,
                title: articleData.title,
                summary: articleData.summary,
                body: articleData.body,
                publishedAt: publishedDate,
                readTimeMinutes: articleData.read_time_minutes,
                imagePath: imagePath,
                imageAlt: imageAlt,
                topicName: primaryTopic?.name,
                topicSlug: primaryTopic?.slug,
                author: author,
                topics: topics
            )
            
            // 4. Fetch related data
            if let article = self.currentArticle {
                await fetchRelatedArticles(for: article)
            }
            await fetchComments(for: id)
            
        } catch {
            self.error = "Kon artikel niet laden: \(error.localizedDescription)"
            print("[NewsViewModel] Error fetching detail: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - Fetch Related Articles
    
    func fetchRelatedArticles(for article: Article) async {
        guard let topicSlug = article.topicSlug else { return }
        
        do {
            // Fetch articles with the same topic, excluding current
            let related: [LatestArticleResponse] = try await client.fetch(
                from: "v_latest_published",
                select: "*",
                filters: ["topic_slug": "eq.\(topicSlug)"],
                limit: 4 // Fetch 4, drop current if found
            )
            
            self.relatedArticles = related
                .filter { $0.id != article.id }
                .prefix(3)
                .map { response in
                    Article(
                        id: response.id,
                        slug: response.slug,
                        title: response.title,
                        summary: response.summary,
                        body: nil,
                        publishedAt: response.publishedAt,
                        readTimeMinutes: response.readTimeMinutes,
                        imagePath: response.imagePath,
                        imageAlt: response.imageAlt,
                        topicName: response.topicName,
                        topicSlug: response.topicSlug,
                        author: nil,
                        topics: nil
                    )
                }
            
        } catch {
            print("[NewsViewModel] Error fetching related: \(error)")
        }
    }
    
    // MARK: - Fetch Comments
    
    func fetchComments(for articleId: String) async {
        do {
            struct CommentResponse: Decodable {
                let id: String
                let content: String
                let created_at: String
                let user_id: String
                let profiles: ProfileResponse?
            }
            
            struct ProfileResponse: Decodable {
                let full_name: String?
                let avatar_url: String?
            }
            
            let commentsData: [CommentResponse] = try await client.fetch(
                from: "article_comments",
                select: "id, content, created_at, user_id, profiles(full_name, avatar_url)",
                filters: ["article_id": "eq.\(articleId)"],
                order: "created_at.desc"
            )
            
            let formatter = ISO8601DateFormatter()
            formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            
            self.comments = commentsData.map { c in
                Comment(
                    id: c.id,
                    content: c.content,
                    createdAt: formatter.date(from: c.created_at) ?? Date(),
                    userName: c.profiles?.full_name ?? "Anoniem",
                    userAvatarURL: c.profiles?.avatar_url
                )
            }
            
        } catch {
            print("[NewsViewModel] Error fetching comments: \(error)")
        }
    }

    // MARK: - Refresh All

    func refresh() async {
        await withTaskGroup(of: Void.self) { group in
            group.addTask { await self.fetchLatestArticles() }
            group.addTask { await self.fetchMostRead() }
        }
    }
}
