import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArticleListRow } from '@/components/ArticleListRow';
import { getTopicBySlug, followTopic, unfollowTopic, isFollowingTopic } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTopicSEO, buildCanonical } from '@/lib/seo';
import NotFound from '@/pages/NotFound';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';

interface Article {
  id: string;
  slug: string;
  title: string;
  published_at: string;
  readTimeMinutes: number;
  media_asset_url?: string;
  media_asset_alt?: string;
}

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

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
    const fetchTopicAndArticles = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // Get topic by slug (with alias resolution)
        const topicData = await getTopicBySlug(slug);
        if (!topicData) {
          setTopic(null);
          setLoading(false);
          return;
        }
        
        setTopic(topicData);

        // Check if user is following this topic
        if (user) {
          const following = await isFollowingTopic(topicData.id, user.id);
          setIsFollowing(following);
        }

        // Fetch articles for this topic
        await fetchArticles(topicData);
      } catch (error) {
        console.error('Error fetching topic:', error);
        setTopic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndArticles();
  }, [slug, user]);

  const fetchArticles = async (topicData: any) => {
    try {
      let articlesQuery = supabase
        .from('articles')
        .select(`
          id,
          slug,
          title,
          published_at,
          read_time_minutes,
          topic_id,
          media_assets!articles_hero_image_id_fkey (
            path,
            alt
          )
        `)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      // If main topic, include articles from subcategories
      if (topicData.type === 'main') {
        // Get all subtopic IDs for this main topic
        const { data: subTopics } = await supabase
          .from('topics')
          .select('id')
          .eq('parent_slug', topicData.slug)
          .eq('is_active', true);

        const subTopicIds = subTopics?.map(t => t.id) || [];
        const allTopicIds = [topicData.id, ...subTopicIds];
        
        articlesQuery = articlesQuery.in('topic_id', allTopicIds);
      } else {
        // Sub topic - only articles for this specific topic
        articlesQuery = articlesQuery.eq('topic_id', topicData.id);
      }

      const { data: articlesData } = await articlesQuery.limit(50);

      const formattedArticles: Article[] = (articlesData || []).map(article => ({
        id: article.id,
        slug: article.slug,
        title: article.title,
        published_at: article.published_at,
        readTimeMinutes: article.read_time_minutes,
        media_asset_url: article.media_assets?.path,
        media_asset_alt: article.media_assets?.alt
      }));

      setArticles(formattedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !topic) {
      toast.error('Je moet ingelogd zijn om onderwerpen te volgen');
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const result = await unfollowTopic(topic.id, user.id);
        if (result.success) {
          setIsFollowing(false);
          toast.success(`Je volgt ${topic.name} niet meer`);
        } else {
          toast.error('Fout bij het ontvolgen van onderwerp');
        }
      } else {
        const result = await followTopic(topic.id, user.id);
        if (result.success) {
          setIsFollowing(true);
          toast.success(`Je volgt nu ${topic.name}`);
        } else {
          toast.error('Fout bij het volgen van onderwerp');
        }
      }
    } catch (error) {
      console.error('Follow toggle error:', error);
      toast.error('Er is een fout opgetreden');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
      </div>
    );
  }

  if (!topic || !slug) {
    return <NotFound />;
  }

  const seo = getTopicSEO(topic.name);
  const canonical = buildCanonical(`/topic/${topic.slug}`);

  const content = (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl py-8">
      {/* SEO */}
      <Helmet>
        <html lang="nl" />
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
      </Helmet>

      {/* Header Block */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">Onderwerp</p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground mb-6">
          {topic.name}
        </h1>
        <Button 
          onClick={handleFollowToggle}
          disabled={followLoading || !user}
          size="lg"
          className="font-medium"
          aria-label={`Volg ${topic.name}`}
          aria-pressed={isFollowing}
        >
          {followLoading ? (
            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></div>
          ) : isFollowing ? (
            '✓ Volgend'
          ) : (
            '+ Volg'
          )}
        </Button>
      </div>

      {/* Articles List */}
      <section className="bg-card rounded-lg border border-border">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nog geen artikelen voor dit onderwerp.
          </div>
        ) : (
          <div role="list">
            {articles.map((article, index) => (
              <ArticleListRow
                key={article.id}
                article={article}
                showDivider={index < articles.length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );

  if (viewType === 'tablet') {
    return (
      <TabletAppShell viewType="tablet">
        {content}
      </TabletAppShell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {viewType === 'mobile' ? <MobileHeader /> : <Header />}
      
      <main>
        {content}
      </main>

      {viewType === 'mobile' ? <BottomTabBar viewType="mobile" /> : <Footer />}
    </div>
  );
}