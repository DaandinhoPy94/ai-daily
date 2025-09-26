// src/components/lists/BookmarkedArticleListRow.tsx
import { ArticleListRow } from '@/components/ArticleListRow';

type JoinedTopic = { name: string } | null | undefined;

type JoinedArticle = {
  id: string;
  slug: string;
  title: string;
  read_time_minutes?: number | null;
  topics?: JoinedTopic | JoinedTopic[];
  media_asset_url?: string | null;
  media_asset_alt?: string | null;
};

export interface BookmarkRowProps {
  bookmark: {
    created_at: string;
    article: JoinedArticle;
  };
  showDivider?: boolean;
}

export function BookmarkedArticleListRow({ bookmark, showDivider = true }: BookmarkRowProps) {
  const art = bookmark.article;

  // Extract topic name from possible shapes: single object or array
  let topicName: string | undefined;
  if (Array.isArray(art.topics)) {
    topicName = art.topics[0]?.name || undefined;
  } else if (art.topics && 'name' in art.topics) {
    topicName = art.topics?.name || undefined;
  }

  return (
    <ArticleListRow
      article={{
        id: art.id,
        slug: art.slug,
        title: art.title,
        readTimeMinutes: Math.max(1, Number(art.read_time_minutes || 1)),
        topicName,
        media_asset_url: art.media_asset_url || undefined,
        media_asset_alt: art.media_asset_alt || undefined,
      }}
      showDivider={showDivider}
    />
  );
}


