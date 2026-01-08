import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArticleListRow } from '@/components/ArticleListRow';
import { supabase } from '@/src/lib/supabase';
import { ChevronLeft, Search } from 'lucide-react-native';
import { SearchModal } from '@/components/SearchModal';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
}

const ARTICLES_PER_PAGE = 20;

// Header button components
function HeaderLeft() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
      <ChevronLeft size={28} color="#0a0a0a" strokeWidth={2} />
    </TouchableOpacity>
  );
}

function HeaderRight({ onSearchPress }: { onSearchPress: () => void }) {
  return (
    <TouchableOpacity onPress={onSearchPress} style={styles.headerButton}>
      <Search size={22} color="#0a0a0a" strokeWidth={2} />
    </TouchableOpacity>
  );
}

export default function TopicScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchTopic();
    }
  }, [slug]);

  const fetchTopic = async () => {
    try {
      setLoading(true);

      // Fetch topic info
      const { data: topicData, error: topicError } = await supabase
        .from('topics')
        .select('id, name, slug')
        .eq('slug', slug)
        .maybeSingle();

      if (topicError || !topicData) {
        console.error('Topic not found:', topicError);
        return;
      }

      setTopic(topicData);

      // Fetch articles for this topic
      await fetchArticles(topicData.id, 0);
    } catch (error) {
      console.error('Error fetching topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (topicId: string, offset: number) => {
    try {
      if (offset > 0) {
        setLoadingMore(true);
      }

      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, read_time_minutes, hero_image_id')
        .eq('primary_topic_id', topicId)
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
        topicName: topic?.name,
      }));

      if (offset === 0) {
        setArticles(formatted);
      } else {
        setArticles((prev) => [...prev, ...formatted]);
      }

      setHasMore(formatted.length === ARTICLES_PER_PAGE);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && topic) {
      fetchArticles(topic.id, articles.length);
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
    <>
      {/* Native header with GPU-accelerated Liquid Glass blur */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          title: topic?.name || 'Onderwerp',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight onSearchPress={() => setShowSearch(true)} />,
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E36B2C" />
        </View>
      ) : articles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Geen artikelen gevonden</Text>
          <Text style={styles.emptyText}>
            Er zijn nog geen artikelen in dit onderwerp.
          </Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={({ item, index }) => (
            <ArticleListRow article={item} showDivider={index < articles.length - 1} />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
        />
      )}

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fafafa',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
  listContent: {
    backgroundColor: '#ffffff',
    paddingBottom: 100,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
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
