interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
  topic: {
    name: string;
  };
  published_at: string;
}

interface RelatedListProps {
  articles: RelatedArticle[];
}

export function RelatedList({ articles }: RelatedListProps) {
  return (
    <section className="mb-12">
      <div className="h-px bg-border mb-6"></div>
      
      <h2 className="text-xl font-bold font-serif mb-6">Lees ook</h2>
      
      <div className="space-y-4">
        {articles.slice(0, 4).map((article, index) => (
          <div key={article.id}>
            <a 
              href={`/artikel/${article.slug}`}
              className="flex items-center gap-4 py-3 -mx-2 px-2 rounded transition-all duration-150 hover:bg-accent hover:bg-opacity-40 group"
            >
              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                Image
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium leading-snug mb-1 group-hover:underline">
                  {article.title}
                </h3>
                <div className="text-xs text-muted-foreground">
                  {article.topic.name}
                </div>
              </div>
            </a>
            
            {index < articles.length - 1 && (
              <div className="h-px bg-border"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}