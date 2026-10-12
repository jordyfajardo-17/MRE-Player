import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeStore } from '../theme/theme-store';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60_000 } } });
export default function RootLayout() {
  const { theme, hydrated, hydrate } = useThemeStore();
  useEffect(() => { void hydrate(); }, [hydrate]);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.tokens.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          {hydrated ? <Stack screenOptions={{ headerStyle: { backgroundColor: theme.tokens.background }, headerTintColor: theme.tokens.text, contentStyle: { backgroundColor: theme.tokens.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="player/[id]" options={{ title: 'Detalle de la pista' }} />
          </Stack> : <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Cargando tema" color={theme.tokens.accent} /></View>}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
