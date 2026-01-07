import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
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

export default function PreferencesScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

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
          title: 'Voorkeuren',
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
    paddingBottom: 100,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 16,
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