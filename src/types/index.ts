export interface Ticker {
  symbol: string;
  value: string;
  delta: string;
  direction: 'up' | 'down' | 'flat';
}

export interface NewsArticle {
  id: string;
  slug?: string;
  imageUrl: string;
  readTimeMinutes: number;
  category: string;
  title: string;
  summary: string;
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