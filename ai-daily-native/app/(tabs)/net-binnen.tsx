import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Search } from 'lucide-react-native';
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <User size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerTitle}>AI Dagelijks</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Title */}
      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Net binnen</Text>
        <View style={styles.divider} />
      </View>

      {/* Articles List */}
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
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  headerLeft: {
    width: 36,
  },
  headerRight: {
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
    fontFamily: 'Georgia',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
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
