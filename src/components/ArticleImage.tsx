interface ArticleImageProps {
  article: {
    title: string;
    image_large?: string;
    image_standard?: string;
    image_mobile?: string;
    image_tablet?: string;
  };
  viewType: 'mobile' | 'tablet' | 'desktop';
}

export function ArticleImage({ article, viewType }: ArticleImageProps) {
  // Select appropriate image based on view type
  let imageUrl: string;
  
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

  // Use fallback if no image is set
  if (!imageUrl || imageUrl === 'placeholder') {
    imageUrl = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop';
  }

  return (
    <div className="w-full mb-6">
      <img
        src={imageUrl}
        alt={article.title}
        className="w-full h-auto rounded-lg"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}