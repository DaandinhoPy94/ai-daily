import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SearchModal({ visible, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Reset query when modal closes
  useEffect(() => {
    if (!visible) {
      setQuery('');
    }
  }, [visible]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Zoeken..."
              placeholderTextColor="#71717a"
              style={styles.input}
              autoFocus
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity 
            onPress={handleClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <X size={24} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.placeholder}>
            {query.trim() ? 'Zoekresultaten worden getoond...' : 'Begin met typen om te zoeken...'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    gap: 12,
  },
  searchBar: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#0a0a0a',
    fontFamily: 'System',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#71717a',
    fontFamily: 'System',
  },
});
