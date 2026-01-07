import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StockProvider } from '@/src/contexts/StockProvider';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StockProvider>
          <StatusBar style="light" translucent />
          <Stack
            screenOptions={{
              headerShown: false,
              // Enable native stack for GPU-accelerated transitions
              animation: 'default',
              // Ensure content extends edge-to-edge
              contentStyle: { backgroundColor: '#fafafa' },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="artikel/[slug]"
              options={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: 'systemMaterial',
                headerTitle: '',
                headerBackTitle: 'Terug',
                headerTintColor: '#0a0a0a',
              }}
            />
          </Stack>
        </StockProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
