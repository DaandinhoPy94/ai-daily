import { Link } from 'react-router-dom';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  subtitle?: string;
  readTimeMinutes: number;
  category?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface LargeNewsCardProps {
  article: Article;
  className?: string;
}

export function LargeNewsCard({ article, className = '' }: LargeNewsCardProps) {
  const imageUrl = article.media_asset_url || 
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';
  
  return (
    <Link 
      to={`/artikel/${article.slug}`}
      className={`block group ${className}`}
    >
      <article className="w-full active:scale-[0.995] transition-transform duration-150">
        {/* Image */}
        <div className="relative aspect-video mb-3 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={article.media_asset_alt || article.title}
            className="w-full h-full object-cover group-active:scale-[1.01] transition-transform duration-200"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Text Block */}
        <div className="bg-card border border-border rounded-lg p-4 min-h-[180px] lg:min-h-[220px] max-h-[220px] lg:max-h-[280px] flex flex-col overflow-hidden">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-sm text-muted-foreground mb-2">
            {article.readTimeMinutes} min leestijd{article.category && ` - ${article.category}`}
          </div>

          {/* Second Line: Title (big text) */}
          <h2 className="font-serif font-bold text-foreground text-xl leading-tight mb-2">
            {article.title}
          </h2>

          {/* Third Line: Subtitle */}
          {article.subtitle && (
            <p className="text-muted-foreground text-base leading-relaxed">
              {article.subtitle}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}