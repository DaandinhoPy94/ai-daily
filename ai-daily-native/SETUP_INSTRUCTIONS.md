# 🎯 Setup Instructies - AI Daily Native App

## Stap 1: Environment Variabelen

Vul je Supabase credentials in het `.env` bestand:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=jouw-anon-key
```

💡 **Waar vind ik deze?**
- Log in op https://supabase.com
- Ga naar je project
- Settings → API
- Kopieer "Project URL" en "anon public" key

## Stap 2: Installeer Expo Go (voor testen)

### Op je telefoon/tablet:
- **iOS:** Download "Expo Go" van de App Store
- **Android:** Download "Expo Go" van de Play Store

## Stap 3: Start Development Server

```bash
cd ai-daily-native
npm start
```

Dit opent de Expo Dev Tools. Je ziet een QR code.

## Stap 4: Open de App

### Op Physical Device (aanbevolen voor eerste test):
1. Open Expo Go app op je telefoon
2. **iOS:** Scan de QR code met Camera app
3. **Android:** Scan de QR code in Expo Go app
4. De app wordt geladen en geopend

### Op Simulator/Emulator:
**iOS Simulator (alleen macOS):**
```bash
npm run ios
```
*Vereist Xcode geïnstalleerd*

**Android Emulator:**
```bash
npm run android
```
*Vereist Android Studio met een emulator*

## 🎉 Eerste Gebruik

Je zou nu moeten zien:
- ✅ 4 tabs onderaan (Voorpagina, Net binnen, Mijn nieuws, Meer)
- ✅ Een welkomstscherm met informatie
- ✅ Native look & feel
- ✅ Smooth animaties

## 🔧 Development Tips

### Hot Reload
Wijzigingen worden automatisch herladen. Je hoeft de app niet opnieuw op te starten.

### Dev Menu Openen
- **iOS Simulator:** Cmd + D
- **iOS Device:** Schud je telefoon
- **Android:** Cmd/Ctrl + M of schud device

### Nuttige Dev Menu Opties
- **Reload:** Herlaadt de app
- **Debug Remote JS:** Chrome DevTools debugging
- **Show Performance Monitor:** FPS counter
- **Toggle Inspector:** Element inspector

## 📱 Platform Specifieke Setup

### iOS Development

**Vereisten:**
- macOS computer
- Xcode geïnstalleerd (gratis van App Store)
- Apple Developer Account ($99/jaar voor productie)

**Simulators installeren:**
1. Open Xcode
2. Xcode → Settings → Platforms
3. Download gewenste iOS versies

### Android Development

**Vereisten:**
- Android Studio (gratis)
- JDK 17 of hoger

**Emulator setup:**
1. Open Android Studio
2. Tools → Device Manager
3. Create Virtual Device
4. Kies een device (bijv. Pixel 5)
5. Download system image (bijv. API 33)

## 🚀 Production Build (later)

### EAS Build Setup
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### iOS Build
```bash
eas build --platform ios
```

### Android Build
```bash
eas build --platform android
```

## 🐛 Troubleshooting

### "Unable to resolve module..."
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### "Watchman error"
```bash
brew install watchman  # macOS
# of
choco install watchman  # Windows
```

### iOS Simulator niet zichtbaar
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

### Android Emulator start niet
- Controleer of virtualization is ingeschakeld in BIOS
- Start Android Studio → Tools → AVD Manager
- Check of emulator daar start

### "Network error" bij Supabase calls
- Check of `.env` bestand correct is
- Controleer of Supabase URL/Key kloppen
- Test Supabase URL in browser

## 📊 Project Status

### ✅ Klaar
- [x] Expo Router setup
- [x] NativeWind (Tailwind) configuratie
- [x] Tab navigatie
- [x] Supabase integratie
- [x] Basis screens
- [x] Voorbeeld component (LargeNewsCard)

### 🚧 Te Doen
- [ ] Alle components migreren van web
- [ ] API calls implementeren
- [ ] Artikel detail pagina
- [ ] Afbeelding caching
- [ ] Pull-to-refresh
- [ ] Push notifications
- [ ] Offline support
- [ ] Authenticatie
- [ ] App icons & splash screens

## 🎨 Customization

### App Icon & Splash Screen
Vervang deze bestanden in `assets/`:
- `icon.png` (1024x1024)
- `splash-icon.png` (1200x1200)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

### App Naam Wijzigen
In `app.json`:
```json
{
  "expo": {
    "name": "Jouw App Naam",
    "slug": "jouw-app-slug"
  }
}
```

### Bundle Identifiers (voor productie)
```json
{
  "ios": {
    "bundleIdentifier": "com.jouwbedrijf.appnaam"
  },
  "android": {
    "package": "com.jouwbedrijf.appnaam"
  }
}
```

## 📞 Support

**Community:**
- Expo Discord: https://chat.expo.dev
- React Native Discord: https://discord.com/invite/reactivenative

**Documentatie:**
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev

## ✨ Volgende Stappen

1. ✅ Test de basis app
2. 📝 Lees `MIGRATION_GUIDE.md` voor component migratie
3. 🔨 Begin met migreren van je eerste component
4. 🧪 Test op beide platforms
5. 🎨 Customize styling en branding
6. 🚀 Build en publish naar app stores

Good luck! 🎉
