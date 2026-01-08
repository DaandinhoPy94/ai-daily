//
//  ContentView.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 08/01/2026.
//

import SwiftUI

// MARK: - Tab Selection

enum TabSelection: String, CaseIterable {
    case home = "house.fill"
    case netBinnen = "clock.fill"
    case myNews = "heart.fill"
    case more = "ellipsis.circle.fill"

    var title: String {
        switch self {
        case .home: return "AI Dagelijks"
        case .netBinnen: return "Net Binnen"
        case .myNews: return "Mijn Nieuws"
        case .more: return "Meer"
        }
    }
}

// MARK: - Content View

struct ContentView: View {
    @StateObject private var viewModel = NewsViewModel()
    @State private var scrollOffset: CGFloat = 0
    @State private var selectedTab: TabSelection = .home
    @State private var showSearch = false
    @State private var showProfile = false

    private let coordinateSpaceName = "scroll"

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                // Background
                Color.brandBackground.ignoresSafeArea()
                
                // Main Content
                Group {
                    switch selectedTab {
                    case .home:
                        homeView
                    case .netBinnen:
                        NetBinnenView(viewModel: viewModel)
                    case .myNews:
                        ContentUnavailableView("Mijn Nieuws", systemImage: "heart", description: Text("Binnenkort beschikbaar"))
                    case .more:
                        MoreView()
                    }
                }
                
                // Floating glass tab bar removed
                
                // Search Overlay
                if showSearch {
                    SearchView(isPresented: $showSearch)
                        .zIndex(2)
                }
            }
            .navigationDestination(for: Article.self) { article in
                ArticleDetailView(article: article)
            }
            .sheet(isPresented: $showProfile) {
                ProfileView()
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 16) {
                        Button(action: { 
                            withAnimation {
                                showSearch = true 
                            }
                        }) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 17, weight: .medium))
                                .foregroundStyle(.primary)
                        }

                        Button(action: { showProfile = true }) {
                            Image(systemName: "person.circle")
                                .font(.system(size: 20, weight: .regular))
                                .foregroundStyle(.primary)
                        }
                    }
                }

                if selectedTab != .netBinnen {
                    ToolbarItem(placement: .principal) {
                        LogoView()
                            .frame(height: 20)
                    }
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
            .navigationBarTitleDisplayMode(.inline)
        }
        .task {
            await viewModel.refresh()
        }
    }

    // MARK: - Home View
    
    private var homeView: some View {
        ZStack(alignment: .top) {
            // Scrollable content
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 0) {
                    // Offset reader
                    GeometryReader { geometry in
                        Color.clear.preference(
                            key: ScrollOffsetPreferenceKey.self,
                            value: geometry.frame(in: .named(coordinateSpaceName)).minY
                        )
                    }
                    .frame(height: 0)

                    Spacer()
                        .frame(height: 80) // Reduced padding since subtitle is gone

                    // News feed
                    if viewModel.isLoading && viewModel.latestArticles.isEmpty {
                        LoadingView()
                            .padding(.top, 100)
                    } else if let error = viewModel.error, viewModel.latestArticles.isEmpty {
                        ErrorView(message: error) {
                            Task { await viewModel.refresh() }
                        }
                        .padding(.top, 100)
                    } else {
                        LazyVStack(spacing: 16) {
                            // First 2 Large Cards
                            ForEach(viewModel.latestArticles.prefix(2)) { article in
                                NavigationLink(value: article) {
                                    LargeNewsCardView(article: article)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                            
                            // Rest Small Cards
                            ForEach(viewModel.latestArticles.dropFirst(2)) { article in
                                NavigationLink(value: article) {
                                    SmallNewsCardView(article: article)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 120) // Space for tab bar
                    }
                }
            }
            .coordinateSpace(name: coordinateSpaceName)
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                scrollOffset = value
            }
            .ignoresSafeArea(edges: .top)
            .refreshable {
                await viewModel.refresh()
            }

            // Glassmorphism header overlay
            GlassHeaderView(
                scrollOffset: scrollOffset,
                headerOpacity: headerMaterialOpacity
            )
        }
    }

    // MARK: - Computed Properties

    private var headerMaterialOpacity: Double {
        let threshold: CGFloat = -30
        let fullOpacityAt: CGFloat = -100

        if scrollOffset >= threshold {
            return 0
        } else if scrollOffset <= fullOpacityAt {
            return 1
        } else {
            return Double((threshold - scrollOffset) / (threshold - fullOpacityAt))
        }
    }


}

// MARK: - Logo View

struct LogoView: View {
    var body: some View {
        // Try to load logo from assets, fallback to styled text
        if let _ = UIImage(named: "ai-logo") {
            Image("ai-logo")
                .resizable()
                .scaledToFit()
        } else {
            // Styled text fallback matching brand
            Text("AI Dagelijks")
                .font(.system(size: 24, weight: .bold, design: .default))
                .foregroundStyle(
                    LinearGradient(
                        colors: [.primary, .primary.opacity(0.8)],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
        }
    }
}



// MARK: - Glass Header View

struct GlassHeaderView: View {
    let scrollOffset: CGFloat
    let headerOpacity: Double

    var body: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(.ultraThinMaterial)
                .opacity(headerOpacity)
                .frame(height: 100)
                .overlay(alignment: .bottom) {
                    Divider()
                        .opacity(headerOpacity)
                }

            Spacer()
        }
        .ignoresSafeArea(edges: .top)
        .allowsHitTesting(false)
    }
}

// MARK: - News Card View (Horizontal Layout)



// MARK: - Loading View

struct LoadingView: View {
    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.2)
            Text("Laden...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}

// MARK: - Error View

struct ErrorView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "wifi.exclamationmark")
                .font(.system(size: 40))
                .foregroundStyle(.secondary)

            Text("Kon nieuws niet laden")
                .font(.headline)

            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            Button("Opnieuw proberen") {
                retry()
            }
            .buttonStyle(.bordered)
        }
        .padding()
    }
}

// MARK: - Scroll Offset Preference Key

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// MARK: - Preview

#Preview {
    ContentView()
}
