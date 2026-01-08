import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';
import { ChevronRight, X, Search } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { getMainTopics } from '@/src/lib/supabase';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

export default function MeerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTopics, setMainTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const tabBarHeight = useNativeTabBarHeight();
  const headerHeight = useHeaderHeight();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        console.log('Loading topics...');
        const topics = await getMainTopics();
        console.log('Topics loaded:', topics?.length || 0, 'items');
        setMainTopics(topics || []);
      } catch (err) {
        console.error('Error loading topics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  console.log('=== RENDER ===');
  console.log('Loading:', loading);
  console.log('Topics length:', mainTopics.length);
  console.log('First topic:', mainTopics[0]?.name);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      {/* Content */}
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: headerHeight }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: tabBarHeight }}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#71717a" strokeWidth={2} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Zoek in artikelen..."
              placeholderTextColor="#71717a"
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#71717a" strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Debug info */}
        <View style={{ padding: 16, backgroundColor: '#fef3c7' }}>
          <Text>Loading: {loading ? 'YES' : 'NO'}</Text>
          <Text>Topics: {mainTopics.length}</Text>
        </View>

        {/* Alle onderwerpen */}
        <TouchableOpacity style={styles.topicItem}>
          <Text style={styles.topicText}>Alle onderwerpen</Text>
          <ChevronRight size={20} color="#71717a" strokeWidth={2} />
        </TouchableOpacity>

        {/* Simply render all topics */}
        {mainTopics.map((topic, index) => (
          <TouchableOpacity key={topic.id} style={styles.topicItem}>
            <Text style={styles.topicText}>
              {index + 1}. {topic.name}
            </Text>
            <ChevronRight size={20} color="#71717a" strokeWidth={2} />
          </TouchableOpacity>
        ))}

        {/* Show if empty */}
        {mainTopics.length === 0 && !loading && (
          <View style={{ padding: 16 }}>
            <Text style={{ color: 'red' }}>Geen topics!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  topicText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0a0a0a',
    fontFamily: 'System',
  },
});
