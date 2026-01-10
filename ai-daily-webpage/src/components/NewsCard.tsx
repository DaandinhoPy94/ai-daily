import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';
import { getArticleKey, useReadArticles } from '../hooks/useReadArticles';
import { ArticleListThumb } from '@/components/media/ArticleListThumb'; // ⬅️ bovenaan toevoegen


interface NewsCardProps {
  article: NewsArticle & { slug?: string; subtitle?: string; image_standard?: string; primary_topic_id?: string; topicName?: string; primary_topic_name?: string };
  variant?: 'hero' | 'standard';
  className?: string;
  onBookmarkClick?: () => void;
}

export function NewsCard({ article, variant = 'standard', className = '', onBookmarkClick }: NewsCardProps) {
  const isHero = variant === 'hero';
  const { isRead, markRead, config } = useReadArticles();
  const key = getArticleKey({ slug: article.slug, id: article.id });
  const topicLabel = (article as any).topicName
    || (article as any).primary_topic_name
    || (article as any).primaryTopicName
    || (article as any).primary_topic_id
    || article.category;
  
  // Generate slug from ID if not provided (fallback)
  const slug = article.slug || `artikel-${article.id}`;
  
  if (!slug) {
    // If no slug available, render as disabled card
    return (
      <article 
        className={`news-card bg-card border border-border rounded-lg overflow-hidden opacity-50 flex flex-col ${className}`}
        aria-disabled="true"
      >
        <div className="relative overflow-hidden">
        {(!article.id) ? (
            // fallback (als id ontbreekt)
            <div className={`w-full bg-muted flex items-center justify-center ${
              isHero ? 'h-64 md:h-80' : 'h-48'
            }`}>
              <span className="text-muted-foreground text-sm font-medium">Image</span>
            </div>
          ) : (
            // ✅ Supabase thumbnail (list)
            <div className={`${isHero ? 'h-64 md:h-80' : 'h-48'} w-full`}>
              <ArticleListThumb id={article.id} title={article.title} fill />
            </div>
          )}
        </div>
        
        <div className="p-4 md:p-5 h-[176px] md:h-[192px] overflow-hidden">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {article.readTimeMinutes} min leestijd{topicLabel && ` - ${topicLabel}`}
          </div>
          
          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold leading-tight mb-2 line-clamp-2 ${
            isHero ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h2>
          
          {/* Third Line: Subtitle */}
          {article.subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.subtitle}
            </p>
          )}
        </div>
      </article>
    );
  }
  
  return (
    <Link
      to={`/artikel/${slug}`}
      className={`news-card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-opacity-40 rounded-lg ${className}`}
      aria-label={`${article.title}${isRead(key) ? ' (gelezen)' : ''} — open article`}
      data-read={isRead(key) ? 'true' : 'false'}
      onClick={() => markRead(key)}
      onMouseDown={() => markRead(key)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          markRead(key);
        }
      }}
    >
      <article className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col">
      <div className="relative overflow-hidden">
        {article.id ? (
          <div className={`${isHero ? 'h-64 md:h-80' : 'h-48'} w-full`}>
            <ArticleListThumb id={article.id} title={article.title} fill />
          </div>
        ) : (
          <div className={`w-full bg-muted flex items-center justify-center ${
            isHero ? 'h-64 md:h-80' : 'h-48'
          }`}>
            <span className="text-muted-foreground text-sm font-medium">Image</span>
          </div>
        )}
          
          {/* Bookmark button (if provided) - positioned outside main link flow */}
          {onBookmarkClick && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmarkClick();
              }}
              className="absolute top-3 right-3 p-2 bg-background/80 rounded-full hover:bg-background transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Bookmark article"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="p-4 md:p-5 h-[176px] md:h-[192px] overflow-hidden">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {article.readTimeMinutes} min leestijd{topicLabel && ` - ${topicLabel}`}
          </div>
          
          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold leading-tight mb-2 group-hover:underline line-clamp-2 ${
            isHero ? 'text-xl md:text-2xl' : 'text-lg'
          } ${isRead(key) ? config.deemphasisClass : 'text-foreground'}`}>
            {article.title}
          </h2>
          
          {/* Third Line: Subtitle */}
          {article.subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {article.subtitle}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}