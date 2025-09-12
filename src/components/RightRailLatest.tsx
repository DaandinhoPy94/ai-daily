import { ArrowRight } from 'lucide-react';

interface LatestArticle {
  id: string;
  slug: string;
  title: string;
  published_at: string;
}

interface RightRailLatestProps {
  articles: LatestArticle[];
}

export function RightRailLatest({ articles }: RightRailLatestProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <aside className="sticky top-24 bg-card border border-border rounded-lg p-4 lg:p-5">
      <h2 className="text-lg font-bold font-serif mb-4">Het laatste nieuws</h2>
      
      <div className="space-y-3">
        {articles.slice(0, 5).map((article, index) => (
          <div key={article.id}>
            <a 
              href={`/artikel/${article.slug}`}
              className="block py-2 transition-all duration-150 hover:bg-accent hover:bg-opacity-40 -mx-2 px-2 rounded group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-muted-foreground font-mono flex-shrink-0 mt-0.5">
                  {formatTime(article.published_at)}
                </span>
                <h3 className="text-sm leading-snug group-hover:underline">
                  {article.title}
                </h3>
              </div>
            </a>
            {index < articles.length - 1 && (
              <div className="h-px bg-border mt-3"></div>
            )}
          </div>
        ))}
      </div>
      
      <a 
        href="/net-binnen"
        className="flex items-center justify-between mt-6 pt-4 border-t border-border text-sm text-primary hover:underline group"
      >
        <span>Alles naar 'Net binnen'</span>
        <ArrowRight size={16} className="transition-transform duration-150 group-hover:translate-x-1" />
      </a>
    </aside>
  );
}