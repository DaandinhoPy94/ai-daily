interface ArticleMetaProps {
  article: {
    published_at: string;
    read_time_minutes: number;
  };
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
      'jul', 'aug', 'sep', 'okt', 'nov', 'dec'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} · ${hours}:${minutes}`;
  };

  return (
    <div className="text-sm text-muted-foreground mb-2 space-y-1">
      <div>{formatDate(article.published_at)}</div>
      <div>{article.read_time_minutes} min leestijd</div>
    </div>
  );
}