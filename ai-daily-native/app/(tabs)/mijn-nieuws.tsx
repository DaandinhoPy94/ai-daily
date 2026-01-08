import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SearchModal } from '@/components/SearchModal';
import { useState } from 'react';
import { AccountMenu } from '@/components/AccountMenu';
import { GlassSearchButton, GlassAvatarButton } from '@/components/GlassHeaderButtons';

export default function MijnNieuwsScreen() {
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
          title: 'Mijn Nieuws',
          headerLargeTitleStyle: styles.largeTitleStyle,
          headerTitleStyle: styles.titleStyle,
          headerLeft: () => <GlassAvatarButton onPress={() => setShowMenu(true)} />,
          headerRight: () => <GlassSearchButton onPress={() => setShowSearch(true)} />,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
      >
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Je persoonlijke nieuwsfeed</Text>
          <Text style={styles.emptyText}>
            Volg onderwerpen om hier gepersonaliseerd nieuws te zien. Ga naar "Meer" → selecteer
            onderwerpen en tap "Volg".
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
    flexGrow: 1,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
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
