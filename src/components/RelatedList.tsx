import { Link } from 'react-router-dom';

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
  topic: {
    name: string;
  };
  published_at: string;
  read_time_minutes?: number;
}

interface RelatedListProps {
  articles: RelatedArticle[];
}

export function RelatedList({ articles }: RelatedListProps) {
  return (
    <section className="mb-12">
      <div className="h-px bg-border mb-6"></div>
      
      <h2 className="text-xl font-bold font-serif mb-6">Lees ook</h2>
      
      <div className="space-y-0">
        {articles.slice(0, 3).map((article, index) => (
          <div key={article.id}>
            <Link 
              to={`/artikel/${article.slug}`}
              className="block group"
            >
              <article className="flex gap-3 py-3 px-4 min-h-[96px] active:bg-muted/60 active:scale-[0.998] transition-all duration-150 hover:bg-accent/40">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={article.imageUrl && article.imageUrl !== 'placeholder' 
                      ? article.imageUrl 
                      : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=144&h=144&fit=crop'
                    }
                    alt={article.title}
                    className="w-[72px] h-[72px] object-cover rounded-md bg-muted"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {/* Meta */}
                  <div className="text-sm text-muted-foreground mb-1">
                    {article.read_time_minutes ? `${article.read_time_minutes} min leestijd` : '3 min leestijd'} · {article.topic.name}
                  </div>

                  {/* Title */}
                  <h3 className="font-medium text-foreground leading-tight line-clamp-2 group-hover:underline">
                    {article.title}
                  </h3>
                </div>
              </article>
            </Link>

            {/* Divider */}
            {index < articles.length - 1 && (
              <div className="ml-[88px] h-px bg-border" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}