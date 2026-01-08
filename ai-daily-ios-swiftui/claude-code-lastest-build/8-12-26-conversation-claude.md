       56 +                                    .frame(height: 32)                                                                                                                                                                                          
       57  
      122 -                            Text("Het laatste AI nieuws")                                                                                                                                                                                       
      123 -                                .font(.subheadline)                                                                                                                                                                                             
      124 -                                .foregroundStyle(.secondary)                                                                                                                                                                                    
      125 -                        }                                                                                                                                                                                                                       
      126 -                        .frame(maxWidth: .infinity, alignment: .leading)                                                                                                                                                                        
      127 -                        .padding(.horizontal, 20)                                                                                                                                                                                               
      128 -                        .padding(.top, 60)                                                                                                                                                                                                      
      129 -                        .padding(.bottom, 16)                                                                                                                                                                                                   
      130 -                        .opacity(largeTitleOpacity)                                                                                                                                                                                             
       58 +                                Text("Het laatste AI nieuws")                                                                                                                                                                                   
       59 +                                    .font(.subheadline)                                                                                                                                                                                         
       60 +                                    .foregroundStyle(.secondary)                                                                                                                                                                                
       61 +                            }                                                                                                                                                                                                                   
       62 +                            .frame(maxWidth: .infinity, alignment: .leading)                                                                                                                                                                    
       63 +                            .padding(.horizontal, 20)                                                                                                                                                                                           
       64 +                            .padding(.top, 60)                                                                                                                                                                                                  
       65 +                            .padding(.bottom, 16)                                                                                                                                                                                               
       66 +                            .opacity(largeTitleOpacity)                                                                                                                                                                                         
       67  
      132 -                        // News feed                                                                                                                                                                                                            
      133 -                        LazyVStack(spacing: 16) {                                                                                                                                                                                               
      134 -                            ForEach(NewsItem.sampleData) { item in                                                                                                                                                                              
      135 -                                NewsCardView(item: item)                                                                                                                                                                                        
       68 +                            // News feed                                                                                                                                                                                                        
       69 +                            if viewModel.isLoading && viewModel.latestArticles.isEmpty {                                                                                                                                                        
       70 +                                LoadingView()                                                                                                                                                                                                   
       71 +                                    .padding(.top, 100)                                                                                                                                                                                         
       72 +                            } else if let error = viewModel.error, viewModel.latestArticles.isEmpty {                                                                                                                                           
       73 +                                ErrorView(message: error) {                                                                                                                                                                                     
       74 +                                    Task { await viewModel.refresh() }                                                                                                                                                                          
       75 +                                }                                                                                                                                                                                                               
       76 +                                .padding(.top, 100)                                                                                                                                                                                             
       77 +                            } else {                                                                                                                                                                                                            
       78 +                                LazyVStack(spacing: 12) {                                                                                                                                                                                       
       79 +                                    ForEach(viewModel.latestArticles) { article in                                                                                                                                                              
       80 +                                        NewsCardView(article: article)                                                                                                                                                                          
       81 +                                    }                                                                                                                                                                                                           
       82 +                                }                                                                                                                                                                                                               
       83 +                                .padding(.horizontal, 16)                                                                                                                                                                                       
       84 +                                .padding(.bottom, 120) // Space for tab bar                                                                                                                                                                     
       85                              }
       86                          }
      138 -                        .padding(.horizontal, 16)                                                                                                                                                                                               
      139 -                        .padding(.bottom, 100)                                                                                                                                                                                                  
       87                      }
       88 +                    .coordinateSpace(name: coordinateSpaceName)                                                                                                                                                                                 
       89 +                    .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in                                                                                                                                                              
       90 +                        scrollOffset = value                                                                                                                                                                                                    
       91 +                    }                                                                                                                                                                                                                           
       92 +                    .ignoresSafeArea(edges: .top)                                                                                                                                                                                               
       93 +                    .refreshable {                                                                                                                                                                                                              
       94 +                        await viewModel.refresh()                                                                                                                                                                                               
       95 +                    }                                                                                                                                                                                                                           
       96 +                                                                                                                                                                                                                                                
       97 +                    // Glassmorphism header overlay                                                                                                                                                                                             
       98 +                    GlassHeaderView(                                                                                                                                                                                                            
       99 +                        scrollOffset: scrollOffset,                                                                                                                                                                                             
      100 +                        headerOpacity: headerMaterialOpacity                                                                                                                                                                                    
      101 +                    )                                                                                                                                                                                                                           
      102                  }
      142 -                .coordinateSpace(name: coordinateSpaceName)                                                                                                                                                                                     
      143 -                .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in                                                                                                                                                                  
      144 -                    scrollOffset = value                                                                                                                                                                                                        
      145 -                }                                                                                                                                                                                                                               
      146 -                .ignoresSafeArea(edges: .top)                                                                                                                                                                                                   
      103  
      148 -                // Glassmorphism header overlay                                                                                                                                                                                                 
      149 -                GlassHeaderView(                                                                                                                                                                                                                
      150 -                    scrollOffset: scrollOffset,                                                                                                                                                                                                 
      151 -                    headerOpacity: headerMaterialOpacity                                                                                                                                                                                        
      152 -                )                                                                                                                                                                                                                               
      104 +                // Floating glass tab bar                                                                                                                                                                                                       
      105 +                FloatingTabBar(selectedTab: $selectedTab)                                                                                                                                                                                       
      106 +                    .padding(.horizontal, 60)                                                                                                                                                                                                   
      107 +                    .padding(.bottom, 28)                                                                                                                                                                                                       
      108              }
      109              .toolbar {
      110                  ToolbarItem(placement: .topBarTrailing) {
     ...
      124                  }
      125  
      126                  ToolbarItem(placement: .principal) {
      172 -                    Text("AI Dagelijks")                                                                                                                                                                                                        
      173 -                        .font(.system(size: 17, weight: .semibold))                                                                                                                                                                             
      127 +                    LogoView()                                                                                                                                                                                                                  
      128 +                        .frame(height: 20)                                                                                                                                                                                                      
      129                          .opacity(smallTitleOpacity)
      130                  }
      131              }
      132              .toolbarBackground(.hidden, for: .navigationBar)
      133              .navigationBarTitleDisplayMode(.inline)
      134          }
      135 +        .task {                                                                                                                                                                                                                                 
      136 +            await viewModel.refresh()                                                                                                                                                                                                           
      137 +        }                                                                                                                                                                                                                                       
      138      }
      139  
      140      // MARK: - Computed Properties
     ...
      179      }
      180  }
      181  
      182 +// MARK: - Logo View                                                                                                                                                                                                                            
      183 +                                                                                                                                                                                                                                                
      184 +struct LogoView: View {                                                                                                                                                                                                                         
      185 +    var body: some View {                                                                                                                                                                                                                       
      186 +        // Try to load logo from assets, fallback to styled text                                                                                                                                                                                
      187 +        if let _ = UIImage(named: "ai-logo") {                                                                                                                                                                                                  
      188 +            Image("ai-logo")                                                                                                                                                                                                                    
      189 +                .resizable()                                                                                                                                                                                                                    
      190 +                .scaledToFit()                                                                                                                                                                                                                  
      191 +        } else {                                                                                                                                                                                                                                
      192 +            // Styled text fallback matching brand                                                                                                                                                                                              
      193 +            Text("AI Dagelijks")                                                                                                                                                                                                                
      194 +                .font(.system(size: 24, weight: .bold, design: .default))                                                                                                                                                                       
      195 +                .foregroundStyle(                                                                                                                                                                                                               
      196 +                    LinearGradient(                                                                                                                                                                                                             
      197 +                        colors: [.primary, .primary.opacity(0.8)],                                                                                                                                                                              
      198 +                        startPoint: .leading,                                                                                                                                                                                                   
      199 +                        endPoint: .trailing                                                                                                                                                                                                     
      200 +                    )                                                                                                                                                                                                                           
      201 +                )                                                                                                                                                                                                                               
      202 +        }                                                                                                                                                                                                                                       
      203 +    }                                                                                                                                                                                                                                           
      204 +}                                                                                                                                                                                                                                               
      205 +                                                                                                                                                                                                                                                
      206 +// MARK: - Floating Tab Bar                                                                                                                                                                                                                     
      207 +                                                                                                                                                                                                                                                
      208 +struct FloatingTabBar: View {                                                                                                                                                                                                                   
      209 +    @Binding var selectedTab: TabSelection                                                                                                                                                                                                      
      210 +                                                                                                                                                                                                                                                
      211 +    var body: some View {                                                                                                                                                                                                                       
      212 +        HStack(spacing: 0) {                                                                                                                                                                                                                    
      213 +            ForEach(TabSelection.allCases, id: \.self) { tab in                                                                                                                                                                                 
      214 +                Button {                                                                                                                                                                                                                        
      215 +                    withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {                                                                                                                                                               
      216 +                        selectedTab = tab                                                                                                                                                                                                       
      217 +                    }                                                                                                                                                                                                                           
      218 +                } label: {                                                                                                                                                                                                                      
      219 +                    VStack(spacing: 4) {                                                                                                                                                                                                        
      220 +                        Image(systemName: tab.rawValue)                                                                                                                                                                                         
      221 +                            .font(.system(size: 20, weight: selectedTab == tab ? .semibold : .regular))                                                                                                                                         
      222 +                            .symbolRenderingMode(.hierarchical)                                                                                                                                                                                 
      223 +                                                                                                                                                                                                                                                
      224 +                        Text(tab.title)                                                                                                                                                                                                         
      225 +                            .font(.system(size: 10, weight: .medium))                                                                                                                                                                           
      226 +                    }                                                                                                                                                                                                                           
      227 +                    .foregroundStyle(selectedTab == tab ? .primary : .secondary)                                                                                                                                                                
      228 +                    .frame(maxWidth: .infinity)                                                                                                                                                                                                 
      229 +                    .padding(.vertical, 10)                                                                                                                                                                                                     
      230 +                }                                                                                                                                                                                                                               
      231 +            }                                                                                                                                                                                                                                   
      232 +        }                                                                                                                                                                                                                                       
      233 +        .padding(.horizontal, 8)                                                                                                                                                                                                                
      234 +        .padding(.vertical, 6)                                                                                                                                                                                                                  
      235 +        .background(                                                                                                                                                                                                                            
      236 +            Capsule()                                                                                                                                                                                                                           
      237 +                .fill(.ultraThinMaterial)                                                                                                                                                                                                       
      238 +                .shadow(color: .black.opacity(0.15), radius: 20, x: 0, y: 10)                                                                                                                                                                   
      239 +        )                                                                                                                                                                                                                                       
      240 +    }                                                                                                                                                                                                                                           
      241 +}                                                                                                                                                                                                                                               
      242 +                                                                                                                                                                                                                                                
      243  // MARK: - Glass Header View
      244  
      245  struct GlassHeaderView: View {
     ...
      264      }
      265  }
      266  
      248 -// MARK: - News Card View                                                                                                                                                                                                                       
      267 +// MARK: - News Card View (Horizontal Layout)                                                                                                                                                                                                   
      268  
      269  struct NewsCardView: View {
      251 -    let item: NewsItem                                                                                                                                                                                                                          
      270 +    let article: Article                                                                                                                                                                                                                        
      271 +    @State private var isPressed = false                                                                                                                                                                                                        
      272  
      273      var body: some View {
      254 -        VStack(alignment: .leading, spacing: 12) {                                                                                                                                                                                              
      255 -            // Hero image placeholder                                                                                                                                                                                                           
      256 -            ZStack {                                                                                                                                                                                                                            
      257 -                RoundedRectangle(cornerRadius: 16)                                                                                                                                                                                              
      258 -                    .fill(                                                                                                                                                                                                                      
      259 -                        LinearGradient(                                                                                                                                                                                                         
      260 -                            colors: [                                                                                                                                                                                                           
      261 -                                Color(hue: .random(in: 0...1), saturation: 0.3, brightness: 0.95),                                                                                                                                              
      262 -                                Color(hue: .random(in: 0...1), saturation: 0.2, brightness: 0.98)                                                                                                                                               
      263 -                            ],                                                                                                                                                                                                                  
      264 -                            startPoint: .topLeading,                                                                                                                                                                                            
      265 -                            endPoint: .bottomTrailing                                                                                                                                                                                           
      266 -                        )                                                                                                                                                                                                                       
      267 -                    )                                                                                                                                                                                                                           
      268 -                    .frame(height: 200)                                                                                                                                                                                                         
      274 +        Button {                                                                                                                                                                                                                                
      275 +            // TODO: Navigate to article detail                                                                                                                                                                                                 
      276 +        } label: {                                                                                                                                                                                                                              
      277 +            HStack(spacing: 12) {                                                                                                                                                                                                               
      278 +                // Thumbnail (left side)                                                                                                                                                                                                        
      279 +                AsyncImage(url: article.imageURL) { phase in                                                                                                                                                                                    
      280 +                    switch phase {                                                                                                                                                                                                              
      281 +                    case .empty:                                                                                                                                                                                                                
      282 +                        RoundedRectangle(cornerRadius: 12)                                                                                                                                                                                      
      283 +                            .fill(Color(.systemGray5))                                                                                                                                                                                          
      284 +                            .overlay {                                                                                                                                                                                                          
      285 +                                ProgressView()                                                                                                                                                                                                  
      286 +                                    .tint(.secondary)                                                                                                                                                                                           
      287 +                            }                                                                                                                                                                                                                   
      288 +                    case .success(let image):                                                                                                                                                                                                   
      289 +                        image                                                                                                                                                                                                                   
      290 +                            .resizable()                                                                                                                                                                                                        
      291 +                            .scaledToFill()                                                                                                                                                                                                     
      292 +                    case .failure:                                                                                                                                                                                                              
      293 +                        RoundedRectangle(cornerRadius: 12)                                                                                                                                                                                      
      294 +                            .fill(                                                                                                                                                                                                              
      295 +                                LinearGradient(                                                                                                                                                                                                 
      296 +                                    colors: [Color(.systemGray4), Color(.systemGray5)],                                                                                                                                                         
      297 +                                    startPoint: .topLeading,                                                                                                                                                                                    
      298 +                                    endPoint: .bottomTrailing                                                                                                                                                                                   
      299 +                                )                                                                                                                                                                                                               
      300 +                            )                                                                                                                                                                                                                   
      301 +                            .overlay {                                                                                                                                                                                                          
      302 +                                Image(systemName: "photo")                                                                                                                                                                                      
      303 +                                    .font(.title2)                                                                                                                                                                                              
      304 +                                    .foregroundStyle(.tertiary)                                                                                                                                                                                 
      305 +                            }                                                                                                                                                                                                                   
      306 +                    @unknown default:                                                                                                                                                                                                           
      307 +                        EmptyView()                                                                                                                                                                                                             
      308 +                    }                                                                                                                                                                                                                           
      309 +                }                                                                                                                                                                                                                               
      310 +                .frame(width: 120, height: 80)                                                                                                                                                                                                  
      311 +                .clipShape(RoundedRectangle(cornerRadius: 12))                                                                                                                                                                                  
      312  
      270 -                // Category badge                                                                                                                                                                                                               
      271 -                VStack {                                                                                                                                                                                                                        
      272 -                    HStack {                                                                                                                                                                                                                    
      273 -                        Spacer()                                                                                                                                                                                                                
      274 -                        Text(item.category)                                                                                                                                                                                                     
      275 -                            .font(.system(size: 12, weight: .semibold))                                                                                                                                                                         
      276 -                            .foregroundStyle(.white)                                                                                                                                                                                            
      277 -                            .padding(.horizontal, 10)                                                                                                                                                                                           
      278 -                            .padding(.vertical, 5)                                                                                                                                                                                              
      279 -                            .background(.ultraThinMaterial, in: Capsule())                                                                                                                                                                      
      313 +                // Text content (right side)                                                                                                                                                                                                    
      314 +                VStack(alignment: .leading, spacing: 6) {                                                                                                                                                                                       
      315 +                    // Meta info                                                                                                                                                                                                                
      316 +                    HStack(spacing: 6) {                                                                                                                                                                                                        
      317 +                        if let topicName = article.topicName {                                                                                                                                                                                  
      318 +                            Text(topicName)                                                                                                                                                                                                     
      319 +                                .font(.system(size: 11, weight: .semibold))                                                                                                                                                                     
      320 +                                .foregroundStyle(.blue)                                                                                                                                                                                         
      321 +                        }                                                                                                                                                                                                                       
      322 +                                                                                                                                                                                                                                                
      323 +                        if article.topicName != nil && !article.readTimeDisplay.isEmpty {                                                                                                                                                       
      324 +                            Circle()                                                                                                                                                                                                            
      325 +                                .fill(.tertiary)                                                                                                                                                                                                
      326 +                                .frame(width: 3, height: 3)                                                                                                                                                                                     
      327 +                        }                                                                                                                                                                                                                       
      328 +                                                                                                                                                                                                                                                
      329 +                        if !article.readTimeDisplay.isEmpty {                                                                                                                                                                                   
      330 +                            Text(article.readTimeDisplay)                                                                                                                                                                                       
      331 +                                .font(.system(size: 11))                                                                                                                                                                                        
      332 +                                .foregroundStyle(.tertiary)                                                                                                                                                                                     
      333 +                        }                                                                                                                                                                                                                       
      334                      }
      281 -                    Spacer()                                                                                                                                                                                                                    
      335 +                                                                                                                                                                                                                                                
      336 +                    // Title                                                                                                                                                                                                                    
      337 +                    Text(article.title)                                                                                                                                                                                                         
      338 +                        .font(.system(size: 15, weight: .semibold))                                                                                                                                                                             
      339 +                        .foregroundStyle(.primary)                                                                                                                                                                                              
      340 +                        .lineLimit(2)                                                                                                                                                                                                           
      341 +                        .multilineTextAlignment(.leading)                                                                                                                                                                                       
      342 +                                                                                                                                                                                                                                                
      343 +                    // Time ago                                                                                                                                                                                                                 
      344 +                    if !article.timeAgo.isEmpty {                                                                                                                                                                                               
      345 +                        Text(article.timeAgo)                                                                                                                                                                                                   
      346 +                            .font(.system(size: 11))                                                                                                                                                                                            
      347 +                            .foregroundStyle(.tertiary)                                                                                                                                                                                         
      348 +                    }                                                                                                                                                                                                                           
      349                  }
      283 -                .padding(12)                                                                                                                                                                                                                    
      350 +                .frame(maxWidth: .infinity, alignment: .leading)                                                                                                                                                                                
      351 +                                                                                                                                                                                                                                                
      352 +                // Chevron                                                                                                                                                                                                                      
      353 +                Image(systemName: "chevron.right")                                                                                                                                                                                              
      354 +                    .font(.system(size: 12, weight: .semibold))                                                                                                                                                                                 
      355 +                    .foregroundStyle(.tertiary)                                                                                                                                                                                                 
      356              }
      357 +            .padding(12)                                                                                                                                                                                                                        
      358 +            .background(                                                                                                                                                                                                                        
      359 +                RoundedRectangle(cornerRadius: 20)                                                                                                                                                                                              
      360 +                    .fill(Color(.systemBackground))                                                                                                                                                                                             
      361 +                    .shadow(color: .black.opacity(0.04), radius: 8, x: 0, y: 2)                                                                                                                                                                 
      362 +            )                                                                                                                                                                                                                                   
      363 +        }                                                                                                                                                                                                                                       
      364 +        .buttonStyle(CardButtonStyle())                                                                                                                                                                                                         
      365 +    }                                                                                                                                                                                                                                           
      366 +}                                                                                                                                                                                                                                               
      367  
      286 -            // Content                                                                                                                                                                                                                          
      287 -            VStack(alignment: .leading, spacing: 8) {                                                                                                                                                                                           
      288 -                Text(item.title)                                                                                                                                                                                                                
      289 -                    .font(.system(size: 18, weight: .semibold))                                                                                                                                                                                 
      290 -                    .foregroundStyle(.primary)                                                                                                                                                                                                  
      291 -                    .lineLimit(3)                                                                                                                                                                                                               
      368 +// MARK: - Card Button Style                                                                                                                                                                                                                    
      369  
      293 -                Text(item.summary)                                                                                                                                                                                                              
      294 -                    .font(.system(size: 15))                                                                                                                                                                                                    
      295 -                    .foregroundStyle(.secondary)                                                                                                                                                                                                
      296 -                    .lineLimit(2)                                                                                                                                                                                                               
      370 +struct CardButtonStyle: ButtonStyle {                                                                                                                                                                                                           
      371 +    func makeBody(configuration: Configuration) -> some View {                                                                                                                                                                                  
      372 +        configuration.label                                                                                                                                                                                                                     
      373 +            .scaleEffect(configuration.isPressed ? 0.98 : 1)                                                                                                                                                                                    
      374 +            .opacity(configuration.isPressed ? 0.9 : 1)                                                                                                                                                                                         
      375 +            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)                                                                                                                                                              
      376 +    }                                                                                                                                                                                                                                           
      377 +}                                                                                                                                                                                                                                               
      378  
      298 -                // Meta info                                                                                                                                                                                                                    
      299 -                HStack(spacing: 8) {                                                                                                                                                                                                            
      300 -                    Text(item.source)                                                                                                                                                                                                           
      301 -                        .font(.system(size: 13, weight: .medium))                                                                                                                                                                               
      302 -                        .foregroundStyle(.blue)                                                                                                                                                                                                 
      379 +// MARK: - Loading View                                                                                                                                                                                                                         
      380  
      304 -                    Circle()                                                                                                                                                                                                                    
      305 -                        .fill(.tertiary)                                                                                                                                                                                                        
      306 -                        .frame(width: 3, height: 3)                                                                                                                                                                                             
      381 +struct LoadingView: View {                                                                                                                                                                                                                      
      382 +    var body: some View {                                                                                                                                                                                                                       
      383 +        VStack(spacing: 16) {                                                                                                                                                                                                                   
      384 +            ProgressView()                                                                                                                                                                                                                      
      385 +                .scaleEffect(1.2)                                                                                                                                                                                                               
      386 +            Text("Laden...")                                                                                                                                                                                                                    
      387 +                .font(.subheadline)                                                                                                                                                                                                             
      388 +                .foregroundStyle(.secondary)                                                                                                                                                                                                    
      389 +        }                                                                                                                                                                                                                                       
      390 +    }                                                                                                                                                                                                                                           
      391 +}                                                                                                                                                                                                                                               
      392  
      308 -                    Text(item.timeAgo)                                                                                                                                                                                                          
      309 -                        .font(.system(size: 13))                                                                                                                                                                                                
      310 -                        .foregroundStyle(.tertiary)                                                                                                                                                                                             
      393 +// MARK: - Error View                                                                                                                                                                                                                           
      394  
      312 -                    Spacer()                                                                                                                                                                                                                    
      395 +struct ErrorView: View {                                                                                                                                                                                                                        
      396 +    let message: String                                                                                                                                                                                                                         
      397 +    let retry: () -> Void                                                                                                                                                                                                                       
      398  
      314 -                    Button(action: { }) {                                                                                                                                                                                                       
      315 -                        Image(systemName: "bookmark")                                                                                                                                                                                           
      316 -                            .font(.system(size: 16))                                                                                                                                                                                            
      317 -                            .foregroundStyle(.secondary)                                                                                                                                                                                        
      318 -                    }                                                                                                                                                                                                                           
      399 +    var body: some View {                                                                                                                                                                                                                       
      400 +        VStack(spacing: 16) {                                                                                                                                                                                                                   
      401 +            Image(systemName: "wifi.exclamationmark")                                                                                                                                                                                           
      402 +                .font(.system(size: 40))                                                                                                                                                                                                        
      403 +                .foregroundStyle(.secondary)                                                                                                                                                                                                    
      404  
      320 -                    Button(action: { }) {                                                                                                                                                                                                       
      321 -                        Image(systemName: "square.and.arrow.up")                                                                                                                                                                                
      322 -                            .font(.system(size: 16))                                                                                                                                                                                            
      323 -                            .foregroundStyle(.secondary)                                                                                                                                                                                        
      324 -                    }                                                                                                                                                                                                                           
      325 -                }                                                                                                                                                                                                                               
      405 +            Text("Kon nieuws niet laden")                                                                                                                                                                                                       
      406 +                .font(.headline)                                                                                                                                                                                                                
      407 +                                                                                                                                                                                                                                                
      408 +            Text(message)                                                                                                                                                                                                                       
      409 +                .font(.subheadline)                                                                                                                                                                                                             
      410 +                .foregroundStyle(.secondary)                                                                                                                                                                                                    
      411 +                .multilineTextAlignment(.center)                                                                                                                                                                                                
      412 +                                                                                                                                                                                                                                                
      413 +            Button("Opnieuw proberen") {                                                                                                                                                                                                        
      414 +                retry()                                                                                                                                                                                                                         
      415              }
      327 -            .padding(.horizontal, 4)                                                                                                                                                                                                            
      416 +            .buttonStyle(.bordered)                                                                                                                                                                                                             
      417          }
      329 -        .padding(12)                                                                                                                                                                                                                            
      330 -        .background(                                                                                                                                                                                                                            
      331 -            RoundedRectangle(cornerRadius: 20)                                                                                                                                                                                                  
      332 -                .fill(.background)                                                                                                                                                                                                              
      333 -                .shadow(color: .black.opacity(0.06), radius: 12, x: 0, y: 4)                                                                                                                                                                    
      334 -        )                                                                                                                                                                                                                                       
      418 +        .padding()                                                                                                                                                                                                                              
      419      }
      420  }
      421  

⏺ Now let me create the logo asset placeholder in the Assets folder.

⏺ Bash(mkdir -p "/Users/daanster/GitHub/ai-daily/ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Assets.xcassets/ai-logo.imageset")
  ⎿  (No content)

⏺ Write(ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Assets.xcassets/ai-logo.imageset/Contents.json)
  ⎿  Wrote 21 lines to ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Assets.xcassets/ai-logo.imageset/Contents.json
       1 {
       2   "images" : [
       3     {
       4       "idiom" : "universal",
       5       "scale" : "1x"
       6     },
       7     {
       8       "idiom" : "universal",
       9       "scale" : "2x"
      10     },
     … +11 lines (ctrl+o to expand)

⏺ Bash(ls -la "/Users/daanster/GitHub/ai-daily/ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/")
  ⎿  total 56                                            
     drwxr-xr-x  8 daanster  staff    256 Jan  8 12:39 .
     drwxr-xr-x  5 daanster  staff    160 Jan  8 12:16 ..
     … +6 lines (ctrl+o to expand)

⏺ Let me verify all files are properly created and check the git status.

⏺ Bash(ls -la "/Users/daanster/GitHub/ai-daily/ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Services/" && ls -la "/Users/daanster/GitHub/ai-daily/ai-daily-…)
  ⎿  total 8                                            
     drwxr-xr-x@ 3 daanster  staff    96 Jan  8 12:38 .
     drwxr-xr-x  8 daanster  staff   256 Jan  8 12:39 ..
     … +5 lines (ctrl+o to expand)

⏺ Bash(git status)
  ⎿  On branch main                                    
     Your branch is ahead of 'origin/main' by 1 commit.
       (use "git push" to publish your local commits)
     … +20 lines (ctrl+o to expand)

⏺ All tasks completed. Here's a summary of what was implemented:

  Summary

  Task 1: Supabase Integration

  Created two new files:

  1. Services/SupabaseClient.swift
    - Async/actor-based Supabase REST client
    - Uses same credentials as web app (dev fallbacks)
    - Generic fetch<T> method for type-safe queries
    - Configurable filters, ordering, and limits
  2. ViewModels/NewsViewModel.swift
    - @MainActor view model with @Published properties
    - Fetches from v_latest_published and v_most_read_24h views
    - Article model with computed properties for imageURL, timeAgo, readTimeDisplay
    - Dutch locale for relative date formatting

  Task 2: Floating Glass Tab Bar

  - Pill-shaped FloatingTabBar with .ultraThinMaterial background
  - Three tabs: Home, Ontdek (Discover), Opgeslagen (Saved)
  - SF Symbols icons with spring animation on selection
  - Floats above content with shadow

  Task 3: Visual Branding & Card UI

  - LogoView: Tries to load ai-logo from Assets, falls back to styled text
  - Created Assets.xcassets/ai-logo.imageset/ - add your logo PNGs here (@1x, @2x, @3x)
  - NewsCardView: Horizontal layout matching web app's ArticleListRow:
    - 120x80 thumbnail on left with 12pt corner radius
    - Topic name (blue), reading time, title (2 lines), time ago
    - Chevron indicator
    - Press animation with scale effect

  Next Steps in Xcode

  1. Open the project in Xcode
  2. Drag the Services/ and ViewModels/ folders into the project navigator
  3. Add your logo images to Assets.xcassets/ai-logo.imageset/
  4. Build and run to see live data from Supabase

✻ Churned for 3m 25s

❯ Unknown slash command: I 

❯ I have exported the detailed Xcode build errors to the folder /build-errors. Please read the latest build error log in that folder 

⏺ Search(pattern: "**/*", path: "build-errors")
  ⎿  Error searching files

⏺ Bash(find /Users/daanster -name "build-errors" -type d 2>/dev/null | head -5)
  ⎿  Interrupted · What should Claude do instead?

❯ I have exported the detailed Xcode build errors to the folder /Users/daanster/GitHub/ai-daily/ai-daily-ios-swiftui/build-errors . please read the latest build error log in that folder 

⏺ Search(pattern: "*", path: "ai-daily-ios-swiftui/build-errors")
  ⎿  Found 1 file (ctrl+o to expand)

⏺ Read(ai-daily-ios-swiftui/build-errors/Build AIDagelijksNative_2026-01-08T12-49-17.txt)
  ⎿  Read 206 lines

⏺ The issue is clear - NewsViewModel.swift needs to import the Combine framework for @Published and ObservableObject. Let me fix it.

⏺ Update(ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/ViewModels/NewsViewModel.swift)
  ⎿  Added 1 line                                                                                                                                                                                                                                          
       7  
       8  import Foundation
       9  import SwiftUI
      10 +import Combine                                                                                                                                                                                                                                   
      11  
      12  // MARK: - Article Model (matches Supabase schema)
      13  

⏺ Fixed. Added import Combine to NewsViewModel.swift. Try building again in Xcode.

✻ Baked for 35s

❯ The app builds successfully, but I'm getting several 'Main actor-isolated static property' warnings in SupabaseClient.swift.                                                                                                                                
                                                                                                                                                                                                                                                              
  Please fix this by:                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                                              
  Marking the static properties in SupabaseConfig (the url and anonKey) as nonisolated.                                                                                                                                                                       
                                                                                                                                                                                                                                                              
  Since these are constants and do not change, making them nonisolated is the correct way to allow the SupabaseClient to access them from background threads.                                                                                                 
                                                                                                                                                                                                                                                              
  Verify that the yellow warnings disappear after this change                                                                                                                                                                                                 
  ⎿  Interrupted · What should Claude do instead?

❯ In the same map i have the new errors: Build AIDagelijksNative_2026-01-08T13-15-23. The app builds successfully, but    
  I'm getting several 'Main actor-isolated static property' warnings in SupabaseClient.swift.                             
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
  Please fix this by:                                                                                                     
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
  Marking the static properties in SupabaseConfig (the url and anonKey) as nonisolated.                                   
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
  Since these are constants and do not change, making them nonisolated is the correct way to allow the SupabaseClient     
  to access them from background threads.                                                                                 
                                                                                                                          
                                                                                                                          
                                                                                                                          
                                                                                                                          
  Verify that the yellow warnings disappear after this change                                                             

⏺ Read(ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Services/SupabaseClient.swift)
  ⎿  Read 105 lines

⏺ Update(ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Services/SupabaseClient.swift)
  ⎿  Added 4 lines, removed 3 lines                                                                                                                                                                                                                        
      11  
      12  enum SupabaseConfig {
      13      // Development credentials (same as web app fallbacks)
      14 -    static let url = "https://ykfiubiogxetbgdkavep.supabase.co"                                                                                                                                                                                  
      15 -    static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZml1YmlvZ3hldGJnZGthdmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTA1MzcsImV4cCI6MjA3MjEyNjUzN30.MuTGy7n4nCZcsE7qdAmu51CJSyIuU2ePeKHTbBlReNg"      
      14 +    // nonisolated(unsafe) allows access from any isolation context (safe for immutable constants)                                                                                                                                               
      15 +    nonisolated(unsafe) static let url = "https://ykfiubiogxetbgdkavep.supabase.co"                                                                                                                                                              
      16 +    nonisolated(unsafe) static let anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZml1YmlvZ3hldGJnZGthdmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTA1MzcsImV4cCI6MjA3MjEyNjUzN30.MuTGy7n4nCZcsE7qdAmu51CJSyIuU2
         +ePeKHTbBlReNg"                                                                                                                                                                                                                                   
      17  
      18      // Storage bucket URL for images
      18 -    static let storageURL = "\(url)/storage/v1/object/public"                                                                                                                                                                                    
      19 +    nonisolated(unsafe) static let storageURL = "\(url)/storage/v1/object/public"                                                                                                                                                                
      20  }
      21  
      22  // MARK: - Supabase Client

⏺ Fixed. Added nonisolated(unsafe) to all three static constants in SupabaseConfig. This is safe because they're immutable let constants that never change after initialization. Rebuild in Xcode - the warnings should be gone.

✻ Sautéed for 31s

❯ commit the changes named "zijn op ongeveer 20%" 

⏺ Bash(git status)
  ⎿  On branch main                                    
     Your branch is ahead of 'origin/main' by 1 commit.
       (use "git push" to publish your local commits)
     … +27 lines (ctrl+o to expand)

⏺ Bash(git add ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Services/ ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/ViewModels/ ai-daily-ios-swi…)
  ⎿  (No content)

⏺ Bash(git commit -m "zijn op ongeveer 20%…)
  ⎿  [main 17bd2b50] zijn op ongeveer 20%                                                                  
      9 files changed, 564 insertions(+), 201 deletions(-)
      create mode 100644 ai-daily-ios-swiftui/AIDagelijksNative/AIDagelijksNative/Assets.xcassets/.DS_Store
     … +5 lines (ctrl+o to expand)

⏺ Committed 17bd2b50 - "zijn op ongeveer 20%" with 9 files changed including:
  - Services/SupabaseClient.swift
  - ViewModels/NewsViewModel.swift
  - Updated ContentView.swift
  - Project configuration
  - App icons and logo assets

✻ Worked for 39s

❯ UI/UX Restoration & Feature Implementation Prompt                                                                                                                                                                                                           
  Role: Senior SwiftUI UI/UX Engineer & Full-Stack Developer                                                                                                                                                                                                  
                                                                                                                                                                                                                                                              
  Objective: Re-align the SwiftUI application's design with the original brand identity of "AI Dagelijks" as seen in the existing /web and /native projects, while maintaining the high-fidelity "Liquid Glass" iOS feel.                                     
                                                                                                                                                                                                                                                              
  Task 1: Correct the Floating Tab Bar (Footer)                                                                                                                                                                                                               
                                                                                                                                                                                                                                                              
  Items: The tab bar must contain exactly 4 items in this order:                                                                                                                                                                                              
                                                                                                                                                                                                                                                              
  AI Dagelijks (Home) - Icon: house.fill                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                              
  Net Binnen - Icon: clock.fill                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                              
  Mijn Nieuws - Icon: heart.fill                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                              
  Meer - Icon: ellipsis.circle.fill                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                              
  Style: Maintain the floating pill shape with .ultraThinMaterial. Use the brand's Orange as the active tint color.                                                                                                                                           
                                                                                                                                                                                                                                                              
  Task 2: Implement Page-Specific Layout Logic                                                                                                                                                                                                                
                                                                                                                                                                                                                                                              
  Homepage (AI Dagelijks):                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                              
  Top Section: Start with 2 Large News Cards. Style: Full-width high-quality image at the top, with the title and a snippet of the summary text positioned clearly below the image.                                                                           
                                                                                                                                                                                                                                                              
  Bottom Section: Following the two large cards, transition into a vertical list of Small News Cards.                                                                                                                                                         
                                                                                                                                                                                                                                                              
  Net Binnen Page:                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                              
  This page should contain only Small News Cards in a clean, vertical list.                                                                                                                                                                                   
                                                                                                                                                                                                                                                              
  Small Card Style: Square thumbnail on the left, with the Title and Metadata (source, time) stacked on the right.                                                                                                                                            
                                                                                                                                                                                                                                                              
  Task 3: Brand Color Palette & Styling                                                                                                                                                                                                                       
                                                                                                                                                                                                                                                              
  Background: Move away from pure white. Use a Light Grey/Beige (Off-white) background for the app's main view to match the web version.                                                                                                                      
                                                                                                                                                                                                                                                              
  Accents: Use Orange for primary interactions, badges, and active tab states.                                                                                                                                                                                
                                                                                                                                                                                                                                                              
  Cards: Use a clean 20pt corner radius for all images and card containers.                                                                                                                                                                                   
                                                                                                                                                                                                                                                              
  Task 4: Enable Navigation (Detail View)                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                              
  Update the NewsCardView and ContentView to use NavigationLink.                                                                                                                                                                                              
                                                                                                                                                                                                                                                              
  Create a basic ArticleDetailView.swift that opens when a card is tapped, displaying the full article content from Supabase.                                                                                                                                 
                                                                                                                                                                                                                                                              
  Task 5: Asset Integration                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                              
  Use the new ai-logo image (the "AD" minimalist logo) in the LogoView.                                                                                                                                                                                       
                                                                                                                                                                                                                                                              
  Ensure the logo behaves correctly with the existing scroll-fade logic in the GlassHeaderView.                                                                                                                                                               
                                                                                                                                                                                                                                                              
  Action: Analyze the existing code in /ai-daily-webpage and /ai-daily-native to ensure the layout logic and color values are perfectly replicated in the SwiftUI project.                                                                                    
  ⎿  You've hit your limit · resets 2pm (Europe/Amsterdam)
     Opening your options…