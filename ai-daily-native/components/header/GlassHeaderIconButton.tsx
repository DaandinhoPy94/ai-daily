import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet } from 'react-native';

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
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 44,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.45)',
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.6,
  },
});
