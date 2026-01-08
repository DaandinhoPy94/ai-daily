import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';

export default function MijnNieuwsScreen() {
  const tabBarHeight = useNativeTabBarHeight();
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <ScrollView
        style={styles.content}
        contentInsetAdjustmentBehavior="never"
        scrollIndicatorInsets={{ top: headerHeight }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: tabBarHeight, flexGrow: 1 }}
      >
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Mijn Nieuws</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.contentContainer}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Je persoonlijke nieuwsfeed</Text>
          <Text style={styles.emptyText}>
            Volg onderwerpen om hier gepersonaliseerd nieuws te zien. Ga naar "Meer" → selecteer onderwerpen en tap "Volg".
          </Text>
        </View>
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
    textAlign: 'center',
    fontFamily: 'System',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
