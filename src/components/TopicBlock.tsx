import { MiniNewsCard } from './MiniNewsCard';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
}

interface TopicBlockProps {
  heading: string;
  articles: Article[];
  showAllLink?: boolean;
}

export function TopicBlock({ heading, articles, showAllLink = true }: TopicBlockProps) {
  return (
    <section className="px-4 mb-6">
      {/* Heading Row */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-foreground">
          {heading}
        </h2>
        {showAllLink && (
          <button className="text-muted-foreground text-sm hover:text-primary transition-colors duration-150">
            Alles
          </button>
        )}
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        {articles.slice(0, 4).map((article) => (
          <MiniNewsCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}