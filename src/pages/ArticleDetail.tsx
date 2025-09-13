import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileHeader } from '../components/MobileHeader';
import { BottomTabBar } from '../components/BottomTabBar';
import { TabletAppShell } from '../components/TabletAppShell';
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
import { buildArticleJSONLD, buildCanonical, getDefaultSEO } from '../lib/seo';

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

        // Fetch article data
        const articleData = await getArticleBySlug(slug);
        if (!articleData) {
          setError('Artikel niet gevonden');
          return;
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
        if (articleData.topic_id) {
          const { data: topic } = await (supabase as any)
            .from('topics')
            .select('id, name, slug')
            .eq('id', articleData.topic_id)
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
          author: authorData,
          topic: topicData || { id: '', name: 'Algemeen', slug: 'algemeen' },
          tags: tags
        };

        setArticle(fullArticle);

        // Fetch related articles
        const { data: relatedData } = await (supabase as any)
          .from('article_relations')
          .select(`
            related_article_id,
            relation_order,
            articles!article_relations_related_article_id_fkey (
              id,
              slug,
              title,
              published_at,
              topic_id,
              topics (
                name
              )
            )
          `)
          .eq('article_id', articleData.id)
          .order('relation_order');

        let related: RelatedArticle[] = [];
        if (relatedData && relatedData.length > 0) {
          related = relatedData.map((rel: any) => ({
            id: rel.articles.id,
            slug: rel.articles.slug,
            title: rel.articles.title,
            imageUrl: 'placeholder',
            topic: { name: rel.articles.topics?.name || 'Algemeen' },
            published_at: rel.articles.published_at
          }));
        } else {
          // Fallback to same topic articles
          const { data: fallbackData } = await (supabase as any)
            .from('articles')
            .select(`
              id,
              slug,
              title,
              published_at,
              topics (
                name
              )
            `)
            .eq('topic_id', articleData.topic_id)
            .neq('id', articleData.id)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(4);

          related = (fallbackData || []).map((art: any) => ({
            id: art.id,
            slug: art.slug,
            title: art.title,
            imageUrl: 'placeholder',
            topic: { name: art.topics?.name || 'Algemeen' },
            published_at: art.published_at
          }));
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
        <TabletAppShell viewType="tablet">
          {loadingContent}
        </TabletAppShell>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        {viewType === 'mobile' ? <MobileHeader /> : <Header />}
        <main>{loadingContent}</main>
        {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
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
        <TabletAppShell viewType="tablet">
          {errorContent}
        </TabletAppShell>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        {viewType === 'mobile' ? <MobileHeader /> : <Header />}
        <main>{errorContent}</main>
        {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
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

          <ArticleImage article={article} viewType={viewType} />
          
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
          <RelatedTopics tags={article.tags} />
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
      <TabletAppShell viewType="tablet">
        {articleContent}
        <Toaster />
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      
      <main>
        {articleContent}
      </main>

      {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
      <Toaster />
    </div>
  );
}