import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, User, Bookmark, Settings } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { getMainTopics, supabase } from '@/src/lib/supabase';
import { SymbolView } from 'expo-symbols';
import { BlurView } from 'expo-blur';
import type { Session } from '@supabase/supabase-js';

interface Topic {
  id: string;
  name: string;
  slug: string;
}

export default function MeerScreen() {
  const router = useRouter();
  const [mainTopics, setMainTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topics = await getMainTopics();
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

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userEmail = session?.user?.email;
  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'G';

  return (
    <>
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
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Account Section */}
        <View style={styles.accountSection}>
          <TouchableOpacity
            style={styles.accountCard}
            onPress={session ? undefined : handleLoginPress}
            activeOpacity={session ? 1 : 0.7}
          >
            <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.accountCardBlur}>
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                {session ? (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{userInitial}</Text>
                  </View>
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    {Platform.OS === 'ios' ? (
                      <SymbolView
                        name="person.crop.circle"
                        style={styles.avatarIcon}
                        type="hierarchical"
                        tintColor="#a1a1aa"
                      />
                    ) : (
                      <User size={32} color="#a1a1aa" strokeWidth={1.5} />
                    )}
                  </View>
                )}
              </View>

              {/* Account Info */}
              <View style={styles.accountInfo}>
                {session ? (
                  <>
                    <Text style={styles.accountName}>{userEmail}</Text>
                    <Text style={styles.accountStatus}>Ingelogd</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.accountName}>Inloggen / Registreren</Text>
                    <Text style={styles.accountStatus}>Log in om artikelen te bewaren</Text>
                  </>
                )}
              </View>

              {/* Chevron */}
              {!session && (
                <ChevronRight size={20} color="#71717a" strokeWidth={2} />
              )}
            </BlurView>
          </TouchableOpacity>

          {/* Quick Actions when logged in */}
          {session && (
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/(tabs)/opgeslagen')}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionIcon}>
                  {Platform.OS === 'ios' ? (
                    <SymbolView
                      name="bookmark.fill"
                      style={styles.quickActionSymbol}
                      type="hierarchical"
                      tintColor="#E36B2C"
                    />
                  ) : (
                    <Bookmark size={20} color="#E36B2C" strokeWidth={2} fill="#E36B2C" />
                  )}
                </View>
                <Text style={styles.quickActionText}>Opgeslagen</Text>
                <ChevronRight size={16} color="#a1a1aa" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => router.push('/(tabs)/preferences')}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionIcon}>
                  {Platform.OS === 'ios' ? (
                    <SymbolView
                      name="gearshape.fill"
                      style={styles.quickActionSymbol}
                      type="hierarchical"
                      tintColor="#71717a"
                    />
                  ) : (
                    <Settings size={20} color="#71717a" strokeWidth={2} />
                  )}
                </View>
                <Text style={styles.quickActionText}>Instellingen</Text>
                <ChevronRight size={16} color="#a1a1aa" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.quickAction, styles.quickActionLast]}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.quickActionIcon}>
                  {Platform.OS === 'ios' ? (
                    <SymbolView
                      name="rectangle.portrait.and.arrow.right"
                      style={styles.quickActionSymbol}
                      type="hierarchical"
                      tintColor="#dc2626"
                    />
                  ) : (
                    <User size={20} color="#dc2626" strokeWidth={2} />
                  )}
                </View>
                <Text style={[styles.quickActionText, { color: '#dc2626' }]}>Uitloggen</Text>
                <ChevronRight size={16} color="#a1a1aa" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}
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
  accountSection: {
    padding: 16,
    paddingBottom: 8,
  },
  accountCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  accountCardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    width: 32,
    height: 32,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 2,
  },
  accountStatus: {
    fontSize: 14,
    color: '#71717a',
  },
  quickActions: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e4e4e7',
  },
  quickActionLast: {
    borderBottomWidth: 0,
  },
  quickActionIcon: {
    width: 28,
    marginRight: 12,
  },
  quickActionSymbol: {
    width: 20,
    height: 20,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    color: '#0a0a0a',
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