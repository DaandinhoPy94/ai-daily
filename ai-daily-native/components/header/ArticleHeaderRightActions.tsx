import { useMemo, useState } from 'react';
import { Share, View, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { GlassHeaderIconButton } from './GlassHeaderIconButton';

type Props = {
  articleTitle?: string | null;
};

export function ArticleHeaderRightActions({ articleTitle }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const shareMessage = useMemo(
    () => articleTitle || 'Check dit artikel op AI Dagelijks',
    [articleTitle]
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: shareMessage,
        title: articleTitle ?? undefined,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <GlassHeaderIconButton
        accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        onPress={() => setIsBookmarked((v) => !v)}
      >
        <SymbolView
          name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
          type="hierarchical"
          weight="semibold"
          scale="medium"
          tintColor={isBookmarked ? '#E36B2C' : '#0a0a0a'}
          style={{ width: 22, height: 22 }}
        />
      </GlassHeaderIconButton>

      <GlassHeaderIconButton accessibilityLabel="Share" onPress={handleShare}>
        <SymbolView
          name="square.and.arrow.up"
          type="hierarchical"
          weight="semibold"
          scale="medium"
          tintColor="#0a0a0a"
          style={{ width: 22, height: 22 }}
        />
      </GlassHeaderIconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});

