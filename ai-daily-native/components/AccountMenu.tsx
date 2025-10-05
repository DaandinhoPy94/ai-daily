import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Heart, LogOut, Bookmark, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface AccountMenuProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string;
  displayName?: string;
}

export function AccountMenu({ visible, onClose, userEmail, displayName }: AccountMenuProps) {
  const router = useRouter();
  const initials = displayName
    ?.split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || userEmail?.slice(0, 2).toUpperCase() || 'D';

  const handleNavigation = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 300);
  };

  const handleSignOut = () => {
    onClose();
    Alert.alert(
      'Uitloggen',
      'Weet je zeker dat je wilt uitloggen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        { 
          text: 'Uitloggen', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement sign out with Supabase
            Alert.alert('Uitgelogd', 'Je bent succesvol uitgelogd');
          }
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      transparent={true}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          {/* Header with Close */}
          <View style={styles.header}>
            <View style={styles.placeholder} />
            <TouchableOpacity 
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color="#0a0a0a" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.displayName}>{displayName || 'Daan van der Ster'}</Text>
            <Text style={styles.email}>{userEmail || 'daanvdster@gmail.com'}</Text>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleNavigation('/(tabs)/profile')}
              activeOpacity={0.7}
            >
              <User size={20} color="#0a0a0a" strokeWidth={2} />
              <Text style={styles.menuText}>Profiel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                onClose();
                setTimeout(() => router.replace('/(tabs)/mijn-nieuws'), 300);
              }}
              activeOpacity={0.7}
            >
              <Heart size={20} color="#0a0a0a" strokeWidth={2} />
              <Text style={styles.menuText}>Mijn nieuws</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleNavigation('/(tabs)/opgeslagen')}
              activeOpacity={0.7}
            >
              <Bookmark size={20} color="#0a0a0a" strokeWidth={2} />
              <Text style={styles.menuText}>Bookmarks</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleNavigation('/(tabs)/preferences')}
              activeOpacity={0.7}
            >
              <Settings size={20} color="#0a0a0a" strokeWidth={2} />
              <Text style={styles.menuText}>Voorkeuren</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#0a0a0a" strokeWidth={2} />
              <Text style={styles.menuText}>Uitloggen</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  placeholder: {
    width: 36,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    marginBottom: 4,
    fontFamily: 'System',
  },
  email: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
  },
  menuContainer: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  separator: {
    height: 1,
    backgroundColor: '#e4e4e7',
    marginVertical: 8,
  },
});
