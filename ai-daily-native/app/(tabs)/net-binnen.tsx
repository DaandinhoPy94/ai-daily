import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';
import { ArticleListRow } from '@/components/ArticleListRow';
import { supabase } from '@/src/lib/supabase';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

const ARTICLES_PER_PAGE = 20;

export default function NetBinnenScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const tabBarHeight = useNativeTabBarHeight();
  const headerHeight = useHeaderHeight();

  const fetchArticles = async (offset: number = 0) => {
    try {
      if (offset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, read_time_minutes, hero_image_id, media_assets!articles_hero_image_id_fkey(path)')
        .eq('status', 'published')
        .lte('published_at', nowIso)
        .order('published_at', { ascending: false })
        .range(offset, offset + ARTICLES_PER_PAGE - 1);

      if (error) throw error;

      const formatted: Article[] = (data || []).map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        readTimeMinutes: item.read_time_minutes || 5,
        media_asset_url: item.media_assets?.path,
      }));

      if (offset === 0) {
        setArticles(formatted);
      } else {
        setArticles(prev => [...prev, ...formatted]);
      }

      setHasMore(formatted.length === ARTICLES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchArticles(articles.length);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#E36B2C" />
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <StatusBar style="auto" />

      {/* Articles List */}
      {loading ? (
        <View style={[styles.loadingContainer, { paddingTop: headerHeight }]}>
          <ActivityIndicator size="large" color="#E36B2C" />
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item, index }) => (
            <ArticleListRow
              article={item}
              showDivider={index < articles.length - 1}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentInsetAdjustmentBehavior="never"
          scrollIndicatorInsets={{ top: headerHeight }}
          ListHeaderComponent={
            <View style={[styles.pageTitleContainer, { paddingTop: headerHeight + 16 }]}>
              <Text style={styles.pageTitle}>Net binnen</Text>
              <View style={styles.divider} />
            </View>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight }]}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'Georgia',
    color: '#0a0a0a',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e4e4e7',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
