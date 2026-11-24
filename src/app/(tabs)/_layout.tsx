import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeStore } from '../../theme/theme-store';
import { LiquidTabBar } from '../../components/LiquidTabBar';
export default function TabLayout() {
  const { tokens } = useThemeStore(s => s.theme);
  return <Tabs tabBar={props => <LiquidTabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' }, tabBarActiveTintColor: tokens.accent }}>
    <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="search" options={{ title: 'Buscar', tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="library" options={{ title: 'Biblioteca', tabBarIcon: ({ color }) => <Ionicons name="library-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="themes" options={{ title: 'Apariencia', tabBarIcon: ({ color }) => <Ionicons name="color-palette-outline" size={23} color={color} /> }} />
    <Tabs.Screen name="sources" options={{ title: 'Fuentes', tabBarIcon: ({ color }) => <Ionicons name="options-outline" size={23} color={color} /> }} />
  </Tabs>;
}


