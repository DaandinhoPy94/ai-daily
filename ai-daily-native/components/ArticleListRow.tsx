import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getListThumb } from '@/src/lib/imagesBase';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
  media_asset_alt?: string;
}

interface ArticleListRowProps {
  article: Article;
  showDivider?: boolean;
}

export function ArticleListRow({ article, showDivider = true }: ArticleListRowProps) {
  const router = useRouter();
  const imageUrl = article.id ? getListThumb(article.id, 480) : article.media_asset_url;

  const handlePress = () => {
    router.push(`/artikel/${article.slug}` as any);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.container}
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
          {/* Meta */}
          <Text style={styles.meta}>
            {article.readTimeMinutes} min leestijd
            {article.topicName && ` · ${article.topicName}`}
          </Text>

          {/* Title */}
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 96,
  },
  imageContainer: {
    width: 120,
    height: 68,
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
    minWidth: 0,
  },
  meta: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 4,
    fontFamily: 'System',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
    marginLeft: 148, // 16px padding + 120px image + 12px gap
  },
});
