import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MiniNewsCard } from './MiniNewsCard';

interface Article {
  id: string;
  slug: string;
  title: string;
  readTimeMinutes: number;
  topicName?: string;
  media_asset_url?: string;
}

interface TopicBlockProps {
  heading: string;
  articles: Article[];
  showAllLink?: boolean;
}

export function TopicBlock({ heading, articles, showAllLink = true }: TopicBlockProps) {
  return (
    <View style={styles.container}>
      {/* Heading Row */}
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{heading}</Text>
        {showAllLink && (
          <TouchableOpacity>
            <Text style={styles.allLink}>Alles</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2x2 Grid */}
      <View style={styles.grid}>
        {articles.slice(0, 4).map((article, index) => (
          <View key={article.id} style={[styles.gridItem, index % 2 === 0 && styles.gridItemLeft]}>
            <MiniNewsCard article={article} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  allLink: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  gridItemLeft: {
    marginRight: 'auto',
  },
});
