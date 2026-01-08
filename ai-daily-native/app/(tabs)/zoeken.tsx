import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { Search, X } from 'lucide-react-native';
import { searchArticles } from '@/src/lib/supabase';
import { ArticleListRow } from '@/components/ArticleListRow';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

export default function ZoekenScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchArticles(query.trim());
        const articles: Article[] = (data || []).map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          readTimeMinutes: item.read_time_minutes || 5,
          topicName: item.topic_name,
          media_asset_url: item.media_asset_url,
          media_asset_alt: item.media_asset_alt,
        }));
        setResults(articles);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          title: 'Zoeken',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              {Platform.OS === 'ios' ? (
                <SymbolView
                  name="magnifyingglass"
                  style={styles.sfSymbol}
                  type="hierarchical"
                  tintColor="#71717a"
                />
              ) : (
                <Search size={20} color="#71717a" strokeWidth={2} />
              )}
            </View>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Zoek in artikelen..."
              placeholderTextColor="#71717a"
              style={styles.input}
              returnKeyType="search"
              clearButtonMode="never"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                {Platform.OS === 'ios' ? (
                  <SymbolView
                    name="xmark.circle.fill"
                    style={styles.sfSymbolClear}
                    type="hierarchical"
                    tintColor="#a1a1aa"
                  />
                ) : (
                  <X size={18} color="#a1a1aa" strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E36B2C" />
            <Text style={styles.loadingText}>Zoeken...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'resultaat' : 'resultaten'}
              </Text>
            </View>
            {results.map((article, index) => (
              <ArticleListRow
                key={article.id}
                article={article}
                showDivider={index < results.length - 1}
              />
            ))}
          </View>
        )}

        {/* No Results */}
        {!loading && hasSearched && results.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Geen resultaten</Text>
            <Text style={styles.emptyText}>
              Probeer andere zoektermen of controleer de spelling.
            </Text>
          </View>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              {Platform.OS === 'ios' ? (
                <SymbolView
                  name="magnifyingglass"
                  style={styles.emptyIconSymbol}
                  type="hierarchical"
                  tintColor="#d4d4d8"
                />
              ) : (
                <Search size={48} color="#d4d4d8" strokeWidth={1.5} />
              )}
            </View>
            <Text style={styles.emptyTitle}>Doorzoek AI Dagelijks</Text>
            <Text style={styles.emptyText}>
              Vind artikelen over AI, technologie en innovatie.
            </Text>
          </View>
        )}
      </ScrollView>
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
  searchContainer: {
    padding: 16,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sfSymbol: {
    width: 20,
    height: 20,
  },
  sfSymbolClear: {
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#0a0a0a',
    fontFamily: 'System',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  loadingText: {
    fontSize: 15,
    color: '#71717a',
    fontFamily: 'System',
  },
  resultsContainer: {
    backgroundColor: '#ffffff',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e4e4e7',
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    paddingTop: 64,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyIconSymbol: {
    width: 48,
    height: 48,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 22,
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