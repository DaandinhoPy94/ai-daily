import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LargeNewsCard } from '@/components/LargeNewsCard';
import { ArticleListRow } from '@/components/ArticleListRow';
import { AnimatedStocksTicker } from '@/components/AnimatedStocksTicker';
import { SectionSpacer } from '@/components/SectionSpacer';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SearchModal } from '@/components/SearchModal';
import { getMostRead, getLatest, getTopicSections } from '@/src/lib/supabase';
import { TopicBlock } from '@/components/TopicBlock';
import { useStocks } from '@/src/contexts/StockProvider';
import { AccountMenu } from '@/components/AccountMenu';
import { GlassSearchButton, GlassLoginButton } from '@/components/GlassHeaderButtons';

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
  const router = useRouter();
  const { tickers } = useStocks();
  const [mostRead, setMostRead] = useState<Article[]>([]);
  const [latest, setLatest] = useState<Article[]>([]);
  const [topicHeading, setTopicHeading] = useState<string>('');
  const [topicCards, setTopicCards] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const fetchData = async () => {
    try {
      const [mostReadData, latestData, topicSections] = await Promise.all([
        getMostRead(2),
        getLatest(11),
        getTopicSections(),
      ]);

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

      const firstSection = (topicSections || []).find(
        (s: any) => s.is_active && s.articles && s.articles.length > 0
      );
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

  // Common header options for all states
  const headerOptions = {
    headerShown: true,
    headerTransparent: true,
    headerBlurEffect: 'systemMaterial' as const,
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerShadowVisible: false,
    title: 'AI Dagelijks',
    headerLargeTitleStyle: styles.largeTitleStyle,
    headerTitleStyle: styles.titleStyle,
    headerLeft: () => <GlassLoginButton onPress={handleLoginPress} />,
    headerRight: () => <GlassSearchButton onPress={() => setShowSearch(true)} />,
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={headerOptions} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Trek naar beneden om opnieuw te laden</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {/* Native header with GPU-accelerated Liquid Glass blur */}
      <Stack.Screen options={headerOptions} />

      {/* Edge-to-edge ScrollView - content scrolls behind native header */}
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E36B2C" />
        }
      >
        <AnimatedStocksTicker tickers={tickers} />

        <View style={styles.mostReadSection}>
          {mostRead.slice(0, 2).map((article) => (
            <LargeNewsCard key={article.id} article={article} />
          ))}
        </View>

        <SectionSpacer />

        <View>
          {latest.map((article, index) => (
            <ArticleListRow
              key={article.id}
              article={article}
              showDivider={index < latest.length - 1}
            />
          ))}
        </View>

        <SectionSpacer />

        {topicHeading && topicCards.length > 0 && (
          <TopicBlock heading={topicHeading} articles={topicCards} />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
      <AccountMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userEmail="daanvdster@gmail.com"
        displayName="Daan van der Ster"
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mostReadSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bottomPadding: {
    height: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  errorHint: {
    color: '#71717a',
    textAlign: 'center',
    fontSize: 14,
  },
  largeTitleStyle: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: '#0a0a0a',
  },
  titleStyle: {
    fontFamily: 'Georgia',
    fontWeight: '600',
    color: '#0a0a0a',
  },
});
