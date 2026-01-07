import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { SearchModal } from '@/components/SearchModal';
import { useState } from 'react';
import { Search } from 'lucide-react-native';
import { AccountMenu } from '@/components/AccountMenu';

// Native header button components
function HeaderRight({ onSearchPress }: { onSearchPress: () => void }) {
  return (
    <TouchableOpacity onPress={onSearchPress} style={styles.headerButton}>
      <Search size={22} color="#0a0a0a" strokeWidth={2} />
    </TouchableOpacity>
  );
}

function HeaderLeft({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>D</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function OpgeslagenScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
          title: 'Opgeslagen',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
          headerLeft: () => <HeaderLeft onPress={() => setShowMenu(true)} />,
          headerRight: () => <HeaderRight onSearchPress={() => setShowSearch(true)} />,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Geen opgeslagen artikelen</Text>
          <Text style={styles.emptyText}>
            Tap op het bookmark icoon in een artikel om het op te slaan voor later.
          </Text>
        </View>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
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