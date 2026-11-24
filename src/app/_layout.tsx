import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlassEnvironmentProvider } from '../components/glass';
import { MiniPlayer } from '../components/MiniPlayer';
import { usePlayerPresentation } from '../features/player/presentation-store';
import { releasePlayer } from '../music/playback/player-store';
import { useThemeStore } from '../theme/theme-store';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 60_000 } } });
export default function RootLayout() {
  const { theme, hydrated, hydrate } = useThemeStore();
  const expanded = usePlayerPresentation(s => s.expanded);
  useEffect(() => { void hydrate(); return releasePlayer; }, [hydrate]);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.tokens.background }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GlassEnvironmentProvider><ThemeProvider value={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: 'transparent', card: theme.tokens.surface, text: theme.tokens.text, primary: theme.tokens.accent, border: '#FFFFFF20' } }}><StatusBar style="light" /><View aria-hidden={expanded} style={{ flex: 1 }} accessibilityElementsHidden={expanded} importantForAccessibility={expanded ? 'no-hide-descendants' : 'auto'}>
          {hydrated ? <Stack screenOptions={{ headerStyle: { backgroundColor: theme.tokens.background }, headerTintColor: theme.tokens.text, contentStyle: { backgroundColor: theme.components.surface === 'flat' ? theme.tokens.background : 'transparent' } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="player/[id]" options={{ title: 'Reproductor', presentation: 'modal' }} />
          </Stack> : <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Cargando tema" color={theme.tokens.accent} /></View>}
          </View>{hydrated && <MiniPlayer />}</ThemeProvider></GlassEnvironmentProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

