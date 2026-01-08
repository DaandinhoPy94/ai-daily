//
//  ContentView.swift
//  AIDagelijksNative
//
//  Created by Daan van der Ster on 08/01/2026.
//

import SwiftUI

// MARK: - News Item Model

struct NewsItem: Identifiable {
    let id = UUID()
    let title: String
    let summary: String
    let source: String
    let timeAgo: String
    let imageURL: String
    let category: String
}

// MARK: - Sample Data

extension NewsItem {
    static let sampleData: [NewsItem] = [
        NewsItem(
            title: "OpenAI onthult GPT-5 met baanbrekende redeneervaardigheden",
            summary: "Het nieuwe model toont ongekende prestaties op complexe wetenschappelijke en wiskundige taken.",
            source: "TechCrunch",
            timeAgo: "2 uur geleden",
            imageURL: "photo1",
            category: "LLM"
        ),
        NewsItem(
            title: "Apple integreert AI diep in iOS 26 met 'Apple Intelligence 2.0'",
            summary: "Siri krijgt volledige contextbegrip en kan nu complexe taken uitvoeren over meerdere apps.",
            source: "The Verge",
            timeAgo: "4 uur geleden",
            imageURL: "photo2",
            category: "Apple"
        ),
        NewsItem(
            title: "EU keurt AI Act uitvoeringsregels goed voor high-risk systemen",
            summary: "Nieuwe regelgeving stelt strikte eisen aan AI in gezondheidszorg, onderwijs en justitie.",
            source: "Reuters",
            timeAgo: "5 uur geleden",
            imageURL: "photo3",
            category: "Regulering"
        ),
        NewsItem(
            title: "Google DeepMind's AlphaFold 3 voorspelt eiwit-medicijn interacties",
            summary: "Doorbraak versnelt medicijnontwikkeling met maanden tot jaren.",
            source: "Nature",
            timeAgo: "6 uur geleden",
            imageURL: "photo4",
            category: "Onderzoek"
        ),
        NewsItem(
            title: "Nederlandse startup haalt €50M op voor AI-gedreven klimaatoplossingen",
            summary: "Carbominer gebruikt machine learning om CO2-afvang te optimaliseren.",
            source: "FD",
            timeAgo: "8 uur geleden",
            imageURL: "photo5",
            category: "Startup"
        ),
        NewsItem(
            title: "Anthropic lanceert Claude 4 met verbeterde veiligheidsgaranties",
            summary: "Nieuw model combineert state-of-the-art prestaties met robuuste alignment.",
            source: "Wired",
            timeAgo: "10 uur geleden",
            imageURL: "photo6",
            category: "LLM"
        ),
        NewsItem(
            title: "Microsoft Copilot krijgt autonome agent-mogelijkheden",
            summary: "AI-assistent kan nu zelfstandig taken plannen en uitvoeren in Office 365.",
            source: "ZDNet",
            timeAgo: "12 uur geleden",
            imageURL: "photo7",
            category: "Productiviteit"
        ),
        NewsItem(
            title: "Nvidia kondigt Blackwell Ultra aan voor AI-datacenters",
            summary: "Nieuwe chip belooft 4x betere energie-efficiëntie voor grote taalmodellen.",
            source: "AnandTech",
            timeAgo: "14 uur geleden",
            imageURL: "photo8",
            category: "Hardware"
        )
    ]
}

// MARK: - Content View

struct ContentView: View {
    @State private var scrollOffset: CGFloat = 0
    @State private var searchText: String = ""

    private let coordinateSpaceName = "scroll"

    var body: some View {
        NavigationStack {
            ZStack(alignment: .top) {
                // Main scrollable content
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

                        // Large title area (scrolls with content)
                        VStack(alignment: .leading, spacing: 8) {
                            Text("AI Dagelijks")
                                .font(.system(size: 34, weight: .bold))
                                .foregroundStyle(.primary)

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
                        LazyVStack(spacing: 16) {
                            ForEach(NewsItem.sampleData) { item in
                                NewsCardView(item: item)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 100)
                    }
                }
                .coordinateSpace(name: coordinateSpaceName)
                .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
                    scrollOffset = value
                }
                .ignoresSafeArea(edges: .top)

                // Glassmorphism header overlay
                GlassHeaderView(
                    scrollOffset: scrollOffset,
                    headerOpacity: headerMaterialOpacity
                )
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
                    Text("AI Dagelijks")
                        .font(.system(size: 17, weight: .semibold))
                        .opacity(smallTitleOpacity)
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
            .navigationBarTitleDisplayMode(.inline)
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

// MARK: - News Card View

struct NewsCardView: View {
    let item: NewsItem

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Hero image placeholder
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(
                        LinearGradient(
                            colors: [
                                Color(hue: .random(in: 0...1), saturation: 0.3, brightness: 0.95),
                                Color(hue: .random(in: 0...1), saturation: 0.2, brightness: 0.98)
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(height: 200)

                // Category badge
                VStack {
                    HStack {
                        Spacer()
                        Text(item.category)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(.ultraThinMaterial, in: Capsule())
                    }
                    Spacer()
                }
                .padding(12)
            }

            // Content
            VStack(alignment: .leading, spacing: 8) {
                Text(item.title)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(.primary)
                    .lineLimit(3)

                Text(item.summary)
                    .font(.system(size: 15))
                    .foregroundStyle(.secondary)
                    .lineLimit(2)

                // Meta info
                HStack(spacing: 8) {
                    Text(item.source)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(.blue)

                    Circle()
                        .fill(.tertiary)
                        .frame(width: 3, height: 3)

                    Text(item.timeAgo)
                        .font(.system(size: 13))
                        .foregroundStyle(.tertiary)

                    Spacer()

                    Button(action: { }) {
                        Image(systemName: "bookmark")
                            .font(.system(size: 16))
                            .foregroundStyle(.secondary)
                    }

                    Button(action: { }) {
                        Image(systemName: "square.and.arrow.up")
                            .font(.system(size: 16))
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .padding(.horizontal, 4)
        }
        .padding(12)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(.background)
                .shadow(color: .black.opacity(0.06), radius: 12, x: 0, y: 4)
        )
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
