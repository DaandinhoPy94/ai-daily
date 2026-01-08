import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: 'systemMaterial',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Meer' }} />
    </Stack>
  );
}

