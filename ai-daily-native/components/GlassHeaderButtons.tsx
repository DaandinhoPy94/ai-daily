import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Search, User } from 'lucide-react-native';

interface GlassSearchButtonProps {
  onPress: () => void;
}

interface GlassAvatarButtonProps {
  onPress: () => void;
  initials?: string;
}

/**
 * Liquid Glass styled search button for native headers
 * Uses BlurView for the iOS 26 glass effect
 */
export function GlassSearchButton({ onPress }: GlassSearchButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.buttonContainer}>
      <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.glassCircle}>
        <Search size={18} color="#0a0a0a" strokeWidth={2.5} />
      </BlurView>
    </TouchableOpacity>
  );
}

/**
 * Liquid Glass styled avatar/login button for native headers
 * Shows user initials with glass background
 */
export function GlassAvatarButton({ onPress, initials = 'D' }: GlassAvatarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.buttonContainer}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 4,
  },
  glassCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E36B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
