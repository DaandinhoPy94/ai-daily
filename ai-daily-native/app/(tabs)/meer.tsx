import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, X, Search } from 'lucide-react-native';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { AuthModal } from '@/components/AuthModal';
import { useState } from 'react';

const menuItems = [
  { name: 'Over Ons', slug: 'over-ons' },
  { name: 'Nieuwsbrief', slug: 'nieuwsbrief' },
  { name: 'AI Cursussen', slug: 'ai-cursussen' },
  { name: 'AI Jobs', slug: 'ai-jobs' },
  { name: 'RSS Feeds', slug: 'rss-feeds' },
];

const mainTopics = [
  { name: 'Onderzoek & Ontwikkeling', slug: 'onderzoek-ontwikkeling' },
  { name: 'Technologie & Modellen', slug: 'technologie-modellen' },
  { name: 'Toepassingen', slug: 'toepassingen' },
  { name: 'Bedrijven & Markt', slug: 'bedrijven-markt' },
  { name: 'Geografie & Politiek', slug: 'geografie-politiek' },
  { name: 'Veiligheid & Regelgeving', slug: 'veiligheid-regelgeving' },
  { name: 'Economie & Werk', slug: 'economie-werk' },
  { name: 'Cultuur & Samenleving', slug: 'cultuur-samenleving' }
];

export default function MeerScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <AppHeader 
        onSearchPress={() => setShowSearch(true)}
        onProfilePress={() => setShowAuth(true)}
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

          {/* Main Topics */}
          {mainTopics.map((topic) => (
            <TouchableOpacity key={topic.slug} style={styles.topicItem}>
              <Text style={styles.topicText}>{topic.name}</Text>
              <ChevronRight size={20} color="#71717a" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
      <AuthModal visible={showAuth} onClose={() => setShowAuth(false)} />
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
});
