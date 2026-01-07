import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { useState } from 'react';

export default function PreferencesScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const tabBarHeight = useNativeTabBarHeight();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']} style={{ paddingBottom: tabBarHeight }}>
      <StatusBar style="auto" />
      
      <AppHeader onSearchPress={() => setShowSearch(true)} />

      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Voorkeuren</Text>
        <View style={styles.divider} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: tabBarHeight }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaties</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Email notificaties</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#e4e4e7', true: '#E36B2C' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Push notificaties</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#e4e4e7', true: '#E36B2C' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Meer voorkeuren komen binnenkort beschikbaar!
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 16,
    fontFamily: 'System',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  infoBox: {
    backgroundColor: '#f4f4f5',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
