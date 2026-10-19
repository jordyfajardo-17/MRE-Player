import { Tabs } from 'expo-router';
import { BottomTabBar } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useThemeStore } from '../../theme/theme-store';
import { MiniPlayer } from '../../components/MiniPlayer';
export default function TabLayout() {
  const { tokens, components } = useThemeStore(s => s.theme); const floating = components.navigation === 'floating-pill';
  return <Tabs tabBar={props => <View style={{ backgroundColor: tokens.background }}><MiniPlayer /><BottomTabBar {...props} /></View>} screenOptions={{ headerShown: false, tabBarActiveTintColor: tokens.accent, tabBarInactiveTintColor: tokens.muted, tabBarStyle: { backgroundColor: tokens.surface, borderTopWidth: 0, borderRadius: floating ? 30 : 0, marginHorizontal: floating ? 12 : 0, marginBottom: floating ? 8 : 0 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
    <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="themes" options={{ title: 'Apariencia', tabBarIcon: ({ color }) => <Ionicons name="color-palette-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="sources" options={{ title: 'Fuentes', tabBarIcon: ({ color }) => <Ionicons name="options-outline" size={23} color={color} /> }} />
  </Tabs>;
}


