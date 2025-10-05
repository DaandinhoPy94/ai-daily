import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Search, ChevronRight, X } from 'lucide-react-native';
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.iconButton}>
            <User size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerTitle}>AI Dagelijks</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

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
        {/* Menu Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.slug} style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item.name}</Text>
              <ChevronRight size={20} color="#71717a" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Topics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Onderwerpen</Text>
          
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  headerLeft: {
    width: 36,
  },
  headerRight: {
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
    fontFamily: 'Georgia',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
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
  section: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontFamily: 'System',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0a0a0a',
    fontFamily: 'System',
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
