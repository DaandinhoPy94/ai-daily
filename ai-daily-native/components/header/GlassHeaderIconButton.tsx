import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type Props = PropsWithChildren<{
  onPress?: () => void;
  accessibilityLabel: string;
}>;

export function GlassHeaderIconButton({ onPress, accessibilityLabel, children }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.inner}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  pressed: {
    opacity: 0.6,
  },
  inner: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
