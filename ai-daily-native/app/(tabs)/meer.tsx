import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, X, Search } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { useState, useEffect } from 'react';
import { getMainTopics } from '@/src/lib/supabase';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

export default function MeerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mainTopics, setMainTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const topics = await getMainTopics();
        setMainTopics(topics || []);
      } catch (error) {
        console.error('Error loading topics:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTopics();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <AppHeader 
        onSearchPress={() => setShowSearch(true)}
      />

      {/* Page Header with Title */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Meer</Text>
      </View>

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

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Topics List */}
        <View style={styles.topicsList}>
          {/* Alle onderwerpen */}
          <TouchableOpacity style={styles.topicItem}>
            <Text style={styles.topicText}>Alle onderwerpen</Text>
            <ChevronRight size={20} color="#71717a" strokeWidth={2} />
          </TouchableOpacity>

          {/* Loading state */}
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <View key={i} style={styles.topicItem}>
                  <View style={styles.skeletonText} />
                  <View style={styles.skeletonIcon} />
                </View>
              ))}
            </>
          ) : (
            /* Main Topics from database */
            mainTopics.map((topic) => (
              <TouchableOpacity key={topic.slug} style={styles.topicItem}>
                <Text style={styles.topicText}>{topic.name}</Text>
                <ChevronRight size={20} color="#71717a" strokeWidth={2} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    fontFamily: 'System',
  },
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
  topicsList: {
    paddingTop: 16,
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
  skeletonText: {
    width: 200,
    height: 20,
    backgroundColor: '#e4e4e7',
    borderRadius: 4,
  },
  skeletonIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#e4e4e7',
    borderRadius: 4,
  },
});
