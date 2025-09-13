export interface Ticker {
  symbol: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
}

export interface NewsArticle {
  id: string;
  slug?: string;
  media_asset_url?: string; // Media asset image URL from media_asset table
  media_asset_alt?: string; // Media asset alt text from media_asset table
  readTimeMinutes: number;
  category: string;
  title: string;
  summary: string;
  subtitle?: string; // Optional subtitle field
}

export interface RightRailItem {
  time: string;
  category?: string;
  title: string;
  url: string;
}

export interface TopicSection {
  heading: string;
  articles: NewsArticle[];
}