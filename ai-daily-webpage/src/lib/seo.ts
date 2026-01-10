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

const SITE_NAME = "AI Dagelijks";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://www.aidagelijks.nl";
const DEFAULT_DESCRIPTION = "Het laatste nieuws over kunstmatige intelligentie, AI-ontwikkelingen en technologie-innovaties uit Nederland en de wereld.";
const DEFAULT_IMAGE = "/placeholder.svg"; // uses existing public asset to avoid 404
const PUBLISHER_LOGO = "/favicon.ico"; // uses existing public icon
const SOCIAL_SAME_AS = [
  "https://x.com/AI_dagelijks",
  "https://www.linkedin.com/company/ai-dagelijks/",
  "https://www.instagram.com/ai.dagelijks/",
  "https://www.facebook.com/aidagelijks"
];

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
        "url": `${SITE_URL}${PUBLISHER_LOGO}`
      },
      "sameAs": SOCIAL_SAME_AS
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

// JSON-LD helpers
export function buildBreadcrumbJSONLD(items: Array<{ name: string; url: string }>): string {
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return JSON.stringify(jsonLD, null, 2);
}

export function buildOrganizationJSONLD(): string {
  const defaults = getDefaultSEO();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": defaults.siteName,
    "url": defaults.siteUrl,
    "logo": `${defaults.siteUrl}${PUBLISHER_LOGO}`,
    "sameAs": SOCIAL_SAME_AS
  }, null, 2);
}

export function buildWebsiteJSONLD(): string {
  const defaults = getDefaultSEO();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": defaults.siteName,
    "url": defaults.siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${defaults.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }, null, 2);
}