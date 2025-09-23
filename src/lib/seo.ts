// SEO utility functions for the news site

export interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
}

export interface ArticleData {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  seo_title?: string;
  seo_description?: string;
  body?: string;
  published_at?: string;
  updated_at?: string;
  author?: {
    name: string;
  };
  hero_image?: {
    path: string;
    alt?: string;
  };
}

const SITE_NAME = "AI Nieuws";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://aidagelijks.nl"; // TODO: Set VITE_SITE_URL
const DEFAULT_DESCRIPTION = "Het laatste nieuws over kunstmatige intelligentie, AI-ontwikkelingen en technologie-innovaties uit Nederland en de wereld.";
const DEFAULT_IMAGE = "/og-default.jpg"; // TODO: Add default OG image to public folder

export function getDefaultSEO() {
  return {
    titleTemplate: `%s | ${SITE_NAME}`,
    defaultTitle: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    defaultImage: `${SITE_URL}${DEFAULT_IMAGE}`,
    language: 'nl',
  };
}

export function buildCanonical(pathOrSlug: string): string {
  const cleanPath = pathOrSlug.startsWith('/') ? pathOrSlug : `/${pathOrSlug}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildArticleJSONLD(article: ArticleData): string {
  const defaults = getDefaultSEO();
  const canonical = buildCanonical(`/artikel/${article.slug}`);
  
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.seo_title || article.title,
    "description": article.seo_description || article.summary || "",
    "image": article.hero_image?.path ? `${SITE_URL}${article.hero_image.path}` : defaults.defaultImage,
    "datePublished": article.published_at,
    "dateModified": article.updated_at || article.published_at,
    "author": article.author ? {
      "@type": "Person",
      "name": article.author.name
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png` // TODO: Add logo to public folder
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical
    },
    "url": canonical
  };

  // Remove undefined fields
  Object.keys(jsonLD).forEach(key => {
    if (jsonLD[key as keyof typeof jsonLD] === undefined) {
      delete jsonLD[key as keyof typeof jsonLD];
    }
  });

  return JSON.stringify(jsonLD, null, 2);
}

export function buildSEOData(data: Partial<SEOData> = {}): SEOData {
  const defaults = getDefaultSEO();
  
  return {
    title: data.title,
    description: data.description || defaults.description,
    image: data.image || defaults.defaultImage,
    url: data.url || SITE_URL,
    type: data.type || 'website',
    publishedAt: data.publishedAt,
    modifiedAt: data.modifiedAt,
    author: data.author,
  };
}

export function getTopicSEO(topicName: string): SEOData {
  return buildSEOData({
    title: `Laatste ${topicName} Nieuws`,
    description: `Blijf op de hoogte van het laatste nieuws over ${topicName.toLowerCase()}. Ontdek de nieuwste ontwikkelingen en inzichten.`,
    type: 'website',
  });
}