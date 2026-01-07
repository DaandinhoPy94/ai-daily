import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { SearchModal } from '@/components/SearchModal';
import { Upload, Search } from 'lucide-react-native';
import { useState } from 'react';
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
      <View style={styles.headerAvatar}>
        <Text style={styles.headerAvatarText}>D</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState('Daan van der Ster');
  const [email] = useState('daanvdster@gmail.com');
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);

  const initials = displayName
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'DV';

  const handleSave = () => {
    console.log('Saving profile...', { displayName, newsletterEnabled });
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
          title: 'Profiel',
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
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profielinformatie</Text>
          <Text style={styles.cardDescription}>
            Deze informatie wordt gebruikt voor je profiel en kan openbaar zijn.
          </Text>

          {/* Avatar and Newsletter Section */}
          <View style={styles.topSection}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.avatarButtons}>
                <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7}>
                  <Upload size={16} color="#0a0a0a" strokeWidth={2} />
                  <Text style={styles.uploadButtonText}>Foto wijzigen</Text>
                </TouchableOpacity>
                <Text style={styles.uploadHint}>PNG, JPG tot 5MB</Text>
              </View>
            </View>

            <View style={styles.newsletterSection}>
              <Text style={styles.newsletterLabel}>Nieuwsbrief</Text>
              <Switch
                value={newsletterEnabled}
                onValueChange={setNewsletterEnabled}
                trackColor={{ false: '#e4e4e7', true: '#E36B2C' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Naam</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Je volledige naam"
                placeholderTextColor="#a1a1aa"
              />
            </View>

            <View style={[styles.inputGroup, { marginTop: 16 }]}>
              <Text style={styles.inputLabel}>E-mailadres</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                editable={false}
              />
              <Text style={styles.inputHint}>Je e-mailadres kan niet worden gewijzigd.</Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Profiel opslaan</Text>
            </TouchableOpacity>
          </View>
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
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 20,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
  },
  avatarButtons: {
    marginLeft: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#0a0a0a',
  },
  uploadHint: {
    fontSize: 12,
    color: '#71717a',
  },
  newsletterSection: {
    alignItems: 'center',
  },
  newsletterLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#0a0a0a',
  },
  formSection: {
    marginTop: 8,
  },
  inputGroup: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0a0a0a',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0a0a0a',
  },
  inputDisabled: {
    backgroundColor: '#f4f4f5',
    color: '#71717a',
  },
  inputHint: {
    fontSize: 12,
    color: '#71717a',
  },
  saveButton: {
    backgroundColor: '#E36B2C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerButton: {
    padding: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
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