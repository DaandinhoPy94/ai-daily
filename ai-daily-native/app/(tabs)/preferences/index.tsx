import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';
import { useState } from 'react';

export default function PreferencesScreen() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const tabBarHeight = useNativeTabBarHeight();
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: headerHeight }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: tabBarHeight }}
      >
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Voorkeuren</Text>
          <View style={styles.divider} />
        </View>

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
