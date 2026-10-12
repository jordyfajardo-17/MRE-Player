import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useThemeStore } from '../../theme/theme-store';

export default function TabLayout() {
  const { tokens, components } = useThemeStore((state) => state.theme);
  const floating = components.navigation === 'floating-pill';
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: tokens.accent,
    tabBarInactiveTintColor: tokens.muted, tabBarStyle: { backgroundColor: tokens.surface,
      borderTopWidth: 0, borderRadius: floating ? tokens.radiusDp : 0,
      marginHorizontal: floating ? 12 : 0, marginBottom: floating ? 8 : 0 } }}>
    <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Text style={{ color }}>⌂</Text> }} />
    <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: ({ color }) => <Text style={{ color }}>⌕</Text> }} />
    <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: ({ color }) => <Text style={{ color }}>≡</Text> }} />
    <Tabs.Screen name="themes" options={{ title: 'Temas', tabBarIcon: ({ color }) => <Text style={{ color }}>◈</Text> }} />
  </Tabs>;
}
