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
    case discover = "compass.fill"
    case saved = "bookmark.fill"

    var title: String {
        switch self {
        case .home: return "Home"
        case .discover: return "Ontdek"
        case .saved: return "Opgeslagen"
        }
    }
}

// MARK: - Content View

struct ContentView: View {
    @StateObject private var viewModel = NewsViewModel()
    @State private var scrollOffset: CGFloat = 0
    @State private var selectedTab: TabSelection = .home

    private let coordinateSpaceName = "scroll"

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                // Main content
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

                            // Large title area with logo
                            VStack(alignment: .leading, spacing: 8) {
                                // Logo image (falls back to text if not found)
                                LogoView()
                                    .frame(height: 32)

                                Text("Het laatste AI nieuws")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 20)
                            .padding(.top, 60)
                            .padding(.bottom, 16)
                            .opacity(largeTitleOpacity)

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
                                LazyVStack(spacing: 12) {
                                    ForEach(viewModel.latestArticles) { article in
                                        NewsCardView(article: article)
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

                // Floating glass tab bar
                FloatingTabBar(selectedTab: $selectedTab)
                    .padding(.horizontal, 60)
                    .padding(.bottom, 28)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 16) {
                        Button(action: { }) {
                            Image(systemName: "magnifyingglass")
                                .font(.system(size: 17, weight: .medium))
                                .foregroundStyle(.primary)
                        }

                        Button(action: { }) {
                            Image(systemName: "person.circle")
                                .font(.system(size: 20, weight: .regular))
                                .foregroundStyle(.primary)
                        }
                    }
                }

                ToolbarItem(placement: .principal) {
                    LogoView()
                        .frame(height: 20)
                        .opacity(smallTitleOpacity)
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
            .navigationBarTitleDisplayMode(.inline)
        }
        .task {
            await viewModel.refresh()
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

    private var largeTitleOpacity: Double {
        let startFade: CGFloat = -20
        let endFade: CGFloat = -80

        if scrollOffset >= startFade {
            return 1
        } else if scrollOffset <= endFade {
            return 0
        } else {
            return Double((scrollOffset - endFade) / (startFade - endFade))
        }
    }

    private var smallTitleOpacity: Double {
        let startShow: CGFloat = -60
        let fullShow: CGFloat = -100

        if scrollOffset >= startShow {
            return 0
        } else if scrollOffset <= fullShow {
            return 1
        } else {
            return Double((startShow - scrollOffset) / (startShow - fullShow))
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

// MARK: - Floating Tab Bar

struct FloatingTabBar: View {
    @Binding var selectedTab: TabSelection

    var body: some View {
        HStack(spacing: 0) {
            ForEach(TabSelection.allCases, id: \.self) { tab in
                Button {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                        selectedTab = tab
                    }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: tab.rawValue)
                            .font(.system(size: 20, weight: selectedTab == tab ? .semibold : .regular))
                            .symbolRenderingMode(.hierarchical)

                        Text(tab.title)
                            .font(.system(size: 10, weight: .medium))
                    }
                    .foregroundStyle(selectedTab == tab ? .primary : .secondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                }
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background(
            Capsule()
                .fill(.ultraThinMaterial)
                .shadow(color: .black.opacity(0.15), radius: 20, x: 0, y: 10)
        )
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

struct NewsCardView: View {
    let article: Article
    @State private var isPressed = false

    var body: some View {
        Button {
            // TODO: Navigate to article detail
        } label: {
            HStack(spacing: 12) {
                // Thumbnail (left side)
                AsyncImage(url: article.imageURL) { phase in
                    switch phase {
                    case .empty:
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(.systemGray5))
                            .overlay {
                                ProgressView()
                                    .tint(.secondary)
                            }
                    case .success(let image):
                        image
                            .resizable()
                            .scaledToFill()
                    case .failure:
                        RoundedRectangle(cornerRadius: 12)
                            .fill(
                                LinearGradient(
                                    colors: [Color(.systemGray4), Color(.systemGray5)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .overlay {
                                Image(systemName: "photo")
                                    .font(.title2)
                                    .foregroundStyle(.tertiary)
                            }
                    @unknown default:
                        EmptyView()
                    }
                }
                .frame(width: 120, height: 80)
                .clipShape(RoundedRectangle(cornerRadius: 12))

                // Text content (right side)
                VStack(alignment: .leading, spacing: 6) {
                    // Meta info
                    HStack(spacing: 6) {
                        if let topicName = article.topicName {
                            Text(topicName)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundStyle(.blue)
                        }

                        if article.topicName != nil && !article.readTimeDisplay.isEmpty {
                            Circle()
                                .fill(.tertiary)
                                .frame(width: 3, height: 3)
                        }

                        if !article.readTimeDisplay.isEmpty {
                            Text(article.readTimeDisplay)
                                .font(.system(size: 11))
                                .foregroundStyle(.tertiary)
                        }
                    }

                    // Title
                    Text(article.title)
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(.primary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)

                    // Time ago
                    if !article.timeAgo.isEmpty {
                        Text(article.timeAgo)
                            .font(.system(size: 11))
                            .foregroundStyle(.tertiary)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                // Chevron
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.tertiary)
            }
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(.systemBackground))
                    .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)
            )
        }
        .buttonStyle(CardButtonStyle())
    }
}

// MARK: - Card Button Style

struct CardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .opacity(configuration.isPressed ? 0.9 : 1)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}

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
