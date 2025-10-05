import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ArticleMetaProps {
  publishedAt: string;
  readTimeMinutes: number;
}

export function ArticleMeta({ publishedAt, readTimeMinutes }: ArticleMetaProps) {
  const formattedDate = format(new Date(publishedAt), 'd MMMM yyyy · HH:mm', { locale: nl });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formattedDate}</Text>
      <Text style={styles.readTime}>{readTimeMinutes} min leestijd</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  date: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
    marginBottom: 4,
  },
  readTime: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
  },
});
