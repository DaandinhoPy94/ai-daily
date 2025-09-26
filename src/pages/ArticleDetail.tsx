import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BottomTabBar } from '../components/BottomTabBar';
import { MobileHeaderArticle } from '@/components/header/MobileHeaderArticle';
import { ShareBar } from '../components/ShareBar';
import { ArticleMeta } from '../components/ArticleMeta';
import { TripleDivider } from '../components/TripleDivider';
import { SummaryBox } from '../components/SummaryBox';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleImage } from '../components/ArticleImage';
import { RightRailLatest } from '../components/RightRailLatest';
import { RelatedList } from '../components/RelatedList';
import { RelatedTopics } from '../components/RelatedTopics';
import { ArticleComments } from '../components/ArticleComments';
import { Toaster } from '@/components/ui/toaster';
import { getArticleBySlug, getLatest, recordView } from '../lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { buildArticleJSONLD, buildCanonical, getDefaultSEO, buildBreadcrumbJSONLD } from '../lib/seo';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  published_at: string;
  updated_at: string;
  read_time_minutes: number;
  seo_title?: string;
  seo_description?: string;
  image_large?: string;
  image_standard?: string;
  image_mobile?: string;
  image_tablet?: string;
  media_assets?: {
    path: string;
    alt?: string;
  };
  hero_image?: {
    path: string;
    alt?: string;
  };
  author?: {
    name: string;
    avatar_url?: string;
  };
  topic: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  topics?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface LatestArticle {
  id: string;
  slug: string;
  title: string;
  published_at: string;
}

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  imageUrl?: string;
  topic: {
    name: string;
  };
  published_at: string;
  read_time_minutes?: number;
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [article, setArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<LatestArticle[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewType('mobile');
      } else if (width >= 768 && width <= 1024) {
        setViewType('tablet');
      } else {
        setViewType('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    async function fetchArticleData() {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch article data from articles_with_topics to get topics
        const { data: articleWithTopics, error: articleError } = await (supabase as any)
          .from('articles_with_topics')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (articleError || !articleWithTopics) {
          setError('Artikel niet gevonden');
          return;
        }

        const articleData = articleWithTopics;

        // Fetch hero image data if hero_image_id exists
        let heroImageData = null;
        if (articleData.hero_image_id) {
          const { data: heroImage } = await (supabase as any)
            .from('media_assets')
            .select('path, alt')
            .eq('id', articleData.hero_image_id)
            .maybeSingle();
          heroImageData = heroImage;
        }

        // Fetch author data if author_id exists
        let authorData = null;
        if (articleData.author_id) {
          const { data: author } = await (supabase as any)
            .from('authors')
            .select('name, avatar_url')
            .eq('id', articleData.author_id)
            .maybeSingle();
          authorData = author;
        }

        // Fetch topic data
        let topicData = null;
        if (articleData.primary_topic_id) {
          const { data: topic } = await (supabase as any)
            .from('topics')
            .select('id, name, slug')
            .eq('id', articleData.primary_topic_id)
            .maybeSingle();
          topicData = topic;
        }

        // Fetch tags
        const { data: articleTags } = await (supabase as any)
          .from('article_tags')
          .select(`
            tags (
              name,
              slug
            )
          `)
          .eq('article_id', articleData.id);

        const tags = articleTags?.map((at: any) => at.tags).filter(Boolean) || [];

        // Construct full article object
        const fullArticle: Article = {
          ...articleData,
          hero_image: heroImageData,
          author: authorData,
          topic: topicData || { id: '', name: 'Algemeen', slug: 'algemeen' },
          tags: tags,
          topics: articleData.topics || [] // Add topics from articles_with_topics
        };

        setArticle(fullArticle);

        // Fetch related articles based on matching topics
        let related: RelatedArticle[] = [];
        if (articleData.topics && articleData.topics.length > 0) {
          // Extract topic IDs from the current article's topics
          const topicIds = articleData.topics.map((topic: any) => topic.id);
          
          // Find articles that share at least one topic with the current article
          const { data: topicArticles } = await (supabase as any)
            .from('article_topics')
            .select(`
              article_id,
              articles!inner (
                id,
                slug,
                title,
                published_at,
                read_time_minutes,
                primary_topic_id,
                hero_image_id,
                topics (
                  name
                )
              )
            `)
            .in('topic_id', topicIds)
            .neq('article_id', articleData.id)
            .eq('articles.status', 'published')
            .lte('articles.published_at', new Date().toISOString())
            .order('articles.published_at', { ascending: false })
            .limit(6);

          if (topicArticles && topicArticles.length > 0) {
            // Remove duplicates and map to RelatedArticle format
            const uniqueArticles = topicArticles.reduce((acc: any[], current: any) => {
              const exists = acc.find(item => item.articles.id === current.articles.id);
              if (!exists) {
                acc.push(current);
              }
              return acc;
            }, []);

            // Fetch media assets for the articles
            const articleIds = uniqueArticles.slice(0, 3).map(item => item.articles.id);
            const { data: mediaAssets } = await (supabase as any)
              .from('media_assets')
              .select('id, path, alt')
              .in('id', uniqueArticles.slice(0, 3).map(item => item.articles.hero_image_id).filter(Boolean));

            const mediaAssetsMap = (mediaAssets || []).reduce((acc: any, asset: any) => {
              acc[asset.id] = asset;
              return acc;
            }, {});

            related = uniqueArticles.slice(0, 3).map((item: any) => {
              const heroImage = mediaAssetsMap[item.articles.hero_image_id];
              return {
                id: item.articles.id,
                slug: item.articles.slug,
                title: item.articles.title,
                imageUrl: heroImage?.path || null,
                topic: { name: item.articles.topics?.name || 'Algemeen' },
                published_at: item.articles.published_at,
                read_time_minutes: item.articles.read_time_minutes
              };
            });
          }
        }

        // Fallback to recent articles if no topic matches found
        if (related.length === 0) {
          const { data: fallbackData } = await (supabase as any)
            .from('articles')
            .select(`
              id,
              slug,
              title,
              published_at,
              read_time_minutes,
              hero_image_id,
              topics (
                name
              )
            `)
            .neq('id', articleData.id)
            .eq('status', 'published')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false })
            .limit(3);

          if (fallbackData && fallbackData.length > 0) {
            // Fetch media assets for fallback articles
            const { data: fallbackMediaAssets } = await (supabase as any)
              .from('media_assets')
              .select('id, path, alt')
              .in('id', fallbackData.map(item => item.hero_image_id).filter(Boolean));

            const fallbackMediaMap = (fallbackMediaAssets || []).reduce((acc: any, asset: any) => {
              acc[asset.id] = asset;
              return acc;
            }, {});

            related = fallbackData.map((art: any) => {
              const heroImage = fallbackMediaMap[art.hero_image_id];
              return {
                id: art.id,
                slug: art.slug,
                title: art.title,
                imageUrl: heroImage?.path || null,
                topic: { name: art.topics?.name || 'Algemeen' },
                published_at: art.published_at,
                read_time_minutes: art.read_time_minutes
              };
            });
          }
        }

        setRelatedArticles(related);

        // Fetch latest articles for sidebar
        const latestData = await getLatest(5);
        const latest: LatestArticle[] = (latestData || []).map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          published_at: item.published_at
        }));
        setLatestArticles(latest);

        // Record article view
        await recordView(articleData.id);

      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Er ging iets mis bij het laden van het artikel.');
      } finally {
        setLoading(false);
      }
    }

    fetchArticleData();
  }, [slug]);

  if (loading) {
    const loadingContent = (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Artikel laden...</p>
        </div>
      </div>
    );

    if (viewType === 'tablet') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeaderArticle />
            <main>{loadingContent}</main>
          </div>
          <BottomTabBar viewType="tablet" />
        </>
      );
    }

    if (viewType === 'mobile') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeaderArticle />
            <main>{loadingContent}</main>
          </div>
          <BottomTabBar viewType="mobile" />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>{loadingContent}</main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    const errorContent = (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel niet gevonden</h1>
          <p className="text-muted-foreground mb-4">
            {error || 'Het opgevraagde artikel kon niet worden geladen.'}
          </p>
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Terug naar home
          </a>
        </div>
      </div>
    );

    if (viewType === 'tablet') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeaderArticle />
            <main>{errorContent}</main>
          </div>
          <BottomTabBar viewType="tablet" />
        </>
      );
    }

    if (viewType === 'mobile') {
      return (
        <>
          <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
            <MobileHeaderArticle />
            <main>{errorContent}</main>
          </div>
          <BottomTabBar viewType="mobile" />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>{errorContent}</main>
        <Footer />
      </div>
    );
  }

  const defaults = getDefaultSEO();
  const pageTitle = article.seo_title || article.title;
  const pageDescription = article.seo_description || article.summary || defaults.description;
  const canonical = buildCanonical(`/artikel/${article.slug}`);
  const ogImage = article.hero_image?.path ? `${defaults.siteUrl}${article.hero_image.path}` : defaults.defaultImage;
  const jsonLD = buildArticleJSONLD({
    ...article,
    hero_image: article.hero_image,
  });

  const articleContent = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={defaults.siteName} />
        <meta property="article:published_time" content={article.published_at} />
        <meta property="article:modified_time" content={article.updated_at} />
        {article.author && <meta property="article:author" content={article.author.name} />}
        {article.topic && <meta property="article:section" content={article.topic.name} />}
        {article.tags.map(tag => (
          <meta key={tag.slug} property="article:tag" content={tag.name} />
        ))}
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {jsonLD}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Share Toolbar - Desktop Only */}
        <div className="hidden lg:block lg:col-span-1">
          <ShareBar article={article} />
        </div>

        {/* Main Article Column */}
        <article className="lg:col-span-8">
          <ArticleMeta article={article} />
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-3 lg:mb-4">
            {article.title}
          </h1>

          {article.author && (
            <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
              {article.author.avatar_url && (
                <img 
                  src={article.author.avatar_url} 
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span>Door {article.author.name}</span>
            </div>
          )}

          {/* Mobile Share Bar */}
          <div className="lg:hidden mb-6">
            <ShareBar article={article} mobile />
          </div>

          <ArticleImage article={{
            title: article.title,
            media_asset_url: article.hero_image?.path,
            media_asset_alt: article.hero_image?.alt,
            image_large: article.image_large,
            image_standard: article.image_standard,
            image_mobile: article.image_mobile,
            image_tablet: article.image_tablet
          }} viewType={viewType} priority />
          
          <TripleDivider />

          {article.summary && article.body && article.body.length > 800 && (
            <SummaryBox summary={article.summary} />
          )}

          <ArticleBody content={article.body} />
        </article>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3">
          <RightRailLatest articles={latestArticles} />
        </aside>
      </div>

      {/* Related Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-12">
        <div className="lg:col-start-2 lg:col-span-8">
          <RelatedList articles={relatedArticles} />
          <RelatedTopics topics={article.topics} />
          <div className="mt-12">
            <ArticleComments articleId={article.id} />
          </div>
        </div>
      </div>
      </div>
    </>
  );

  if (viewType === 'tablet') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeaderArticle articleId={article.id} />
          <main>
            {articleContent}
          </main>
        </div>
        <BottomTabBar viewType="tablet" />
        <Toaster />
      </>
    );
  }

  if (viewType === 'mobile') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeaderArticle articleId={article.id} />
          <main>
            {articleContent}
          </main>
        </div>
        <BottomTabBar viewType="mobile" />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {articleContent}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}