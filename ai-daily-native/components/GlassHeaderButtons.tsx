import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { Search, ChevronLeft, Share2, Bookmark, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

/**
 * Unified Glass Button - iOS 26 Liquid Glass style
 * Creates a single "carved glass" effect where the icon appears embedded in the glass
 */
interface GlassButtonProps {
  onPress: () => void;
  sfSymbol?: SFSymbol;
  LucideIcon?: LucideIcon;
  iconSize?: number;
  tintColor?: string;
  size?: 'small' | 'medium' | 'large';
}

export function GlassButton({
  onPress,
  sfSymbol,
  LucideIcon,
  iconSize = 18,
  tintColor = '#1a1a1a',
  size = 'medium',
}: GlassButtonProps) {
  const buttonSize = size === 'small' ? 32 : size === 'large' ? 44 : 36;
  const symbolSize = size === 'small' ? 16 : size === 'large' ? 24 : iconSize;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.glassButton, { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 }]}
    >
      <BlurView
        intensity={70}
        tint="systemChromeMaterialLight"
        style={[styles.glassContent, { borderRadius: buttonSize / 2 }]}
      >
        {Platform.OS === 'ios' && sfSymbol ? (
          <SymbolView
            name={sfSymbol}
            style={{ width: symbolSize, height: symbolSize }}
            type="hierarchical"
            tintColor={tintColor}
          />
        ) : LucideIcon ? (
          <LucideIcon size={symbolSize} color={tintColor} strokeWidth={2.2} />
        ) : null}
      </BlurView>
    </TouchableOpacity>
  );
}

// Preset buttons for common use cases

interface GlassSearchButtonProps {
  onPress: () => void;
}

export function GlassSearchButton({ onPress }: GlassSearchButtonProps) {
  return (
    <GlassButton
      onPress={onPress}
      sfSymbol="magnifyingglass"
      LucideIcon={Search}
      iconSize={18}
    />
  );
}

interface GlassBackButtonProps {
  onPress: () => void;
}

export function GlassBackButton({ onPress }: GlassBackButtonProps) {
  return (
    <GlassButton
      onPress={onPress}
      sfSymbol="chevron.left"
      LucideIcon={ChevronLeft}
      iconSize={20}
    />
  );
}

interface GlassShareButtonProps {
  onPress: () => void;
}

export function GlassShareButton({ onPress }: GlassShareButtonProps) {
  return (
    <GlassButton
      onPress={onPress}
      sfSymbol="square.and.arrow.up"
      LucideIcon={Share2}
      iconSize={18}
    />
  );
}

interface GlassBookmarkButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

export function GlassBookmarkButton({ onPress, isActive = false }: GlassBookmarkButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.glassButton, { width: 36, height: 36, borderRadius: 18 }]}
    >
      <BlurView
        intensity={70}
        tint="systemChromeMaterialLight"
        style={[styles.glassContent, { borderRadius: 18 }]}
      >
        {Platform.OS === 'ios' ? (
          <SymbolView
            name={isActive ? 'bookmark.fill' : 'bookmark'}
            style={{ width: 18, height: 18 }}
            type="hierarchical"
            tintColor={isActive ? '#E36B2C' : '#1a1a1a'}
          />
        ) : (
          <Bookmark
            size={18}
            color={isActive ? '#E36B2C' : '#1a1a1a'}
            fill={isActive ? '#E36B2C' : 'none'}
            strokeWidth={2.2}
          />
        )}
      </BlurView>
    </TouchableOpacity>
  );
}

interface GlassLoginButtonProps {
  onPress: () => void;
}

export function GlassLoginButton({ onPress }: GlassLoginButtonProps) {
  return (
    <GlassButton
      onPress={onPress}
      sfSymbol="person.crop.circle"
      LucideIcon={User}
      iconSize={20}
    />
  );
}

interface GlassAvatarButtonProps {
  onPress: () => void;
  initials?: string;
}

export function GlassAvatarButton({ onPress, initials = 'D' }: GlassAvatarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.avatarButton}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glassButton: {
    overflow: 'hidden',
  },
  glassContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // No extra background/border - let BlurView do the work
  },
  avatarButton: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
