import { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArticleMeta } from '@/components/ArticleMeta';
import { SummaryBox } from '@/components/SummaryBox';
import { RelatedTopicsNative } from '@/components/RelatedTopicsNative';
import { RelatedListNative } from '@/components/RelatedListNative';
import { supabase } from '@/src/lib/supabase';
import { getHeroImage } from '@/src/lib/imagesBase';
import { Share2, Bookmark, ChevronLeft } from 'lucide-react-native';

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

// Header button components
function HeaderLeft() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
      <ChevronLeft size={28} color="#0a0a0a" strokeWidth={2} />
    </TouchableOpacity>
  );
}

function HeaderRight({ articleTitle }: { articleTitle?: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: articleTitle || 'Check dit artikel op AI Dagelijks',
        title: articleTitle,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity onPress={() => setIsBookmarked(!isBookmarked)} style={styles.headerButton}>
        <Bookmark
          size={22}
          color={isBookmarked ? '#E36B2C' : '#0a0a0a'}
          fill={isBookmarked ? '#E36B2C' : 'none'}
          strokeWidth={2}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
        <Share2 size={22} color="#0a0a0a" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[ArticleDetail] Fetching article with slug:', slug);

      // Fetch article with topics
      const { data: articleData, error: articleError } = await supabase
        .from('articles_with_topics')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      console.log('[ArticleDetail] Article data:', articleData ? 'found' : 'null');
      console.log('[ArticleDetail] Article error:', articleError);

      if (articleError) {
        console.error('[ArticleDetail] Supabase error:', articleError);
        setError('Kon artikel niet laden');
        return;
      }

      if (!articleData) {
        console.log('[ArticleDetail] No article found for slug:', slug);
        setError('Artikel niet gevonden');
        return;
      }

      // Parse topics if needed
      let parsedTopics: Array<{ id: string; name: string; slug: string }> = [];
      if (articleData.topics) {
        if (Array.isArray(articleData.topics)) {
          parsedTopics = articleData.topics;
        } else if (typeof articleData.topics === 'string') {
          try {
            parsedTopics = JSON.parse(articleData.topics);
          } catch (e) {
            console.log('[ArticleDetail] Could not parse topics:', e);
          }
        }
      }

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
          setRelatedArticles(
            related.map((r: any) => ({
              ...r,
              readTimeMinutes: r.read_time_minutes,
              topicName: articleData.primary_topic_name,
            }))
          );
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
        topics: parsedTopics,
      });
    } catch (err) {
      console.error('[ArticleDetail] Exception:', err);
      setError('Er ging iets mis bij het laden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Native header with GPU-accelerated Liquid Glass blur */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
          headerTitle: '',
          headerShadowVisible: false,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight articleTitle={article?.title} />,
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E36B2C" />
          <Text style={styles.loadingText}>Artikel laden...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Probeer het later opnieuw</Text>
        </View>
      ) : article ? (
        <ScrollView
          style={styles.scrollView}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
        >
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
            <SummaryBox items={article.summary.split('. ').filter((s) => s.trim())} />
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
          {relatedArticles.length > 0 && <RelatedListNative articles={relatedArticles} />}

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#71717a',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fafafa',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#71717a',
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
  headerButton: {
    padding: 8,
  },
  headerRightContainer: {
    flexDirection: 'row',
    gap: 4,
  },
});
