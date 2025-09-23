import { Link } from 'react-router-dom';

type PaperCardProps = {
  id: string
  title: string
  slug: string
  summary?: string
  publication_date?: string
  cover_icon?: { id: string; path: string; alt?: string; title?: string } | null
  authors?: string[]
  variant?: 'hero' | 'standard'
  className?: string
}

export function PaperCard({ 
  id, 
  title, 
  slug, 
  summary, 
  publication_date, 
  cover_icon, 
  authors, 
  variant = 'standard', 
  className = '' 
}: PaperCardProps) {
  const isHero = variant === 'hero';
  
  // Format publication date for display
  const formattedDate = publication_date 
    ? new Date(publication_date).toLocaleDateString('nl-NL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';
  
  // Format authors list
  const authorsText = authors && authors.length > 0 
    ? authors.length > 3 
      ? `${authors.slice(0, 3).join(', ')} et al.`
      : authors.join(', ')
    : '';

  return (
    <Link
      to={`/paper/${slug}`}
      className={`news-card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-opacity-40 rounded-lg ${className}`}
      aria-label={`${title} — open paper`}
    >
      <article className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
        <div className="relative overflow-hidden">
          {!cover_icon?.path ? (
            <div className={`w-full bg-muted flex items-center justify-center ${
              isHero ? 'h-64 md:h-80' : 'h-48'
            }`}>
              <span className="text-muted-foreground text-sm font-medium">Paper</span>
            </div>
          ) : (
            <img
              src={cover_icon.path}
              alt={cover_icon.alt || title}
              className={`news-card-image w-full object-cover ${
                isHero ? 'h-64 md:h-80' : 'h-48'
              }`}
            />
          )}
        </div>
        
        <div className="p-4 md:p-5">
          {/* First Line: Date - Authors (small text) */}
          <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
            {formattedDate && authorsText ? `${formattedDate} - ${authorsText}` : 
             formattedDate || authorsText || 'Academic Paper'}
          </div>
          
          {/* Second Line: Title (big text) */}
          <h2 className={`font-serif font-bold leading-tight mb-2 group-hover:underline line-clamp-2 ${
            isHero ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {title}
          </h2>
          
          {/* Third Line: Summary */}
          {summary && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {summary}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}