# Migratiegids: Web → React Native

Deze gids helpt je om je bestaande web componenten naar React Native te migreren.

## 🔄 Basis Component Conversie

### 1. Imports Aanpassen

**Web:**
```tsx
import { useNavigate } from 'react-router-dom';
```

**Native:**
```tsx
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
```

### 2. HTML → React Native Components

| Web | Native | Voorbeeld |
|-----|--------|-----------|
| `<div>` | `<View>` | Container element |
| `<span>`, `<p>`, `<h1>` | `<Text>` | Alle text moet in `<Text>` |
| `<button>` | `<TouchableOpacity>` | Klikbare elementen |
| `<img>` | `<Image>` | Afbeeldingen |
| `<input>` | `<TextInput>` | Text input |
| `<a>` | `<TouchableOpacity>` + router | Links |

### 3. Event Handlers

**Web:**
```tsx
<button onClick={handleClick}>Click</button>
```

**Native:**
```tsx
<TouchableOpacity onPress={handlePress}>
  <Text>Click</Text>
</TouchableOpacity>
```

### 4. Styling Classes Blijven (grotendeels) Hetzelfde

Met NativeWind kun je Tailwind classes blijven gebruiken:

```tsx
// Beide platforms!
<View className="flex-1 bg-background px-4 py-2">
  <Text className="text-2xl font-bold text-foreground">
    Titel
  </Text>
</View>
```

**Let op:** Niet alles werkt (bijv. geen `hover:` states op mobile).

## 📱 Praktijk Voorbeelden

### Voorbeeld 1: LargeNewsCard Migratie

**Web versie** (`src/components/LargeNewsCard.tsx`):
```tsx
export function LargeNewsCard({ article }: LargeNewsCardProps) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(\`/artikel/\${article.slug}\`)} 
         className="mb-4 cursor-pointer">
      {article.media_asset_url && (
        <img
          src={article.media_asset_url}
          alt={article.media_asset_alt}
          className="w-full aspect-video rounded-lg object-cover"
        />
      )}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold">{article.title}</h3>
      </div>
    </div>
  );
}
```

**Native versie** (zie `components/LargeNewsCard.tsx`):
```tsx
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export function LargeNewsCard({ article }: LargeNewsCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.push(\`/artikel/\${article.slug}\`)}
      activeOpacity={0.7}
      className="mb-4"
    >
      {article.media_asset_url && (
        <Image
          source={{ uri: article.media_asset_url }}
          className="w-full aspect-video rounded-lg"
          resizeMode="cover"
        />
      )}
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-lg font-semibold">{article.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
```

**Belangrijkste verschillen:**
- ✅ `div` → `View`
- ✅ `img` → `Image` met `source={{ uri: url }}`
- ✅ `onClick` → `onPress`
- ✅ `navigate()` → `router.push()`
- ✅ `cursor-pointer` verwijderd (niet nodig)
- ✅ `activeOpacity` toegevoegd (tap feedback)

### Voorbeeld 2: MobileIndex Migratie

**Web versie structuur:**
```tsx
export default function MobileIndex() {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <main className="pb-20">
        {/* Content */}
      </main>
      <BottomTabBar />
    </div>
  );
}
```

**Native versie:**
```tsx
import { SafeAreaView, ScrollView } from 'react-native';

export default function MobileIndex() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header ingebouwd in tab layout */}
      <ScrollView className="flex-1">
        {/* Content */}
      </ScrollView>
      {/* BottomTabBar is Expo Router tabs */}
    </SafeAreaView>
  );
}
```

**Belangrijkste verschillen:**
- ✅ `min-h-screen` → `flex-1` met `SafeAreaView`
- ✅ Scrollable content in `ScrollView`
- ✅ BottomTabBar wordt Expo Router tab layout
- ✅ Safe areas (notch) automatisch afgehandeld

## 🎨 Styling Verschillen

### Flexbox

React Native gebruikt standaard `flexDirection: 'column'` (web is `row`).

```tsx
// Web: flex-row is standaard voor flex
<div className="flex">  // → row

// Native: flex is standaard column
<View className="flex-1">  // → column
<View className="flex-row"> // → row
```

### Geen CSS Cascade

In React Native erft text styling NIET automatisch:

```tsx
// Werkt NIET in React Native:
<View className="text-blue-500">
  <Text>Ik ben niet blauw!</Text>
</View>

// Moet zo:
<View>
  <Text className="text-blue-500">Ik ben blauw!</Text>
</View>
```

### Width & Height

Percentages werken anders:

```tsx
// Web:
<div className="w-1/2">  // 50% van parent

// Native (werkt ook):
<View className="w-1/2">  // 50% van parent
// Of:
<View style={{ width: '50%' }}>
```

## 🚀 Navigatie

### Routes Definitie

**Web (react-router-dom):**
```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/artikel/:slug" element={<Article />} />
</Routes>
```

**Native (expo-router) - file based:**
```
app/
  (tabs)/
    index.tsx          → /
  artikel/
    [slug].tsx         → /artikel/:slug
```

### Navigatie Code

**Web:**
```tsx
const navigate = useNavigate();
navigate('/artikel/abc123');
navigate(-1); // terug
```

**Native:**
```tsx
const router = useRouter();
router.push('/artikel/abc123');
router.back(); // terug
```

## 🖼️ Afbeeldingen

### Static Images

**Web:**
```tsx
import logo from './logo.png';
<img src={logo} />
```

**Native:**
```tsx
const logo = require('./logo.png');
<Image source={logo} />
```

### Remote Images

**Web:**
```tsx
<img src="https://example.com/image.jpg" />
```

**Native:**
```tsx
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
// Note: Width/height is VERPLICHT voor remote images!
```

## 📋 Lists & ScrollView

**Web:**
```tsx
<div className="overflow-y-auto">
  {items.map(item => <div key={item.id}>{item.title}</div>)}
</div>
```

**Native - Kleine lijst:**
```tsx
<ScrollView>
  {items.map(item => (
    <View key={item.id}>
      <Text>{item.title}</Text>
    </View>
  ))}
</ScrollView>
```

**Native - Grote lijst (performance):**
```tsx
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
  keyExtractor={item => item.id}
/>
```

## 🔍 Platform Specifieke Code

Soms wil je verschillende code voor iOS/Android:

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});

// Of:
Platform.select({
  ios: { /* iOS style */ },
  android: { /* Android style */ },
});
```

## ⚠️ Veelgemaakte Fouten

### 1. Text buiten Text component
```tsx
// ❌ FOUT:
<View>Hello</View>

// ✅ GOED:
<View><Text>Hello</Text></View>
```

### 2. onClick i.p.v. onPress
```tsx
// ❌ FOUT:
<TouchableOpacity onClick={...}>

// ✅ GOED:
<TouchableOpacity onPress={...}>
```

### 3. className op alle components
```tsx
// ❌ Werkt niet altijd:
<Image className="w-20 h-20" />

// ✅ Beter:
<Image 
  className="rounded-lg"
  style={{ width: 80, height: 80 }} 
/>
```

### 4. Vergeten SafeAreaView
```tsx
// ❌ Content verdwijnt achter notch:
<View>...</View>

// ✅ Content respecteert safe areas:
<SafeAreaView>...</SafeAreaView>
```

## 🎯 Stappenplan voor Migratie

1. **Kopieer de component** naar native project
2. **Update imports**: 
   - Voeg React Native components toe
   - Vervang web-only imports
3. **Vervang HTML tags** met React Native components
4. **Update event handlers** (onClick → onPress)
5. **Check styling** - test of Tailwind classes werken
6. **Test op device/simulator**
7. **Optimaliseer voor mobile** (touch targets, scroll, etc.)

## 📚 Handige Resources

- **React Native Docs:** https://reactnative.dev/docs/components-and-apis
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **NativeWind:** https://www.nativewind.dev
- **Platform Differences:** https://reactnative.dev/docs/platform-specific-code

## 🆘 Hulp Nodig?

Bekijk de voorbeeldcomponent `components/LargeNewsCard.tsx` voor een complete migratie voorbeeld.
