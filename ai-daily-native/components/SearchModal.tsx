import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import { X, Search } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SearchModal({ visible, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation when modal becomes visible
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  // Reset query when modal closes
  useEffect(() => {
    if (!visible) {
      setQuery('');
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setQuery('');
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        {/* Full-screen Liquid Glass blur background */}
        <BlurView intensity={90} tint="systemChromeMaterialLight" style={StyleSheet.absoluteFill} />

        {/* Content with proper safe area padding */}
        <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
          {/* Search Header */}
          <View style={styles.header}>
            {/* Search Icon */}
            <View style={styles.searchIcon}>
              {Platform.OS === 'ios' ? (
                <SymbolView
                  name="magnifyingglass"
                  style={styles.sfSymbol}
                  type="hierarchical"
                  tintColor="#71717a"
                />
              ) : (
                <Search size={20} color="#71717a" strokeWidth={2} />
              )}
            </View>

            {/* Search Input */}
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Zoeken..."
              placeholderTextColor="#71717a"
              style={styles.input}
              autoFocus
              returnKeyType="search"
              clearButtonMode="while-editing"
            />

            {/* Close Button with Glass effect */}
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <BlurView intensity={60} tint="systemChromeMaterialLight" style={styles.closeButtonGlass}>
                {Platform.OS === 'ios' ? (
                  <SymbolView
                    name="xmark"
                    style={styles.sfSymbolClose}
                    type="hierarchical"
                    tintColor="#1a1a1a"
                  />
                ) : (
                  <X size={18} color="#1a1a1a" strokeWidth={2.5} />
                )}
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.placeholder}>
              {query.trim() ? 'Zoekresultaten worden getoond...' : 'Begin met typen om te zoeken...'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sfSymbol: {
    width: 20,
    height: 20,
  },
  sfSymbolClose: {
    width: 16,
    height: 16,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#0a0a0a',
    fontFamily: 'System',
    paddingVertical: 0,
  },
  closeButton: {
    marginLeft: 4,
  },
  closeButtonGlass: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // No extra background/border - let BlurView provide the glass effect
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 4,
  },
  placeholder: {
    fontSize: 15,
    color: '#71717a',
    fontFamily: 'System',
    textAlign: 'center',
  },
});
