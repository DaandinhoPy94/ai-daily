import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { LargeNewsCard } from '../components/LargeNewsCard';
import { StocksBar } from '../components/StocksBar';
import { RightRail } from '../components/RightRail';
import { TopicSection } from '../components/TopicSection';
import { getHomepageSlots, getTopicSections, getLatest, getMostRead } from '../lib/supabase';
import { NewsArticle, RightRailItem, TopicSection as TopicSectionType } from '../types';
import { getDefaultSEO, buildCanonical } from '../lib/seo';
import { useStocks } from '../contexts/StockProvider';

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