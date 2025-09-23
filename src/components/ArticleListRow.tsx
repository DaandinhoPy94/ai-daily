import { Link } from 'react-router-dom';
import { getArticleKey, useReadArticles } from '../hooks/useReadArticles';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string; // Media asset image URL from media_asset table
  media_asset_alt?: string; // Media asset alt text from media_asset table
}

interface ArticleListRowProps {
  article: Article;
  showDivider?: boolean;
}

export function ArticleListRow({ article, showDivider = true }: ArticleListRowProps) {
  const { isRead, markRead, config } = useReadArticles();
  const key = getArticleKey({ slug: article.slug, id: article.id });
  const imageUrl = article.media_asset_url || 
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=144&h=144&fit=crop';
  
  return (
    <>
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
        <article className="flex gap-3 py-3 px-4 min-h-[96px] active:bg-muted/60 active:scale-[0.998] transition-all duration-150">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={article.media_asset_alt || article.title}
              className="w-[72px] h-[72px] object-cover rounded-md"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Meta */}
            <div className="text-sm text-muted-foreground mb-1">
              {article.readTimeMinutes} min leestijd{article.topicName && ` · ${article.topicName}`}
            </div>

            {/* Title */}
            <h3 className={`font-medium leading-tight line-clamp-2 ${isRead(key) ? config.deemphasisClass : 'text-foreground'}`}>
              {article.title}
            </h3>
          </div>
        </article>
      </Link>

      {/* Divider */}
      {showDivider && (
        <div className="ml-[88px] h-px bg-border" />
      )}
    </>
  );
}