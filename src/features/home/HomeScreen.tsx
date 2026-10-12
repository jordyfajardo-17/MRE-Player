import { Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { demoTracks } from '../../music/sources/demo';
import { useThemeStore } from '../../theme/theme-store';
export function HomeScreen() {
  const { tokens } = useThemeStore((state) => state.theme);
  return <Screen title="Tu música, a tu manera" subtitle="Una base para construir tu experiencia musical.">
    <View style={{ backgroundColor: tokens.surface, borderRadius: tokens.radiusDp, padding: 24, gap: 12 }}>
      <Text style={{ color: tokens.accent, fontSize: 22, fontWeight: '600' }}>Empieza con tu identidad</Text>
      <Text style={{ color: tokens.muted, lineHeight: 22 }}>Abre Temas y prueba Emerald, Liquid Glass o Material Wave.</Text>
    </View>
    <Text accessibilityRole="header" style={{ color: tokens.text, fontSize: 20, fontWeight: '600' }}>Explora la base</Text>
    <TrackList tracks={demoTracks} />
    <Text style={{ color: tokens.muted, lineHeight: 22 }}>Estas pistas contienen metadata ficticia para diseñar la app. El audio y las cuentas musicales aún no están conectados.</Text>
  </Screen>;
}
