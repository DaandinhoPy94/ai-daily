import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { useState } from 'react';

export default function OpgeslagenScreen() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      <AppHeader onSearchPress={() => setShowSearch(true)} />

      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Opgeslagen Artikelen</Text>
        <View style={styles.divider} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Geen opgeslagen artikelen</Text>
          <Text style={styles.emptyText}>
            Tap op het bookmark icoon in een artikel om het op te slaan voor later.
          </Text>
        </View>
      </ScrollView>

      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'Georgia',
    color: '#0a0a0a',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
