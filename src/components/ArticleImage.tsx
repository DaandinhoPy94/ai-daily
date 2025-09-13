interface ArticleImageProps {
  article: {
    title: string;
    media_asset_url?: string; // Media asset image URL from media_asset table
    media_asset_alt?: string; // Media asset alt text
    image_large?: string;
    image_standard?: string;
    image_mobile?: string;
    image_tablet?: string;
  };
  viewType: 'mobile' | 'tablet' | 'desktop';
}

export function ArticleImage({ article, viewType }: ArticleImageProps) {
  // Prioritize media_asset_url from media_assets, then fall back to article image fields
  let imageUrl: string;
  
  if (article.media_asset_url) {
    imageUrl = article.media_asset_url;
  } else {
    // Fall back to article image fields based on view type
    switch (viewType) {
      case 'mobile':
        imageUrl = article.image_mobile || article.image_standard || article.image_large || '';
        break;
      case 'tablet':
        imageUrl = article.image_tablet || article.image_standard || article.image_large || '';
        break;
      default:
        imageUrl = article.image_large || article.image_standard || '';
    }
  }

  const alt = article.media_asset_alt || article.title;
  
  // Use fallback if no image is set
  if (!imageUrl || imageUrl === 'placeholder') {
    imageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';
  }

  return (
    <div className="w-full mb-6">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-auto rounded-lg"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}