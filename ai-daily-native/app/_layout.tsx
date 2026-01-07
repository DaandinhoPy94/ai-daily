import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, StyleSheet } from 'react-native';
import { StockProvider } from '@/src/contexts/StockProvider';
import { TabsHeaderLeftAccount } from '@/components/header/TabsHeaderLeftAccount';
import { TabsHeaderRightSearch } from '@/components/header/TabsHeaderRightSearch';
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
              headerShown: true,
              headerTransparent: true,
              headerBlurEffect: 'systemMaterial',
              headerShadowVisible: false,
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerTitle: () => <Text style={styles.headerTitle}>AI Dagelijks</Text>,
                headerLeft: () => <TabsHeaderLeftAccount />,
                headerRight: () => <TabsHeaderRightSearch />,
              }}
            />
            <Stack.Screen
              name="artikel/[slug]"
              options={{
                headerTitle: () => <Text style={styles.headerTitle}>AI Dagelijks</Text>,
              }}
            />
          </Stack>
        </StockProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0a0a0a',
    letterSpacing: -0.5,
    fontFamily: 'Georgia',
    textShadowColor: 'rgba(255,255,255,0.55)',
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 6,
  },
});
