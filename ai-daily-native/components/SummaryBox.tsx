import { View, Text, StyleSheet } from 'react-native';

interface SummaryBoxProps {
  items: string[];
}

export function SummaryBox({ items }: SummaryBoxProps) {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IN HET KORT</Text>
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f4f4f5',
    borderLeftWidth: 4,
    borderLeftColor: '#E36B2C',
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a0a0a',
    marginBottom: 12,
    letterSpacing: 0.5,
    fontFamily: 'System',
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#E36B2C',
    fontWeight: '700',
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
});
