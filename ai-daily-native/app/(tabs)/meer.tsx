import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, Search } from 'lucide-react-native';
import { SearchModal } from '@/components/SearchModal';
import { useState, useEffect } from 'react';
import { getMainTopics } from '@/src/lib/supabase';
import { AccountMenu } from '@/components/AccountMenu';
import { GlassSearchButton, GlassAvatarButton } from '@/components/GlassHeaderButtons';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

export default function MeerScreen() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mainTopics, setMainTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleTopicPress = (topic: Topic) => {
    router.push(`/topic/${topic.slug}` as any);
  };

  return (
    <>
      {/* Native header with GPU-accelerated Liquid Glass blur */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: 'systemMaterial',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          title: 'Meer',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
          headerLeft: () => <GlassAvatarButton onPress={() => setShowMenu(true)} />,
          headerRight: () => <GlassSearchButton onPress={() => setShowSearch(true)} />,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => setShowSearch(true)}
            activeOpacity={0.7}
          >
            <Search size={20} color="#71717a" strokeWidth={2} />
            <Text style={styles.searchPlaceholder}>Zoek in artikelen...</Text>
          </TouchableOpacity>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Onderwerpen</Text>
        </View>

        {/* Render all topics with navigation */}
        {mainTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicItem}
            onPress={() => handleTopicPress(topic)}
            activeOpacity={0.7}
          >
            <Text style={styles.topicText}>{topic.name}</Text>
            <ChevronRight size={20} color="#71717a" strokeWidth={2} />
          </TouchableOpacity>
        ))}

        {/* Show if empty */}
        {mainTopics.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Geen onderwerpen gevonden</Text>
          </View>
        )}

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Laden...</Text>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
      <AccountMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userEmail="daanvdster@gmail.com"
        displayName="Daan van der Ster"
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#71717a',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e4e4e7',
  },
  topicText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0a0a0a',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717a',
    fontSize: 15,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: '#71717a',
    fontSize: 15,
  },
  largeTitleStyle: {
    fontFamily: 'Georgia',
    fontWeight: '700',
    color: '#0a0a0a',
  },
  titleStyle: {
    fontFamily: 'Georgia',
    fontWeight: '600',
    color: '#0a0a0a',
  },
});
