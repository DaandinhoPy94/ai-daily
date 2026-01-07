import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Expo Router NativeTabs uses the native tab bar (iOS/Android).
 * There isn't a JS `useBottomTabBarHeight()` context like `@react-navigation/bottom-tabs`,
 * so we approximate the height from platform defaults + safe-area inset.
 *
 * This is used ONLY for adding bottom padding so scrollable content isn't permanently
 * obscured by the (floating, translucent) tab bar.
 */
export function useNativeTabBarHeight() {
  const insets = useSafeAreaInsets();

  // UIKit default tab bar height is 49pt. Floating style sits slightly above the bottom.
  const iosBase = 49;
  const iosFloatingOffset = 12;

  // Android bottom navigation is typically 56dp. Native tabs follow platform defaults.
  const androidBase = 56;

  if (Platform.OS === 'ios') {
    return iosBase + iosFloatingOffset + insets.bottom;
  }

  return androidBase + insets.bottom;
}

