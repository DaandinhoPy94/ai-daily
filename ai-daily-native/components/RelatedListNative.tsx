import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getListThumb } from '@/src/lib/imagesBase';

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  topicName?: string;
  readTimeMinutes?: number;
}

interface RelatedListProps {
  articles: RelatedArticle[];
}

export function RelatedListNative({ articles }: RelatedListProps) {
  const router = useRouter();

  if (!articles || articles.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.title}>Lees ook</Text>
      
      <View style={styles.list}>
        {articles.slice(0, 3).map((article, index) => {
          const imageUrl = article.id ? getListThumb(article.id, 480) : undefined;
          
          return (
            <View key={article.id}>
              <TouchableOpacity
                style={styles.articleRow}
                onPress={() => router.push(`/artikel/${article.slug}` as any)}
                activeOpacity={0.7}
              >
                {/* Thumbnail */}
                {imageUrl && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Content */}
                <View style={styles.content}>
                  <Text style={styles.meta}>
                    {article.readTimeMinutes || 3} min leestijd
                    {article.topicName && ` · ${article.topicName}`}
                  </Text>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                </View>
              </TouchableOpacity>

              {index < articles.length - 1 && <View style={styles.itemDivider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Georgia',
    color: '#0a0a0a',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  list: {
    backgroundColor: '#ffffff',
  },
  articleRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  imageContainer: {
    width: 128,
    height: 72,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 4,
    fontFamily: 'System',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#e4e4e7',
    marginLeft: 156,
  },
});
