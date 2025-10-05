import { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LargeNewsCard } from '@/components/LargeNewsCard';
import { ArticleListRow } from '@/components/ArticleListRow';
import { MobileStocksStrip } from '@/components/MobileStocksStrip';
import { SectionSpacer } from '@/components/SectionSpacer';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { AuthModal } from '@/components/AuthModal';
import { getMostRead, getLatest, getTopicSections } from '@/src/lib/supabase';
import { TopicBlock } from '@/components/TopicBlock';
import { useStocks } from '@/src/contexts/StockProvider';

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

export default function HomeScreen() {
  const { tickers } = useStocks();
  const [mostRead, setMostRead] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [topicHeading, setTopicHeading] = useState<string>('');
  const [topicCards, setTopicCards] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch data in parallel
      const [mostReadData, latestData, topicSections] = await Promise.all([
        getMostRead(2),
        getLatest(11),
        getTopicSections(),
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
        media_asset_alt: item.media_asset_alt,
      }));

      // Transform latest data and exclude articles already used in most read
      const usedIds = new Set(mostReadArticles.map((a) => a.id));
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
          media_asset_alt: item.media_asset_alt,
        }));

      setMostRead(mostReadArticles);
      setLatest(latestArticles);
      // First active topic section
      const firstSection = (topicSections || []).find((s: any) => s.is_active && s.articles && s.articles.length > 0);
      if (firstSection) {
        setTopicHeading(firstSection.heading);
        const mapped = firstSection.articles.slice(0, 4).map((a: any) => ({
          id: a.article_id,
          slug: a.slug || `artikel-${a.article_id}`,
          title: a.title,
          readTimeMinutes: a.read_time_minutes || 5,
          topicName: firstSection.topic_name,
          media_asset_url: a.media_asset_url,
          media_asset_alt: a.media_asset_alt,
        }));
        setTopicCards(mapped);
      } else {
        setTopicHeading('');
        setTopicCards([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Er ging iets mis bij het laden van de data.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-destructive text-center mb-4">{error}</Text>
          <Text className="text-muted-foreground text-center">
            Trek naar beneden om opnieuw te laden
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <AppHeader 
        onSearchPress={() => setShowSearch(true)}
      />

      {/* Stocks Strip */}
      <MobileStocksStrip tickers={tickers} />

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Two - Most Read */}
        <View className="px-4 pt-4">
          {mostRead.slice(0, 2).map((article) => (
            <LargeNewsCard key={article.id} article={article} />
          ))}
        </View>

        {/* Spacer */}
        <SectionSpacer />

        {/* Latest 9 - Compact List */}
        <View>
          {latest.map((article, index) => (
            <ArticleListRow
              key={article.id}
              article={article}
              showDivider={index < latest.length - 1}
            />
          ))}
        </View>

        {/* Spacer */}
        <SectionSpacer />

        {/* Topic Block */}
        {topicHeading && topicCards.length > 0 && (
          <TopicBlock heading={topicHeading} articles={topicCards} />
        )}

        {/* Bottom padding */}
        <View className="h-8" />
      </ScrollView>

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
