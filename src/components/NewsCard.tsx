import { Link } from 'react-router-dom';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle & { slug?: string; subtitle?: string; image_standard?: string };
  variant?: 'hero' | 'standard';
  className?: string;
  onBookmarkClick?: () => void;
}

export function NewsCard({ article, variant = 'standard', className = '', onBookmarkClick }: NewsCardProps) {
  const isHero = variant === 'hero';
  
  // Generate slug from ID if not provided (fallback)
  const slug = article.slug || `artikel-${article.id}`;
  
  if (!slug) {
    // If no slug available, render as disabled card
    return (
      <article 
        className={`news-card bg-card border border-border rounded-lg overflow-hidden opacity-50 ${className}`}
        aria-disabled="true"
      >
        <div className="relative overflow-hidden">
          {!article.image_standard || article.image_standard === 'placeholder' ? (
            <div className={`w-full bg-muted flex items-center justify-center ${
              isHero ? 'h-64 md:h-80' : 'h-48'
            }`}>
              <span className="text-muted-foreground text-sm font-medium">Image</span>
            </div>
          ) : (
            <img
              src={article.image_standard}
              alt={article.title}
              className={`w-full object-cover ${
                isHero ? 'h-64 md:h-80' : 'h-48'
              }`}
            />
          )}
        </div>
        
        <div className="p-4 md:p-5">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {article.readTimeMinutes} min leestijd{article.category && ` - ${article.category}`}
          </div>
          
          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold leading-tight mb-2 ${
            isHero ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h2>
          
          {/* Third Line: Subtitle */}
          {article.subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">
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
      aria-label={`${article.title} — open article`}
    >
      <article className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="relative overflow-hidden">
          {!article.image_standard || article.image_standard === 'placeholder' ? (
            <div className={`w-full bg-muted flex items-center justify-center ${
              isHero ? 'h-64 md:h-80' : 'h-48'
            }`}>
              <span className="text-muted-foreground text-sm font-medium">Image</span>
            </div>
          ) : (
            <img
              src={article.image_standard}
              alt={article.title}
              className={`news-card-image w-full object-cover ${
                isHero ? 'h-64 md:h-80' : 'h-48'
              }`}
            />
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
        
        <div className="p-4 md:p-5">
          {/* First Line: Reading Time - Topic (small text) */}
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {article.readTimeMinutes} min leestijd{article.category && ` - ${article.category}`}
          </div>
          
          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold leading-tight mb-2 group-hover:underline ${
            isHero ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h2>
          
          {/* Third Line: Subtitle */}
          {article.subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {article.subtitle}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}