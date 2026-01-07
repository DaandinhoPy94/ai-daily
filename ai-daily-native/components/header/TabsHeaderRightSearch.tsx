import { useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { SearchModal } from '@/components/SearchModal';
import { GlassHeaderIconButton } from './GlassHeaderIconButton';

export function TabsHeaderRightSearch() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <GlassHeaderIconButton accessibilityLabel="Search" onPress={() => setShowSearch(true)}>
        <SymbolView
          name="magnifyingglass"
          type="hierarchical"
          weight="semibold"
          scale="medium"
          tintColor="#0a0a0a"
          style={{ width: 22, height: 22 }}
        />
      </GlassHeaderIconButton>

      <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}

