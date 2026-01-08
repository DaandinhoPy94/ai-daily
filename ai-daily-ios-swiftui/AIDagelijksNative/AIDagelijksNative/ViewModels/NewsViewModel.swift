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
    let publishedAt: Date?
    let readTimeMinutes: Int?
    let imagePath: String?
    let imageAlt: String?
    let topicName: String?
    let topicSlug: String?

    // Computed property for image URL
    var imageURL: URL? {
        guard let path = imagePath else { return nil }
        // Handle both full URLs and storage paths
        if path.hasPrefix("http") {
            return URL(string: path)
        }
        return URL(string: "\(SupabaseConfig.storageURL)/\(path)")
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
                    publishedAt: response.publishedAt,
                    readTimeMinutes: response.readTimeMinutes,
                    imagePath: response.imagePath,
                    imageAlt: response.imageAlt,
                    topicName: response.topicName,
                    topicSlug: response.topicSlug
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
                    publishedAt: response.publishedAt,
                    readTimeMinutes: response.readTimeMinutes,
                    imagePath: response.imagePath,
                    imageAlt: response.imageAlt,
                    topicName: response.topicName,
                    topicSlug: response.topicSlug
                )
            }
        } catch {
            print("[NewsViewModel] Error fetching most read: \(error)")
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
