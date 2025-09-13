import { useState, useEffect } from 'react';
import { MobileHeader } from '../components/MobileHeader';
import { LargeNewsCard } from '../components/LargeNewsCard';
import { ArticleListRow } from '../components/ArticleListRow';
import { TopicBlock } from '../components/TopicBlock';
import { BottomTabBar } from '../components/BottomTabBar';
import { SectionSpacer } from '../components/SectionSpacer';
import { Skeleton } from '../components/ui/skeleton';
import { getMostRead, getLatest, getTopicSections } from '../lib/supabase';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface MobileIndexProps {
  isWrappedInAppShell?: boolean;
}

export default function MobileIndex({ isWrappedInAppShell = false }: MobileIndexProps) {
  const [mostRead, setMostRead] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [topicHeading, setTopicHeading] = useState('');
  const [topicCards, setTopicCards] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [mostReadData, latestData, topicSectionsData] = await Promise.all([
          getMostRead(2),
          getLatest(11), // Get 11 to exclude 2 used in mostRead
          getTopicSections()
        ]);

        // Transform most read data
        const mostReadArticles: Article[] = (mostReadData || []).map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          readTimeMinutes: item.read_time_minutes || 5,
          topicName: item.topic_name,
          media_asset_url: item.media_asset_url,
          media_asset_alt: item.media_asset_alt
        }));

        // Transform latest data and exclude articles already used in most read
        const usedIds = new Set(mostReadArticles.map(a => a.id));
        const latestArticles: Article[] = (latestData || [])
          .filter((item: any) => !usedIds.has(item.id))
          .slice(0, 9)
          .map((item: any) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            readTimeMinutes: item.read_time_minutes || 5,
            topicName: item.topic_name,
            media_asset_url: item.media_asset_url,
            media_asset_alt: item.media_asset_alt
          }));

        // Get first active topic section
        const firstSection = (topicSectionsData || []).find((section: any) => 
          section.is_active && section.articles && section.articles.length > 0
        );

        let topicArticles: Article[] = [];
        let heading = '';

        if (firstSection) {
          heading = firstSection.heading;
          topicArticles = firstSection.articles.slice(0, 4).map((article: any) => ({
            id: article.article_id,
            slug: article.slug || `artikel-${article.article_id}`,
            title: article.title,
            readTimeMinutes: article.read_time_minutes || 5,
            topicName: firstSection.topic_name,
            media_asset_url: article.media_asset_url,
            media_asset_alt: article.media_asset_alt
          }));
        }

        setMostRead(mostReadArticles);
        setLatest(latestArticles);
        setTopicHeading(heading);
        setTopicCards(topicArticles);

      } catch (err) {
        console.error('Error fetching mobile homepage data:', err);
        setError('Er ging iets mis bij het laden van de data.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        {!isWrappedInAppShell && <MobileHeader />}
        <div className="bg-stocks-bg border-y border-border h-12" />
        
        <main className="pb-20">
          {/* Top Two Skeletons */}
          <div className="px-4 pt-4 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>

          <SectionSpacer />

          {/* Latest List Skeletons */}
          <div>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-3 px-4 min-h-[96px]">
                <Skeleton className="w-[72px] h-[72px] rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </main>

        {!isWrappedInAppShell && <BottomTabBar viewType="mobile" />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="text-center px-4">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      {!isWrappedInAppShell && <MobileHeader />}

      <main className="pb-20">
        {/* Top Two - Most Read */}
        <div className="px-4 pt-4 space-y-4">
          {mostRead.slice(0, 2).map((article) => (
            <LargeNewsCard
              key={article.id}
              article={article}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="mt-4 mb-4">
          <SectionSpacer />
        </div>

        {/* Latest 9 - Compact List */}
        <div>
          {latest.map((article, index) => (
            <ArticleListRow
              key={article.id}
              article={article}
              showDivider={index < latest.length - 1}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="mt-4 mb-4">
          <SectionSpacer />
        </div>

        {/* Topic Block */}
        {topicHeading && topicCards.length > 0 && (
          <TopicBlock
            heading={topicHeading}
            articles={topicCards}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {!isWrappedInAppShell && <BottomTabBar viewType="mobile" />}
    </div>
  );
}