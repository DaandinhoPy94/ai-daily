import { Link } from 'react-router-dom';
import { getArticleKey, useReadArticles } from '../hooks/useReadArticles';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  image_standard?: string; // Media asset image URL from hero_image_id join
}

interface MiniNewsCardProps {
  article: Article;
}

export function MiniNewsCard({ article }: MiniNewsCardProps) {
  const { isRead, markRead, config } = useReadArticles();
  const key = getArticleKey({ slug: article.slug, id: article.id });
  const imageUrl = !article.image_standard || article.image_standard === 'placeholder' ? 
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop' : 
    article.image_standard;
  
  return (
    <Link 
      to={`/artikel/${article.slug}`}
      className="block group"
      data-read={isRead(key) ? 'true' : 'false'}
      onClick={() => markRead(key)}
      onMouseDown={() => markRead(key)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          markRead(key);
        }
      }}
    >
      <article className="active:scale-[0.995] transition-transform duration-150">
        {/* Image */}
        <div className="relative aspect-video mb-2 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-active:scale-[1.01] transition-transform duration-200"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Text Block */}
        <div className="bg-card border border-border rounded-lg p-3">
          {/* Meta */}
          <div className="text-sm text-muted-foreground mb-2">
            {article.readTimeMinutes} min leestijd{article.topicName && ` · ${article.topicName}`}
          </div>

          {/* Title */}
          <h3 className={`font-medium leading-tight line-clamp-2 ${isRead(key) ? config.deemphasisClass : 'text-foreground'}`}>
            {article.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}