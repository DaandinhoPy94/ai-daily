import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AuthModal({ visible, onClose }: AuthModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Inloggen</Text>
          <TouchableOpacity 
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <X size={24} color="#0a0a0a" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.message}>
            Authenticatie wordt binnenkort toegevoegd aan de native app.
          </Text>
          <Text style={styles.subMessage}>
            Je kunt al wel inloggen via de web versie!
          </Text>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    color: '#0a0a0a',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  subMessage: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
