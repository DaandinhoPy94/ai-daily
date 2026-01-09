import SwiftUI

struct MoreView: View {
    @EnvironmentObject var viewModel: NewsViewModel
    
    var body: some View {
        NavigationStack {
            List {
                // Topics Section
                Section {
                    if viewModel.topics.isEmpty {
                        ProgressView()
                            .frame(maxWidth: .infinity, alignment: .center)
                            .listRowBackground(Color.clear)
                    } else {
                        ForEach(viewModel.topics) { topic in
                            NavigationLink(destination: TopicDetailView(topic: topic)) {
                                Text(topic.name)
                            }
                        }
                    }
                }
                
                // Other Links Section
                Section {
                    NavigationLink {
                        Text("Voorkeuren")
                    } label: {
                        Label("Voorkeuren", systemImage: "gearshape")
                    }
                    
                    Link(destination: URL(string: "https://aidagelijks.nl/over-ons")!) {
                        Label("Over ons", systemImage: "info.circle")
                    }
                    
                    Link(destination: URL(string: "https://aidagelijks.nl/privacy")!) {
                        Label("Privacybeleid", systemImage: "hand.raised")
                    }
                }
                
                Section {
                    Text("Versie 1.0.0 (Build 1)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Meer")
            .background(Color.brandBackground)
            .scrollContentBackground(.hidden)
            .task {
                if viewModel.topics.isEmpty {
                    await viewModel.fetchTopics()
                }
            }
        }
    }
}
