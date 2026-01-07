import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNativeTabBarHeight } from '@/src/lib/nativeTabs';
import { AppHeader } from '@/components/AppHeader';
import { SearchModal } from '@/components/SearchModal';
import { Upload } from 'lucide-react-native';
import { useState } from 'react';

export default function ProfileScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [displayName, setDisplayName] = useState('Daan van der Ster');
  const [email] = useState('daanvdster@gmail.com');
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const tabBarHeight = useNativeTabBarHeight();

  const initials = displayName
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'DV';

  const handleSave = () => {
    // TODO: Implement save functionality with Supabase
    console.log('Saving profile...', { displayName, newsletterEnabled });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']} style={{ paddingBottom: tabBarHeight }}>
      <StatusBar style="auto" />
      
      <AppHeader onSearchPress={() => setShowSearch(true)} />

      <View style={styles.pageTitleContainer}>
        <Text style={styles.pageTitle}>Profiel</Text>
        <Text style={styles.subtitle}>Beheer je profielinformatie en voorkeuren.</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: tabBarHeight }]}
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

      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'Georgia',
    color: '#0a0a0a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
    fontFamily: 'System',
  },
  cardDescription: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 20,
    fontFamily: 'System',
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
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
  uploadHint: {
    fontSize: 12,
    color: '#71717a',
    fontFamily: 'System',
  },
  newsletterSection: {
    alignItems: 'center',
  },
  newsletterLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#0a0a0a',
    fontFamily: 'System',
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
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
  inputDisabled: {
    backgroundColor: '#f4f4f5',
    color: '#71717a',
  },
  inputHint: {
    fontSize: 12,
    color: '#71717a',
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
});
