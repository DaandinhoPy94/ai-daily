import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { Share2, Bookmark } from 'lucide-react-native';
import { useState } from 'react';
import { AccountMenu } from './AccountMenu';

interface ArticleHeaderProps {
  articleId?: string;
  articleTitle?: string;
}

export function ArticleHeader({ articleId, articleTitle }: ArticleHeaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: articleTitle || 'Check dit artikel op AI Dagelijks',
        title: articleTitle,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality with Supabase
    setIsBookmarked(!isBookmarked);
  };

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
            onPress={handleBookmark}
            activeOpacity={0.7}
          >
            <Bookmark 
              size={20} 
              color={isBookmarked ? '#E36B2C' : '#0a0a0a'} 
              fill={isBookmarked ? '#E36B2C' : 'none'}
              strokeWidth={2} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={20} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Menu Modal */}
      <AccountMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        userEmail="daanvdster@gmail.com"
        displayName="Daan van der Ster"
      />
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
    width: 72,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 4,
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
    backgroundColor: '#E36B2C',
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
