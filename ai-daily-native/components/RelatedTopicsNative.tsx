import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

interface RelatedTopicsProps {
  topics?: Topic[];
}

export function RelatedTopicsNative({ topics = [] }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <Text style={styles.title}>Gerelateerde onderwerpen</Text>
      
      <View style={styles.topicsContainer}>
        {topics.slice(0, 5).map((topic) => (
          <View key={topic.id} style={styles.topicRow}>
            <TouchableOpacity>
              <Text style={styles.topicName}>{topic.name}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.followButton} activeOpacity={0.7}>
              <Plus size={16} color="#ffffff" strokeWidth={2} />
              <Text style={styles.followText}>Volg</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  topicsContainer: {
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    gap: 16,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E36B2C',
    fontFamily: 'System',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E36B2C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
});
