import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User, Search } from 'lucide-react-native';
import { useState } from 'react';

interface AppHeaderProps {
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export function AppHeader({ onSearchPress, onProfilePress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <User size={20} color="#0a0a0a" strokeWidth={2} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.headerTitle}>AI Dagelijks</Text>
      
      <View style={styles.headerRight}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Search size={20} color="#0a0a0a" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
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
    width: 36,
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
});
