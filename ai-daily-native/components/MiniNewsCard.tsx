import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getStandardImage } from '@/src/lib/imagesBase';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
}

interface MiniNewsCardProps {
  article: Article;
}

export function MiniNewsCard({ article }: MiniNewsCardProps) {
  const router = useRouter();
  const imageUrl = article.id ? getStandardImage(article.id, 400) : article.media_asset_url;

  const handlePress = () => {
    router.push(`/artikel/${article.slug}` as any);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.container}
    >
      {/* Image */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Text Block */}
      <View style={styles.card}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    padding: 12,
  },
  meta: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 8,
    fontFamily: 'System',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
});
