# 📱 AI Daily Native - Project Overzicht

## 🎯 Wat is dit?

Dit is de **native iOS en Android app** voor AI Daily, gebouwd met **React Native** en **Expo**. 

### Key Features
- ✅ **Één codebase** voor iOS en Android
- ✅ **Native performance** en user experience
- ✅ **Tailwind CSS** met NativeWind (zelfde styling als web)
- ✅ **Supabase** backend (gedeeld met web app)
- ✅ **Expo Router** file-based navigatie
- ✅ **Bottom tab** navigatie (iOS/Android native patterns)

## 📂 Project Structuur

```
ai-daily-native/
│
├── 📱 app/                          # Expo Router - File-based routing
│   ├── _layout.tsx                 # Root layout (providers, global setup)
│   ├── (tabs)/                     # Bottom tab navigatie
│   │   ├── _layout.tsx             # Tab bar configuratie
│   │   ├── index.tsx               # Tab 1: Voorpagina (/)
│   │   ├── net-binnen.tsx          # Tab 2: Net Binnen
│   │   ├── mijn-nieuws.tsx         # Tab 3: Mijn Nieuws
│   │   └── meer.tsx                # Tab 4: Meer menu
│   └── artikel/
│       └── [slug].tsx              # Artikel detail (/artikel/:slug)
│
├── 🎨 components/                   # Herbruikbare UI components
│   └── LargeNewsCard.tsx           # Voorbeeld: gemigreerde component
│
├── 📦 src/
│   ├── lib/
│   │   └── supabase.ts             # Supabase client & helpers
│   ├── contexts/                   # React contexts (auth, etc.)
│   ├── hooks/                      # Custom hooks
│   └── types/                      # TypeScript definitions
│
├── 🎨 assets/                       # Statische bestanden
│   ├── icon.png                    # App icon
│   ├── splash-icon.png             # Splash screen
│   └── ...
│
├── ⚙️  Configuratie Bestanden
│   ├── app.json                    # Expo configuratie
│   ├── package.json                # Dependencies
│   ├── tailwind.config.js          # Tailwind setup
│   ├── metro.config.js             # Metro bundler + NativeWind
│   ├── tsconfig.json               # TypeScript config
│   ├── .env                        # Environment variabelen
│   └── global.css                  # Tailwind CSS variables
│
└── 📚 Documentatie
    ├── README.md                   # Quick start guide
    ├── SETUP_INSTRUCTIONS.md       # Gedetailleerde setup
    ├── MIGRATION_GUIDE.md          # Web → Native conversie
    └── PROJECT_OVERVIEW.md         # Dit bestand
```

## 🚀 Quick Start

```bash
# 1. Installeer dependencies (al gedaan)
npm install

# 2. Configureer environment
# Edit .env en vul Supabase credentials in

# 3. Start development server
npm start

# 4. Scan QR code met Expo Go app op je telefoon
# Of druk 'i' voor iOS simulator, 'a' voor Android
```

## 📲 Hoe Routes Werken

Expo Router gebruikt **file-based routing**, net als Next.js:

| Bestand | Route | Beschrijving |
|---------|-------|--------------|
| `app/(tabs)/index.tsx` | `/` | Voorpagina (tab 1) |
| `app/(tabs)/net-binnen.tsx` | `/net-binnen` | Net Binnen (tab 2) |
| `app/(tabs)/mijn-nieuws.tsx` | `/mijn-nieuws` | Mijn Nieuws (tab 3) |
| `app/(tabs)/meer.tsx` | `/meer` | Meer menu (tab 4) |
| `app/artikel/[slug].tsx` | `/artikel/:slug` | Artikel detail |

**Navigatie in code:**
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/artikel/abc123');  // Navigeer naar artikel
router.back();                    // Ga terug
```

## 🎨 Styling met NativeWind

### Tailwind Classes Werken Hetzelfde!

```tsx
// Web én Native!
<View className="flex-1 bg-background px-4 py-2">
  <Text className="text-2xl font-bold text-foreground">
    Hallo Wereld
  </Text>
</View>
```

### Theme Colors

De `global.css` definieert CSS variables die Tailwind gebruikt:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--accent`
- etc.

Beide light en dark mode zijn geconfigureerd.

## 🔄 Van Web naar Native

### Component Conversie

**Stap 1:** Kopieer web component  
**Stap 2:** Vervang imports  
**Stap 3:** HTML → React Native components  
**Stap 4:** Test!

### Belangrijkste Verschillen

| Web | Native |
|-----|--------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` |
| `<img>` | `<Image>` |
| `onClick` | `onPress` |
| `useNavigate()` | `useRouter()` |

Zie `MIGRATION_GUIDE.md` voor uitgebreide voorbeelden.

## 📦 Belangrijke Dependencies

### Core
- **expo** - Native app platform
- **expo-router** - File-based routing
- **react-native** - UI framework

### Styling
- **nativewind** - Tailwind voor React Native
- **tailwindcss** - CSS framework

### Data & State
- **@supabase/supabase-js** - Backend
- **@tanstack/react-query** - Data fetching
- **@react-native-async-storage/async-storage** - Local storage

### UI
- **lucide-react-native** - Icons
- **react-native-gesture-handler** - Touch gestures
- **react-native-reanimated** - Animations

## 🛠️ Development Workflow

### Normale Development
1. **Wijzig code** in je editor
2. **Save** - app reload automatisch
3. **Test** op device/simulator
4. Herhaal

### Debugging
- **Console logs** → Metro bundler terminal
- **React DevTools** → via dev menu
- **Breakpoints** → VS Code met debugger

### Testing Devices
- **Expo Go** → Snelste voor development
- **iOS Simulator** → Mac only, gratis
- **Android Emulator** → Alle platforms
- **Physical devices** → Meest betrouwbaar

## 🚀 Van Development naar Productie

### 1. Development Build (nu)
```bash
npm start
```
→ Test met Expo Go

### 2. Preview Build (test native features)
```bash
eas build --profile preview
```
→ Installable build voor testing

### 3. Production Build
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```
→ Ready voor app stores

### 4. Submit naar Stores
```bash
eas submit --platform ios
eas submit --platform android
```

## 📊 Huidige Status

### ✅ Compleet
- [x] Project setup en configuratie
- [x] Expo Router met tab navigatie
- [x] NativeWind (Tailwind) integratie
- [x] Supabase client configuratie
- [x] Basis screens (alle 4 tabs)
- [x] Voorbeeld gemigreerde component
- [x] Uitgebreide documentatie

### 🚧 Volgende Stappen
1. **Migreer components** van web app
   - Start met `LargeNewsCard` (voorbeeld aanwezig)
   - Dan `ArticleListRow`
   - Dan `TopicBlock`
   - etc.

2. **Implementeer data fetching**
   - Connect Supabase
   - Fetch artikelen voor voorpagina
   - Implement infinite scroll

3. **Artikel detail pagina**
   - `app/artikel/[slug].tsx` uitbouwen
   - Content rendering
   - Share functionaliteit

4. **Native features**
   - Push notifications
   - Biometrie login
   - Share sheet
   - Deep linking

5. **Polish**
   - Loading states
   - Error handling
   - Pull-to-refresh
   - Offline support

6. **Branding**
   - Custom app icon
   - Splash screen
   - Custom fonts

7. **Testing & Deployment**
   - Test op diverse devices
   - Beta testing (TestFlight/Internal Testing)
   - Submit naar stores

## 🎯 Development Tips

### Performance
- Gebruik `FlatList` voor lange lijsten (niet `map`)
- Optimaliseer afbeeldingen (compression, caching)
- Gebruik `React.memo()` voor expensive components
- Profile met React DevTools

### Best Practices
- ✅ Test op beide iOS en Android regelmatig
- ✅ Gebruik TypeScript voor type safety
- ✅ Follow React Native naming conventions
- ✅ Keep components small en reusable
- ✅ Use SafeAreaView voor top/bottom insets

### Common Pitfalls
- ❌ Text niet in `<Text>` component
- ❌ Vergeten dimensies op remote images
- ❌ `onClick` gebruiken (moet `onPress`)
- ❌ CSS cascade verwachten (werkt niet in RN)
- ❌ Web-only libraries gebruiken

## 📚 Leermateriaal

### Documentatie
- **Expo:** https://docs.expo.dev
- **React Native:** https://reactnative.dev
- **Expo Router:** https://docs.expo.dev/router/introduction
- **NativeWind:** https://www.nativewind.dev

### Video's
- React Native Crash Course (YouTube)
- Expo Router Tutorial (YouTube)
- Building Production Apps (Expo docs)

### Community
- Expo Discord: https://chat.expo.dev
- React Native Discord
- Stack Overflow (react-native tag)

## 🎉 Conclusie

Je hebt nu een volledig werkende React Native app setup met:
- ✅ iOS en Android support
- ✅ Native navigatie en UI
- ✅ Tailwind styling
- ✅ Supabase backend
- ✅ Production-ready architecture

**Volgende stap:** Start met migreren van je eerste component! 

Gebruik `MIGRATION_GUIDE.md` als referentie en `components/LargeNewsCard.tsx` als voorbeeld.

Veel succes! 🚀
