# AI Daily - React Native App 📱

Native iOS en Android app voor AI Daily, gebouwd met React Native en Expo.

## 🚀 Quick Start

### Installatie
```bash
npm install
```

### Environment Setup
1. Kopieer `.env.example` naar `.env`
2. Vul je Supabase credentials in

### Development

**Start development server:**
```bash
npm start
```

**Run op specifiek platform:**
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

### Tips voor development
- Druk `i` voor iOS simulator
- Druk `a` voor Android emulator
- Druk `r` om te reloaden
- Druk `m` om het dev menu te openen

## 📱 Platformen

### iOS
- **Minimum versie:** iOS 13.4+
- **Tablet support:** Ja (iPad native layout)
- **Simulator testen:** Xcode vereist (alleen macOS)

### Android  
- **Minimum versie:** Android 5.0 (API 21+)
- **Tablet support:** Ja (adaptieve layouts)
- **Emulator testen:** Android Studio aanbevolen

## 🎨 Tech Stack

- **Framework:** React Native met Expo
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind CSS voor React Native)
- **State Management:** React Query
- **Backend:** Supabase
- **Icons:** Lucide React Native

## 📁 Project Structuur

```
ai-daily-native/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Bottom tab navigatie
│   │   ├── index.tsx      # Voorpagina
│   │   ├── net-binnen.tsx
│   │   ├── mijn-nieuws.tsx
│   │   └── meer.tsx
│   ├── artikel/[slug].tsx # Artikel detail
│   └── _layout.tsx        # Root layout
├── components/            # Herbruikbare components
├── src/
│   ├── lib/              # Utilities & Supabase
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript types
├── assets/               # Afbeeldingen & icons
└── global.css           # Tailwind styles
```

## 🔄 Migratie van Web naar Native

### Component Mapping

| Web | React Native |
|-----|--------------|
| `<div>` | `<View>` |
| `<span>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` of `<Pressable>` |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |

### Styling met NativeWind

Gebruik dezelfde Tailwind classes:
```tsx
// Web & Native zijn hetzelfde!
<View className="flex-1 bg-background px-4">
  <Text className="text-2xl font-bold text-foreground">
    Hallo Wereld
  </Text>
</View>
```

### Navigatie

```tsx
// Web (react-router-dom)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/artikel/slug');

// Native (expo-router)
import { useRouter } from 'expo-router';
const router = useRouter();
router.push('/artikel/slug');
```

## 🔨 Building voor Productie

### Development Build
```bash
npx expo prebuild           # Genereert native code
npx expo run:ios           # Build & run iOS
npx expo run:android       # Build & run Android
```

### Production Build (EAS)
```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
```

## 📦 Publishing

### Over-the-Air (OTA) Updates
```bash
eas update --branch production
```

### App Stores
- **iOS:** Gebruik EAS Build → App Store Connect
- **Android:** Gebruik EAS Build → Google Play Console

## 🛠️ Development Workflow

1. **Maak wijzigingen** in je code
2. **Test op simulators/emulators**
3. **Test op physical devices** met Expo Go app
4. **Build productie versie** met EAS
5. **Publish naar app stores**

## 📝 Volgende Stappen

- [ ] Kopieer components van web app
- [ ] Implementeer artikel lijst met scroll
- [ ] Voeg afbeelding caching toe
- [ ] Implementeer pull-to-refresh
- [ ] Voeg push notifications toe
- [ ] Implementeer deep linking
- [ ] Voeg offline support toe
- [ ] Setup biometrie authenticatie
- [ ] Configureer app analytics

## 🆘 Hulp Nodig?

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **NativeWind Docs:** https://www.nativewind.dev

## 📄 Licentie

Privé project - Alle rechten voorbehouden
