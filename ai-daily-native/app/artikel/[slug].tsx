import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { ArticleHeader } from '@/components/ArticleHeader';
import { ArticleMeta } from '@/components/ArticleMeta';
import { SummaryBox } from '@/components/SummaryBox';
import { RelatedTopicsNative } from '@/components/RelatedTopicsNative';
import { RelatedListNative } from '@/components/RelatedListNative';
import { supabase } from '@/src/lib/supabase';
import { getHeroImage } from '@/src/lib/imagesBase';

interface Article {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  subtitle?: string;
  body?: string;
  readTimeMinutes: number;
  publishedAt: string;
  topics?: Array<{ id: string; name: string; slug: string }>;
}

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      // Fetch article with topics
      const { data: articleData, error: articleError } = await supabase
        .from('articles_with_topics')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (articleError || !articleData) throw articleError;

      // Fetch related articles (same topic)
      if (articleData.primary_topic_id) {
        const { data: related } = await supabase
          .from('articles')
          .select('id, slug, title, read_time_minutes')
          .eq('primary_topic_id', articleData.primary_topic_id)
          .eq('status', 'published')
          .neq('id', articleData.id)
          .order('published_at', { ascending: false })
          .limit(3);

        if (related) {
          setRelatedArticles(related.map((r: any) => ({
            ...r,
            readTimeMinutes: r.read_time_minutes,
            topicName: articleData.primary_topic_name,
          })));
        }
      }

      setArticle({
        id: articleData.id,
        slug: articleData.slug,
        title: articleData.title,
        summary: articleData.summary,
        subtitle: articleData.subtitle,
        body: articleData.body,
        readTimeMinutes: articleData.read_time_minutes || 5,
        publishedAt: articleData.published_at,
        topics: articleData.topics ? JSON.parse(articleData.topics) : [],
      });
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
      />

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E36B2C" />
        </View>
      ) : article ? (
        <ScrollView style={styles.content}>
          {/* Meta Info */}
          <ArticleMeta 
            publishedAt={article.publishedAt}
            readTimeMinutes={article.readTimeMinutes}
          />

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{article.title}</Text>
          </View>

          {/* Hero Image */}
          {article.id && (
            <View style={styles.heroContainer}>
              <Image
                source={{ uri: getHeroImage(article.id, 1200) }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Subtitle */}
          {article.subtitle && (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{article.subtitle}</Text>
            </View>
          )}

          {/* Summary Box - IN HET KORT */}
          {article.summary && (
            <SummaryBox items={article.summary.split('. ').filter(s => s.trim())} />
          )}

          {/* Body */}
          {article.body && (
            <View style={styles.bodyContainer}>
              <Text style={styles.body}>{article.body}</Text>
            </View>
          )}

          {/* Related Topics */}
          {article.topics && article.topics.length > 0 && (
            <RelatedTopicsNative topics={article.topics} />
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <RelatedListNative articles={relatedArticles} />
          )}

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Artikel niet gevonden</Text>
        </View>
      )}

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
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: '#0a0a0a',
    fontFamily: 'Georgia',
  },
  heroContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  subtitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: '#0a0a0a',
    fontFamily: 'Georgia',
  },
  bodyContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#0a0a0a',
    fontFamily: 'Georgia',
  },
});
