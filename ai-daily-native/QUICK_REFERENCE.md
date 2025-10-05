# ⚡ Quick Reference - React Native Cheatsheet

## 🚀 Start Commands

```bash
npm start          # Start dev server + QR code
npm run ios        # Open iOS simulator
npm run android    # Open Android emulator
npm run web        # Test in browser
```

## 📱 Component Mapping

| Web HTML | React Native | Import |
|----------|--------------|--------|
| `<div>` | `<View>` | `react-native` |
| `<span>`, `<p>`, `<h1>` | `<Text>` | `react-native` |
| `<button>` | `<TouchableOpacity>` | `react-native` |
| `<img>` | `<Image>` | `react-native` |
| `<input>` | `<TextInput>` | `react-native` |
| `<ul>`, `<ol>` | `<FlatList>` | `react-native` |
| scrollable `<div>` | `<ScrollView>` | `react-native` |
| - | `<SafeAreaView>` | `react-native` |

## 🎯 Event Handlers

| Web | React Native |
|-----|--------------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` (TextInput) |
| `onSubmit` | `onSubmitEditing` |
| `onScroll` | `onScroll` (same) |

## 🧭 Navigatie

### Web (react-router-dom)
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

navigate('/artikel/123');        // Ga naar
navigate('/artikel/123', { replace: true }); // Replace
navigate(-1);                    // Terug
```

### Native (expo-router)
```tsx
import { useRouter } from 'expo-router';
const router = useRouter();

router.push('/artikel/123');     // Ga naar
router.replace('/artikel/123');  // Replace
router.back();                   // Terug
```

## 🎨 Styling

### Tailwind (NativeWind) - Werkt hetzelfde!
```tsx
<View className="flex-1 bg-background px-4 py-2">
  <Text className="text-2xl font-bold text-foreground">
    Titel
  </Text>
</View>
```

### Inline Styles
```tsx
<View style={{ flex: 1, padding: 16 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
    Titel
  </Text>
</View>
```

### StyleSheet (performance)
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
});

<View style={styles.container}>
  <Text style={styles.title}>Titel</Text>
</View>
```

## 🖼️ Images

### Static Image
```tsx
const logo = require('./logo.png');
<Image source={logo} style={{ width: 100, height: 100 }} />
```

### Remote Image
```tsx
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
  resizeMode="cover"
/>
```

### ResizeMode Options
- `cover` - Crop to fill
- `contain` - Fit inside
- `stretch` - Stretch to fill
- `center` - Center, no scale

## 📜 Lists

### Small List (ScrollView)
```tsx
<ScrollView>
  {items.map(item => (
    <View key={item.id}>
      <Text>{item.title}</Text>
    </View>
  ))}
</ScrollView>
```

### Large List (FlatList - Better Performance)
```tsx
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  keyExtractor={item => item.id}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

## 🔍 Platform Detection

```tsx
import { Platform } from 'react-native';

// In code
if (Platform.OS === 'ios') {
  // iOS specific
} else if (Platform.OS === 'android') {
  // Android specific
}

// In styles
paddingTop: Platform.OS === 'ios' ? 20 : 0

// Platform.select
const styles = Platform.select({
  ios: { paddingTop: 20 },
  android: { paddingTop: 0 },
});
```

## 📐 Dimensions

```tsx
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

<View style={{ width: width * 0.8 }}>
  {/* 80% of screen width */}
</View>
```

## ⚠️ Common Gotchas

### 1. Text Must Be in <Text>
```tsx
// ❌ WRONG:
<View>Hello</View>

// ✅ CORRECT:
<View><Text>Hello</Text></View>
```

### 2. Image Needs Dimensions
```tsx
// ❌ WRONG:
<Image source={{ uri: url }} />

// ✅ CORRECT:
<Image 
  source={{ uri: url }} 
  style={{ width: 200, height: 200 }} 
/>
```

### 3. onClick → onPress
```tsx
// ❌ WRONG:
<TouchableOpacity onClick={...}>

// ✅ CORRECT:
<TouchableOpacity onPress={...}>
```

### 4. Flexbox Default
```tsx
// React Native defaults to flexDirection: 'column'
// Web defaults to flexDirection: 'row'

// For row:
<View className="flex-row">
```

## 🎛️ Useful Hooks

```tsx
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

// Route params
const { slug } = useLocalSearchParams();

// Safe area (notch, etc)
const insets = useSafeAreaInsets();
<View style={{ paddingTop: insets.top }}>

// Data fetching (same as web!)
const { data, isLoading } = useQuery({
  queryKey: ['articles'],
  queryFn: fetchArticles,
});
```

## 🐛 Debug Menu

### Open Menu
- **iOS Simulator:** `Cmd + D`
- **Android Emulator:** `Cmd/Ctrl + M`
- **Physical Device:** Shake phone

### Useful Options
- **Reload:** Refresh app
- **Debug Remote JS:** Chrome DevTools
- **Show Inspector:** Element inspector
- **Performance Monitor:** FPS counter

## 📦 Useful Packages

```bash
# Icons
npm install lucide-react-native

# Forms
npm install react-hook-form zod

# Animations
npm install react-native-reanimated

# Gestures
npm install react-native-gesture-handler

# Bottom Sheet
npm install @gorhom/bottom-sheet

# Image Picker
npx expo install expo-image-picker

# Camera
npx expo install expo-camera

# Notifications
npx expo install expo-notifications
```

## 📱 Testing

### Physical Device
1. Install "Expo Go" from App Store/Play Store
2. `npm start`
3. Scan QR code
4. App opens!

### Reload
- Shake device
- Or press 'r' in terminal

## 🏗️ Building

### Development Build
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Submit to Stores
```bash
eas submit --platform ios
eas submit --platform android
```

## 🔗 Quick Links

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **NativeWind:** https://www.nativewind.dev
- **Expo Router:** https://docs.expo.dev/router
- **React Query:** https://tanstack.com/query

## 💡 Pro Tips

1. **Use FlatList for long lists** (not map + ScrollView)
2. **Optimize images** - use proper sizes, format (webp)
3. **Use React.memo()** for expensive components
4. **Test on real devices** often
5. **Use SafeAreaView** for notch support
6. **Avoid inline styles** in render (use StyleSheet or className)
7. **Profile performance** regularly

## 🎯 Common Patterns

### Loading State
```tsx
{isLoading ? (
  <ActivityIndicator size="large" color="#0000ff" />
) : (
  <FlatList data={data} ... />
)}
```

### Pull to Refresh
```tsx
<FlatList
  data={data}
  refreshing={isRefreshing}
  onRefresh={handleRefresh}
  ...
/>
```

### Touchable Feedback
```tsx
<TouchableOpacity 
  activeOpacity={0.7}
  onPress={...}
>
  <Text>Tap me</Text>
</TouchableOpacity>
```

### Modal
```tsx
import { Modal } from 'react-native';

<Modal
  visible={isVisible}
  animationType="slide"
  onRequestClose={() => setIsVisible(false)}
>
  <View>
    <Text>Modal Content</Text>
  </View>
</Modal>
```

---

**Meer hulp?** Check `MIGRATION_GUIDE.md` voor uitgebreide voorbeelden!
