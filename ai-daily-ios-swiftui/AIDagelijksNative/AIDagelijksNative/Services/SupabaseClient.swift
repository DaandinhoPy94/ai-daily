//
//  SupabaseClient.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 08/01/2026.
//

import Foundation

// MARK: - Supabase Configuration

enum SupabaseConfig {
    // Development credentials (same as web app fallbacks)
    // nonisolated(unsafe) allows access from any isolation context (safe for immutable constants)
    nonisolated(unsafe) static let url = "https://ykfiubiogxetbgdkavep.supabase.co"
    nonisolated(unsafe) static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZml1YmlvZ3hldGJnZGthdmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTA1MzcsImV4cCI6MjA3MjEyNjUzN30.MuTGy7n4nCZcsE7qdAmu51CJSyIuU2ePeKHTbBlReNg"

    // Storage bucket URL for images
    nonisolated(unsafe) static let storageURL = "\(url)/storage/v1/object/public"
}

// MARK: - Supabase Client

actor SupabaseClient {
    static let shared = SupabaseClient()

    private let session: URLSession
    private let baseURL: URL
    private let headers: [String: String]

    private init() {
        self.baseURL = URL(string: "\(SupabaseConfig.url)/rest/v1")!
        self.headers = [
            "apikey": SupabaseConfig.anonKey,
            "Authorization": "Bearer \(SupabaseConfig.anonKey)",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        ]

        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        self.session = URLSession(configuration: config)
    }

    // MARK: - Generic Fetch

    func fetch<T: Decodable>(
        from table: String,
        select: String = "*",
        filters: [String: String] = [:],
        order: String? = nil,
        limit: Int? = nil
    ) async throws -> [T] {
        guard var components = URLComponents(url: baseURL.appendingPathComponent(table), resolvingAgainstBaseURL: false) else {
            throw SupabaseError.invalidURL
        }

        var queryItems = [URLQueryItem(name: "select", value: select)]

        for (key, value) in filters {
            queryItems.append(URLQueryItem(name: key, value: value))
        }

        if let order = order {
            queryItems.append(URLQueryItem(name: "order", value: order))
        }

        if let limit = limit {
            queryItems.append(URLQueryItem(name: "limit", value: String(limit)))
        }

        components.queryItems = queryItems

        guard let url = components.url else {
            throw SupabaseError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        headers.forEach { request.setValue($0.value, forHTTPHeaderField: $0.key) }

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw SupabaseError.requestFailed
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        return try decoder.decode([T].self, from: data)
    }
}

// MARK: - Errors

enum SupabaseError: Error, LocalizedError {
    case requestFailed
    case decodingFailed
    case invalidURL

    var errorDescription: String? {
        switch self {
        case .requestFailed: return "Network request failed"
        case .decodingFailed: return "Failed to decode response"
        case .invalidURL: return "Invalid URL"
        }
    }
}
