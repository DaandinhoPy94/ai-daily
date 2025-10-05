import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Search } from 'lucide-react-native';
import { useState } from 'react';
import { AccountMenu } from './AccountMenu';

interface AppHeaderProps {
  onSearchPress?: () => void;
  showAccountMenu?: boolean;
}

export function AppHeader({ onSearchPress, showAccountMenu = true }: AppHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.headerTitle}>AI Dagelijks</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Search size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Menu Modal */}
      {showAccountMenu && (
        <AccountMenu
          visible={showMenu}
          onClose={() => setShowMenu(false)}
          userEmail="daanvdster@gmail.com"
          displayName="Daan van der Ster"
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  headerLeft: {
    width: 36,
  },
  headerRight: {
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
    fontFamily: 'Georgia',
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8b7355',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
});
