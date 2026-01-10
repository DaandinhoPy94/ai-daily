import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TopicSectionList } from '@/components/TopicSectionList';
import { getTopicBySlug, followTopic, unfollowTopic, isFollowingTopic } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getTopicSEO, buildCanonical } from '@/lib/seo';
import NotFound from '@/pages/NotFound';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { TabletAppShell } from '@/components/TabletAppShell';

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState<any>(null);
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
    const fetchTopic = async () => {
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
      } catch (error) {
        console.error('Error fetching topic:', error);
        setTopic(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [slug, user]);


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
      <TopicSectionList topic={topic} />
    </div>
  );

  // Mobile & Tablet: Use MobileHeader + BottomTabBar
  if (viewType === 'mobile' || viewType === 'tablet') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeader />
          <main>
            {content}
          </main>
        </div>
        <BottomTabBar viewType={viewType} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {content}
      </main>

      <Footer />
    </div>
  );
}