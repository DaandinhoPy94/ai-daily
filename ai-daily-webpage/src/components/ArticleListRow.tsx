// src/components/ArticleListRow.tsx
import { Link } from 'react-router-dom';
import { getArticleKey, useReadArticles } from '../hooks/useReadArticles';
import { ArticleListThumb } from '@/components/media/ArticleListThumb';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

export function ArticleListRow({ article, showDivider = true }: { article: Article; showDivider?: boolean }) {
  const { isRead, markRead, config } = useReadArticles();
  const key = getArticleKey({ slug: article.slug, id: article.id });

  return (
    <>
      <Link
        to={`/artikel/${article.slug}`}
        className="block group"
        data-read={isRead(key) ? 'true' : 'false'}
        onClick={() => markRead(key)}
        onMouseDown={() => markRead(key)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') markRead(key); }}
      >
        <article className="flex gap-3 py-3 px-4 min-h-[96px] active:bg-muted/60 active:scale-[0.998] transition-all duration-150">
          {/* Thumbnail – 120px breed, 16:9 */}
          <div className="flex-shrink-0 w-[120px]">
            {article.id ? (
              <ArticleListThumb id={article.id} title={article.title} targetWidth={120} />
            ) : (
              <div className="w-[120px] h-[68px] bg-muted rounded-md" />
            )}
          </div>

          {/* Tekst */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="text-sm text-muted-foreground mb-1">
              {article.readTimeMinutes} min leestijd{article.topicName && ` · ${article.topicName}`}
            </div>
            <h3 className={`font-medium leading-tight line-clamp-2 ${isRead(key) ? config.deemphasisClass : 'text-foreground'}`}>
              {article.title}
            </h3>
          </div>
        </article>
      </Link>

      {showDivider && <div className="ml-[136px] h-px bg-border" />}
    </>
  );
}
