import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { AccountMenu } from '@/components/AccountMenu';
import { GlassHeaderIconButton } from './GlassHeaderIconButton';

export function TabsHeaderLeftAccount() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <GlassHeaderIconButton accessibilityLabel="Account" onPress={() => setShowMenu(true)}>
        <SymbolView
          // iOS-only SF Symbol; Android/Web will render the fallback (handled internally by expo-symbols)
          name="person.crop.circle"
          type="hierarchical"
          weight="semibold"
          scale="medium"
          tintColor="#0a0a0a"
          style={{ width: 22, height: 22 }}
        />
      </GlassHeaderIconButton>

      <AccountMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userEmail="daanvdster@gmail.com"
        displayName="Daan van der Ster"
      />
    </>
  );
}

