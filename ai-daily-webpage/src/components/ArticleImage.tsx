import { ArticleHero } from '@/components/media/ArticleHero';

interface ArticleImageProps {
  article: {
    id: string;
    title: string;
    media_asset_url?: string; // Media asset image URL from media_asset table
    media_asset_alt?: string; // Media asset alt text
    image_large?: string;
    image_standard?: string;
    image_mobile?: string;
    image_tablet?: string;
  };
  viewType: 'mobile' | 'tablet' | 'desktop';
  priority?: boolean;
}

export function ArticleImage({ article, viewType, priority = false }: ArticleImageProps) {
  return (
    <div className="w-full mb-6">
      {article.id ? (
        <ArticleHero id={article.id} title={article.title} priority={priority} />
      ) : (
        <div className="w-full aspect-video bg-muted flex items-center justify-center rounded-lg">
          <span className="text-muted-foreground text-sm font-medium">Image</span>
        </div>
      )}
    </div>
  );
}