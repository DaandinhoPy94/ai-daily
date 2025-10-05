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
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="artikel/[slug]" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="opgeslagen" />
            <Stack.Screen name="preferences" />
          </Stack>
        </StockProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
