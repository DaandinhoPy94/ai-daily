import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  getMainTopics, 
  getSubTopics, 
  getFollowedTopics,
  followTopic,
  unfollowTopic 
} from '@/lib/supabase';
import { getDefaultSEO, buildCanonical } from '@/lib/seo';

interface Topic {
  id: string;
  slug: string;
  name: string;
  type: 'main' | 'sub';
  parent_slug: string | null;
  is_active: boolean;
  display_order: number;
}

interface TopicWithSubs extends Topic {
  subtopics: Topic[];
}

export default function TopicsOverview() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [viewType, setViewType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [mainTopics, setMainTopics] = useState<TopicWithSubs[]>([]);
  const [followedTopicIds, setFollowedTopicIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterMode, setFilterMode] = useState<'all' | 'following'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [pendingFollows, setPendingFollows] = useState<Set<string>>(new Set());

  // Responsive viewport detection  
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

  // Fetch topics and follow status
  useEffect(() => {
    async function fetchTopicsData() {
      try {
        setLoading(true);
        setError(null);

        // Get main topics
        const mainTopicsData = await getMainTopics();
        
        if (!mainTopicsData || mainTopicsData.length === 0) {
          setMainTopics([]);
          setLoading(false);
          return;
        }

        // Get subtopics for each main topic
        const topicsWithSubs: TopicWithSubs[] = await Promise.all(
          mainTopicsData.map(async (mainTopic: Topic) => {
            const subtopics = await getSubTopics(mainTopic.slug);
            return {
              ...mainTopic,
              subtopics: subtopics || []
            };
          })
        );

        setMainTopics(topicsWithSubs);

        // Get followed topics if user is authenticated
        if (user) {
          const followed = await getFollowedTopics(user.id);
          setFollowedTopicIds(followed);
        }

      } catch (err) {
        console.error('Error fetching topics data:', err);
        setError('Er ging iets mis bij het laden van de onderwerpen.');
      } finally {
        setLoading(false);
      }
    }

    fetchTopicsData();
  }, [user]);

  // Handle follow/unfollow
  const handleFollowToggle = async (topicId: string, isFollowing: boolean) => {
    if (!user) {
      toast({
        title: "Inloggen vereist",
        description: "Log in om onderwerpen te volgen.",
        variant: "destructive"
      });
      return;
    }

    // Optimistic UI update
    setPendingFollows(prev => new Set(prev).add(topicId));
    
    const newFollowedIds = isFollowing 
      ? followedTopicIds.filter(id => id !== topicId)
      : [...followedTopicIds, topicId];
    
    setFollowedTopicIds(newFollowedIds);

    try {
      const result = isFollowing 
        ? await unfollowTopic(topicId, user.id)
        : await followTopic(topicId, user.id);

      if (!result.success) {
        // Revert on error
        setFollowedTopicIds(followedTopicIds);
        toast({
          title: "Fout",
          description: "Er ging iets mis bij het wijzigen van uw voorkeur.",
          variant: "destructive"
        });
      }
    } catch (err) {
      // Revert on error
      setFollowedTopicIds(followedTopicIds);
      toast({
        title: "Fout", 
        description: "Er ging iets mis bij het wijzigen van uw voorkeur.",
        variant: "destructive"
      });
    } finally {
      setPendingFollows(prev => {
        const newSet = new Set(prev);
        newSet.delete(topicId);
        return newSet;
      });
    }
  };

  // Filter and search logic
  const filteredTopics = useMemo(() => {
    return mainTopics.map(mainTopic => {
      // Filter subtopics based on mode and search
      let subtopics = mainTopic.subtopics;

      // Filter by following status
      if (filterMode === 'following') {
        subtopics = subtopics.filter(sub => followedTopicIds.includes(sub.id));
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        subtopics = subtopics.filter(sub => 
          sub.name.toLowerCase().includes(query) ||
          mainTopic.name.toLowerCase().includes(query)
        );
        
        // Also check if main topic matches search
        const mainMatches = mainTopic.name.toLowerCase().includes(query);
        if (!mainMatches && subtopics.length === 0) {
          return null; // Don't show this section
        }
      }

      return {
        ...mainTopic,
        subtopics
      };
    }).filter(Boolean) as TopicWithSubs[];
  }, [mainTopics, followedTopicIds, filterMode, searchQuery]);

  const defaults = getDefaultSEO();
  const canonical = buildCanonical('/topic');

  const pageContent = (
    <>
      <Helmet>
        <html lang="nl" />
        <title>Alle AI onderwerpen - {defaults.siteName}</title>
        <meta name="description" content="Ontdek alle AI onderwerpen en categorieën. Volg de onderwerpen die jou interesseren en blijf op de hoogte van het laatste nieuws." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Alle AI onderwerpen" />
        <meta property="og:description" content="Ontdek alle AI onderwerpen en categorieën. Volg de onderwerpen die jou interesseren." />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Alle AI onderwerpen" />
        <meta name="twitter:description" content="Ontdek alle AI onderwerpen en categorieën. Volg de onderwerpen die jou interesseren." />
      </Helmet>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl py-8">
        {/* Control Block - Sticky */}
        <div className="sticky top-0 z-30 bg-background border-b border-border pb-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filterMode === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterMode('all')}
                aria-label="Toon alle onderwerpen"
              >
                Alle onderwerpen
              </Button>
              <Button
                variant={filterMode === 'following' ? 'default' : 'outline'}
                onClick={() => setFilterMode('following')}
                aria-label="Toon gevolgde onderwerpen"
              >
                Volgend
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek naar onderwerpen, organisatie"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Zoek onderwerpen"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        )}

        {/* Topics Content */}
        {!loading && (filteredTopics.length === 0 ? (
          // Empty State
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Geen onderwerpen gevonden</h3>
              <p className="text-muted-foreground mb-4">
                {filterMode === 'following' 
                  ? 'U volgt nog geen onderwerpen, of uw zoekopdracht leverde geen resultaten op.'
                  : 'Uw zoekopdracht leverde geen resultaten op.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterMode('all');
                    setSearchQuery('');
                  }}
                >
                  Toon alle onderwerpen
                </Button>
                <Button asChild>
                  <Link to="/">Terug naar homepage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Topics Grid
          <div className="space-y-8">
            {filteredTopics.map((mainTopic) => (
              <Card key={mainTopic.id}>
                <CardHeader>
                  <h2 className="text-2xl font-semibold leading-none tracking-tight">
                    <Link 
                      to={`/topic/${mainTopic.slug}`}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {mainTopic.name}
                    </Link>
                  </h2>
                </CardHeader>
                
                <CardContent>
                  {mainTopic.subtopics.length > 0 ? (
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {mainTopic.subtopics.map((subtopic) => {
                        const isFollowing = followedTopicIds.includes(subtopic.id);
                        const isPending = pendingFollows.has(subtopic.id);
                        
                        return (
                          <div key={subtopic.id} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors">
                            <Link
                              to={`/topic/${subtopic.slug}`}
                              className="flex-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {subtopic.name}
                            </Link>
                            
                            <Button
                              size="sm"
                              variant={isFollowing ? "default" : "outline"}
                              onClick={() => handleFollowToggle(subtopic.id, isFollowing)}
                              disabled={isPending}
                              className="ml-3 flex-shrink-0"
                              aria-label={isFollowing ? `Stop met volgen: ${subtopic.name}` : `Volg: ${subtopic.name}`}
                            >
                              {isPending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                              ) : isFollowing ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Volgend
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Volg
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Geen subcategorieën gevonden voor dit onderwerp.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </main>
    </>
  );

  // Mobile & Tablet: Use MobileHeader + BottomTabBar
  if (viewType === 'mobile' || viewType === 'tablet') {
    return (
      <>
        <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom))' }}>
          <MobileHeader />
          {pageContent}
        </div>
        <BottomTabBar viewType={viewType} />
      </>
    );
  }

  // Desktop: Use regular Header + Footer
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {pageContent}
      <Footer />
    </div>
  );
}