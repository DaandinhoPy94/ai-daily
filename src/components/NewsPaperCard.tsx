import { Link } from 'react-router-dom';

interface Newsletter {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
  readTimeMinutes: number;
}

interface NewsPaperCardProps {
  newsletter: Newsletter;
  className?: string;
}

export function NewsPaperCard({ newsletter, className = '' }: NewsPaperCardProps) {
  return (
    <Link 
      to={`/nieuwsbrief/${newsletter.id}`}
      className={`block group h-full ${className}`}
    >
      <article className="card-animation h-full bg-card border border-border hover:border-muted-foreground/20 rounded-lg overflow-hidden group transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={newsletter.imageUrl}
            alt={newsletter.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col justify-between h-[calc(100%-theme(spacing.40))]">
          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{newsletter.readTimeMinutes} min leestijd</span>
            <span>•</span>
            <span>Nieuwsbrief</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
            {newsletter.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
            {newsletter.description}
          </p>
        </div>
      </article>
    </Link>
  );
}