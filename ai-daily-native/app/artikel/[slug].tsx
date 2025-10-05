import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { ArticleHeader } from '@/components/ArticleHeader';
import { AuthModal } from '@/components/AuthModal';
import { supabase } from '@/src/lib/supabase';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  subtitle?: string;
  body?: string;
  readTimeMinutes: number;
  publishedAt: string;
}

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, summary, subtitle, body, read_time_minutes, published_at')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setArticle({
          id: data.id,
          slug: data.slug,
          title: data.title,
          summary: data.summary,
          subtitle: data.subtitle,
          body: data.body,
          readTimeMinutes: data.read_time_minutes || 5,
          publishedAt: data.published_at,
        });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header with Bookmark & Share */}
      <ArticleHeader 
        articleId={article?.id}
        articleTitle={article?.title}
        onProfilePress={() => setShowAuth(true)}
      />

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E36B2C" />
        </View>
      ) : article ? (
        <ScrollView style={styles.content}>
          <View style={styles.articleContainer}>
            {/* Meta */}
            <Text style={styles.meta}>
              {article.readTimeMinutes} min leestijd
            </Text>

            {/* Title */}
            <Text style={styles.title}>{article.title}</Text>

            {/* Subtitle */}
            {article.subtitle && (
              <Text style={styles.subtitle}>{article.subtitle}</Text>
            )}

            {/* Summary */}
            {article.summary && (
              <Text style={styles.summary}>{article.summary}</Text>
            )}

            {/* Body */}
            {article.body && (
              <Text style={styles.body}>{article.body}</Text>
            )}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Artikel niet gevonden</Text>
        </View>
      )}

      {/* Modals */}
      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#71717a',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  articleContainer: {
    padding: 16,
  },
  meta: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 12,
    fontFamily: 'System',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: '#0a0a0a',
    marginBottom: 12,
    fontFamily: 'Georgia',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: '#0a0a0a',
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  summary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#71717a',
    marginBottom: 16,
    fontFamily: 'System',
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
});
