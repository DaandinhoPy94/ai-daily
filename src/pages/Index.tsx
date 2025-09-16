import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { LargeNewsCard } from '../components/LargeNewsCard';
import { StocksBar } from '../components/StocksBar';
import { RightRail } from '../components/RightRail';
import { TopicSection } from '../components/TopicSection';
import { NewsPaperCard } from '../components/NewsPaperCard';
import { JobCard } from '../components/JobCard';
import { getHomepageSlots, getTopicSections, getLatest, getMostRead } from '../lib/supabase';
import { NewsArticle, RightRailItem, TopicSection as TopicSectionType } from '../types';
import { getDefaultSEO, buildCanonical } from '../lib/seo';
import { useStocks } from '../contexts/StockProvider';
import { supabase } from '../integrations/supabase/client';

interface HomepageSlot {
  article_id: string;
  slug: string;
  title: string;
  summary: string;
  read_time_minutes: number;
  published_at: string;
  code: string;
  name: string;
  display_order: number;
  item_order: number;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface DayArticle {
  id: string;
  slug: string;
  title: string;
  published_at: string;
}

// Categories for Dagoverzicht section
const DAY_OVERVIEW_CATEGORIES = [
  {"slug":"onderzoek-ontwikkeling","name":"Onderzoek & Ontwikkeling","display_order":10},
  {"slug":"technologie-modellen","name":"Technologie & Modellen","display_order":20},
  {"slug":"toepassingen","name":"Toepassingen","display_order":30},
  {"slug":"bedrijven-markt","name":"Bedrijven & Markt","display_order":40},
  {"slug":"geografie-politiek","name":"Geografie & Politiek","display_order":50},
  {"slug":"veiligheid-regelgeving","name":"Veiligheid & Regelgeving","display_order":60},
  {"slug":"economie-werk","name":"Economie & Werk","display_order":70},
  {"slug":"cultuur-samenleving","name":"Cultuur & Samenleving","display_order":80}
];

// Helper function to get day ranges for Europe/Amsterdam timezone
function getDayRange(offsetDays: number): { start: Date; end: Date } {
  const now = new Date();
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + offsetDays);
  
  // Create start of day in Europe/Amsterdam timezone
  const start = new Date(targetDate.toLocaleString("en-US", {timeZone: "Europe/Amsterdam"}));
  start.setHours(0, 0, 0, 0);
  
  // Create end of day in Europe/Amsterdam timezone
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

// CategoryDayList component
function CategoryDayList({ categorySlug, categoryName }: { categorySlug: string; categoryName: string }) {
  const [todayArticles, setTodayArticles] = useState<DayArticle[]>([]);
  const [yesterdayArticles, setYesterdayArticles] = useState<DayArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCategoryArticles() {
      try {
        setLoading(true);
        setError(false);

        const today = getDayRange(0);
        const yesterday = getDayRange(-1);

        // Fetch articles for today and yesterday in parallel
        const [todayData, yesterdayData] = await Promise.all([
          supabase
            .from('articles')
            .select(`
              id,
              slug,
              title,
              published_at,
              article_topics!inner(topic_id),
              topics!inner(slug)
            `)
            .eq('status', 'published')
            .eq('topics.slug', categorySlug)
            .gte('published_at', today.start.toISOString())
            .lte('published_at', today.end.toISOString())
            .order('published_at', { ascending: false }),
          
          supabase
            .from('articles')
            .select(`
              id,
              slug,
              title,
              published_at,
              article_topics!inner(topic_id),
              topics!inner(slug)
            `)
            .eq('status', 'published')
            .eq('topics.slug', categorySlug)
            .gte('published_at', yesterday.start.toISOString())
            .lte('published_at', yesterday.end.toISOString())
            .order('published_at', { ascending: false })
        ]);

        setTodayArticles(todayData.data || []);
        setYesterdayArticles(yesterdayData.data || []);
      } catch (err) {
        console.error(`Error fetching articles for ${categorySlug}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryArticles();
  }, [categorySlug]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Amsterdam'
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
          {categoryName}
        </h3>
        {/* Skeleton for today */}
        {[1, 2, 3].map((i) => (
          <div key={`today-${i}`} className="flex gap-3">
            <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
            <div className="flex-1 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
        {/* Skeleton divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <div className="w-16 h-3 bg-muted rounded animate-pulse"></div>
          <div className="flex-1 h-px bg-border"></div>
        </div>
        {/* Skeleton for yesterday */}
        {[1, 2].map((i) => (
          <div key={`yesterday-${i}`} className="flex gap-3">
            <div className="w-12 h-4 bg-muted rounded animate-pulse"></div>
            <div className="flex-1 h-4 bg-muted rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
          {categoryName}
        </h3>
        <p className="text-sm text-muted-foreground">Kon artikelen niet laden</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
        {categoryName}
      </h3>
      
      {/* Today's articles */}
      {todayArticles.length > 0 && (
        <div className="space-y-2">
          {todayArticles.map((article) => (
            <div key={article.id} className="flex gap-3 text-sm group">
              <span className="text-muted-foreground font-mono text-xs mt-0.5 w-12 flex-shrink-0">
                {formatTime(article.published_at)}
              </span>
              <Link
                to={`/artikel/${article.slug}`}
                className="flex-1 text-foreground hover:text-primary transition-colors line-clamp-2 group-hover:underline"
              >
                {article.title}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      {(todayArticles.length > 0 || yesterdayArticles.length > 0) && (
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide px-2">
            Gisteren
          </span>
          <div className="flex-1 h-px bg-border"></div>
        </div>
      )}

      {/* Yesterday's articles */}
      {yesterdayArticles.length > 0 && (
        <div className="space-y-2">
          {yesterdayArticles.map((article) => (
            <div key={article.id} className="flex gap-3 text-sm group">
              <span className="text-muted-foreground font-mono text-xs mt-0.5 w-12 flex-shrink-0">
                {formatTime(article.published_at)}
              </span>
              <Link
                to={`/artikel/${article.slug}`}
                className="flex-1 text-foreground hover:text-primary transition-colors line-clamp-2 group-hover:underline"
              >
                {article.title}
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {todayArticles.length === 0 && yesterdayArticles.length === 0 && (
        <p className="text-sm text-muted-foreground">Nog geen artikelen.</p>
      )}
    </div>
  );
}

export default function Index() {
  const [homepageSlots, setHomepageSlots] = useState<HomepageSlot[]>([]);
  const [topicSections, setTopicSections] = useState<any[]>([]);
  const [netBinnenItems, setNetBinnenItems] = useState<RightRailItem[]>([]);
  const [meestGelezenItems, setMeestGelezenItems] = useState<RightRailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tickers } = useStocks();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [slotsData, sectionsData, latestData, mostReadData] = await Promise.all([
          getHomepageSlots(),
          getTopicSections(),
          getLatest(20),
          getMostRead(20)
        ]);

        console.log('Homepage slots data:', slotsData);
        setHomepageSlots(slotsData || []);
        setTopicSections(sectionsData || []);
        
        // Transform latest data to RightRailItem format
        const latestItems: RightRailItem[] = (latestData || []).map((item: any) => ({
          time: new Date(item.published_at).toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          title: item.title,
          url: `/artikel/${item.slug}`,
          category: item.topic_name
        }));

        // Transform most read data to RightRailItem format  
        const mostReadItems: RightRailItem[] = (mostReadData || []).map((item: any) => ({
          time: new Date(item.published_at).toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          title: item.title,
          url: `/artikel/${item.slug}`,
          category: item.topic_name
        }));

        setNetBinnenItems(latestItems);
        setMeestGelezenItems(mostReadItems);
        
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Er ging iets mis bij het laden van de data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Helper function to convert homepage slot to NewsArticle
  const slotToNewsArticle = (slot: HomepageSlot): NewsArticle & { subtitle?: string; image_large?: string; image_standard?: string } => ({
    id: slot.article_id,
    slug: slot.slug,
    title: slot.title,
    summary: slot.summary,
    subtitle: slot.summary, // Using summary as subtitle for now
    readTimeMinutes: slot.read_time_minutes,
    category: slot.name, // Use the slot name as category
    imageUrl: slot.media_asset_url || 'placeholder',
    image_large: slot.media_asset_url || 'placeholder',
    image_standard: slot.media_asset_url || 'placeholder'
  });

  // Helper function to convert homepage slot for LargeNewsCard
  const slotToLargeNewsCard = (slot: HomepageSlot) => {
    const article = {
      id: slot.article_id,
      slug: slot.slug,
      title: slot.title,
      summary: slot.summary,
      subtitle: slot.summary, // Using summary as subtitle for now
      readTimeMinutes: slot.read_time_minutes,
      category: slot.name, // Use the slot name as category
      media_asset_url: slot.media_asset_url,
      media_asset_alt: slot.media_asset_alt
    };
    
    // Log to verify media_asset_url is filled
    console.log('Index.tsx - slotToLargeNewsCard article:', article);
    console.log('Index.tsx - media_asset_url check:', slot.media_asset_url);
    
    return article;
  };

  // Group homepage slots by code
  const heroSlots = homepageSlots.filter(slot => slot.code === 'hero').sort((a, b) => a.item_order - b.item_order);
  const row2Slots = homepageSlots.filter(slot => slot.code === 'row2').sort((a, b) => a.item_order - b.item_order);
  const row3Slots = homepageSlots.filter(slot => slot.code === 'row3').sort((a, b) => a.item_order - b.item_order);
  const row4Slots = homepageSlots.filter(slot => slot.code === 'row4').sort((a, b) => a.item_order - b.item_order);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <StocksBar tickers={tickers} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Laden...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <StocksBar tickers={tickers} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Probeer opnieuw
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const defaults = getDefaultSEO();
  const canonical = buildCanonical('/');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="nl" />
        <title>{defaults.defaultTitle}</title>
        <meta name="description" content={defaults.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={defaults.defaultTitle} />
        <meta property="og:description" content={defaults.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content={defaults.siteName} />
        <meta property="og:image" content={defaults.defaultImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={defaults.defaultTitle} />
        <meta name="twitter:description" content={defaults.description} />
        <meta name="twitter:image" content={defaults.defaultImage} />
      </Helmet>
      <Header />
        <StocksBar tickers={tickers} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Hero Section */}
        <section className="news-grid lg:min-h-[460px] mb-8">
          {/* Hero Left */}
          <div className="hero-left h-full">
            {heroSlots[0] && (
              <div className="h-full">
                <LargeNewsCard
                  article={slotToLargeNewsCard(heroSlots[0])}
                />
              </div>
            )}
          </div>

          {/* Hero Middle */}
          <div className="hero-middle h-full">
            {heroSlots[1] && (
              <div className="h-full">
                <LargeNewsCard
                  article={slotToLargeNewsCard(heroSlots[1])}
                />
              </div>
            )}
          </div>

          {/* Hero Right - Right Rail */}
          <div className="hero-right h-full">
            <RightRail 
              netBinnenItems={netBinnenItems}
              meestGelezenItems={meestGelezenItems}
            />
          </div>
        </section>

        {/* Second Row - 3 columns */}
        {row2Slots.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {row2Slots.slice(0, 3).map((slot) => (
              <NewsCard
                key={slot.article_id}
                article={slotToNewsArticle(slot)}
                variant="standard"
              />
            ))}
          </section>
        )}

        {/* Third Row - 3 columns */}
        {row3Slots.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {row3Slots.slice(0, 3).map((slot) => (
              <NewsCard
                key={slot.article_id}
                article={slotToNewsArticle(slot)}
                variant="standard"
              />
            ))}
          </section>
        )}

        {/* Fourth Row - 3 columns */}
        {row4Slots.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {row4Slots.slice(0, 3).map((slot) => (
              <NewsCard
                key={slot.article_id}
                article={slotToNewsArticle(slot)}
                variant="standard"
              />
            ))}
          </section>
        )}

        {/* Newsletter Section */}
        <section className="space-y-6 mb-8">
          {/* Section Divider */}
          <hr className="border-border" />
          
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif uppercase tracking-wide text-foreground">
              Nieuwsbrief
            </h2>
            <Link 
              to="/nieuwsbrief" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>Alles weergeven</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TODO: Replace with actual newsletter data from Supabase newsletters table */}
            {[
              {
                id: '1',
                title: 'Wekelijkse AI Update',
                description: 'De belangrijkste ontwikkelingen in AI van afgelopen week samengevat.',
                imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop',
                publishedAt: new Date().toISOString(),
                readTimeMinutes: 5
              },
              {
                id: '2',
                title: 'Maandelijkse Marktanalyse',
                description: 'Diepgaande analyse van AI-investeringen en markttrends.',
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
                publishedAt: new Date().toISOString(),
                readTimeMinutes: 8
              },
              {
                id: '3',
                title: 'Research Highlights',
                description: 'Nieuwste doorbraken uit de academische AI-wereld.',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
                publishedAt: new Date().toISOString(),
                readTimeMinutes: 6
              }
            ].map((newsletter) => (
              <NewsPaperCard
                key={newsletter.id}
                newsletter={newsletter}
              />
            ))}
          </div>
        </section>

        {/* Jobs Section */}
        <section className="space-y-6 mb-8">
          {/* Section Divider */}
          <hr className="border-border" />
          
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif uppercase tracking-wide text-foreground">
              Banen
            </h2>
            <Link 
              to="/ai-jobs" 
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>Alles weergeven</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TODO: Replace with actual job data from Supabase job_listings table */}
            {[
              {
                id: '1',
                title: 'Senior AI Engineer',
                company: 'TechCorp Nederland',
                location: 'Amsterdam',
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=225&fit=crop',
                postedAt: new Date().toISOString(),
                salaryRange: '€80.000 - €120.000'
              },
              {
                id: '2',
                title: 'Machine Learning Specialist',
                company: 'DataFlow BV',
                location: 'Utrecht',
                imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
                postedAt: new Date().toISOString(),
                salaryRange: '€70.000 - €100.000'
              },
              {
                id: '3',
                title: 'AI Product Manager',
                company: 'Innovation Labs',
                location: 'Rotterdam',
                imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop',
                postedAt: new Date().toISOString(),
                salaryRange: '€90.000 - €130.000'
              }
            ].map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        </section>

        {/* Dagoverzicht Section */}
        <section className="space-y-6 mb-8">
          {/* Section Divider */}
          <hr className="border-border" />
          
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif uppercase tracking-wide text-foreground">
              Dagoverzicht
            </h2>
          </div>

          {/* 8 Category Grid - 4x2 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {DAY_OVERVIEW_CATEGORIES.map((category) => (
              <CategoryDayList
                key={category.slug}
                categorySlug={category.slug}
                categoryName={category.name}
              />
            ))}
          </div>
        </section>

        {/* Topic Sections */}
        {topicSections.map((section) => {
          // Group articles by topic section
          const sectionArticles = section.articles?.map((article: any) => ({
            id: article.article_id,
            slug: article.slug,
            title: article.title,
            summary: article.summary || '',
            readTimeMinutes: article.read_time_minutes || 5,
            category: section.topic_name,
            imageUrl: 'placeholder'
          })) || [];

          if (sectionArticles.length === 0) return null;

          return (
            <TopicSection
              key={section.section_id}
              section={{
                heading: section.heading,
                articles: sectionArticles
              }}
            />
          );
        })}
      </main>

      <Footer />
    </div>
  );
}