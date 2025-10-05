import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { useState } from 'react';

export default function ProfileScreen() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <StatusBar style="auto" />
      
      <AppHeader onSearchPress={() => setShowSearch(true)} />

      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Profiel</Text>
        <View style={styles.divider} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Naam</Text>
          <Text style={styles.value}>Daan van der Ster</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>daanvdster@gmail.com</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Profiel bewerking komt binnenkort beschikbaar in de app!
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717a',
    marginBottom: 8,
    fontFamily: 'System',
  },
  value: {
    fontSize: 16,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  infoBox: {
    backgroundColor: '#f4f4f5',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
