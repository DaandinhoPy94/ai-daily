import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StockProvider } from '@/src/contexts/StockProvider';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StockProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="artikel/[slug]"
              options={{
                headerShown: true,
                headerTransparent: true,
                headerBlurEffect: 'systemMaterial',
                headerShadowVisible: false,
                headerTitle: 'AI Dagelijks',
              }}
            />
          </Stack>
        </StockProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
