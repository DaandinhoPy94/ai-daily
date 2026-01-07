import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SearchModal } from '@/components/SearchModal';
import { ArticleListRow } from '@/components/ArticleListRow';
import { supabase } from '@/src/lib/supabase';
import { Search } from 'lucide-react-native';
import { AccountMenu } from '@/components/AccountMenu';

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

// Native header button components
function HeaderRight({ onSearchPress }: { onSearchPress: () => void }) {
  return (
    <TouchableOpacity onPress={onSearchPress} style={styles.headerButton}>
      <Search size={22} color="#0a0a0a" strokeWidth={2} />
    </TouchableOpacity>
  );
}

function HeaderLeft({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>D</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NetBinnenScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
          title: 'Net binnen',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
          headerLeft: () => <HeaderLeft onPress={() => setShowMenu(true)} />,
          headerRight: () => <HeaderRight onSearchPress={() => setShowSearch(true)} />,
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
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
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.listContent}
          scrollEventThrottle={16}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
        />
      )}

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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