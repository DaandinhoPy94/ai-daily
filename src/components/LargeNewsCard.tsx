import { Link } from 'react-router-dom';
import { getArticleKey, useReadArticles } from '../hooks/useReadArticles';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  subtitle?: string; // New subtitle field from Supabase
  readTimeMinutes: number;
  category?: string; // Topic name
  media_asset_url?: string; // Media asset image URL from media_asset table
  media_asset_alt?: string; // Media asset alt text from media_asset table
}

interface LargeNewsCardProps {
  article: Article;
  className?: string;
  priority?: boolean;
}

export function LargeNewsCard({ article, className = '', priority = false }: LargeNewsCardProps) {
  const { isRead, markRead, config } = useReadArticles();
  const key = getArticleKey({ slug: article.slug, id: article.id });
  const imageUrl = article.media_asset_url || 
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';
  
  return (
    <Link 
      to={`/artikel/${article.slug}`}
      className={`block group ${className}`}
      data-read={isRead(key) ? 'true' : 'false'}
      onClick={() => markRead(key)}
      onMouseDown={() => markRead(key)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          markRead(key);
        }
      }}
    >
      <article className="w-full active:scale-[0.995] transition-transform duration-150">
        {/* Image */}
        <div className="relative aspect-video mb-3 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={article.media_asset_alt || article.title}
            className="w-full h-full object-cover group-active:scale-[1.01] transition-transform duration-200"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchpriority: 'high' as any } : {})}
          />
        </div>

        {/* Text Block */}
        <div className="bg-card border border-border rounded-lg p-4 min-h-[180px] lg:min-h-[220px] max-h-[220px] lg:max-h-[280px] flex flex-col overflow-hidden">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-sm text-muted-foreground mb-2">
            {article.readTimeMinutes} min leestijd{article.category && ` - ${article.category}`}
          </div>

          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold text-xl leading-tight mb-2 ${isRead(key) ? config.deemphasisClass : 'text-foreground'}`}>
            {article.title}
          </h2>

          {/* Third Line: Subtitle with fallback to summary */}
          {(article.subtitle || article.summary) && (
            <p className="text-muted-foreground text-base leading-relaxed line-clamp-3">
              {article.subtitle || article.summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}