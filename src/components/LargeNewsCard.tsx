import { Link } from 'react-router-dom';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  subtitle?: string; // New subtitle field from Supabase
  readTimeMinutes: number;
  category?: string; // Topic name
  image_path?: string; // Media asset image URL from Supabase storage
  image_alt?: string; // Media asset alt text
}

interface LargeNewsCardProps {
  article: Article;
  className?: string;
}
  
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
            alt={article.image_alt || article.title}
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