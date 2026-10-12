import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { demoTracks } from '../../music/sources/demo';
import { useThemeStore } from '../../theme/theme-store';
export function TrackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const track = demoTracks.find((item) => item.id === id);
  const { tokens } = useThemeStore((state) => state.theme);
  if (!track) return <Screen title="Pista no disponible" subtitle="No encontramos esta pista en la fuente activa."><Text style={{ color: tokens.muted }}>Regresa al catálogo.</Text></Screen>;
  return <Screen title={track.title} subtitle={track.artist}>
    <View accessibilityLabel="Carátula de demostración" style={{ aspectRatio: 1, borderRadius: tokens.radiusDp, backgroundColor: tokens.surface, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 70, color: tokens.accent }}>◉</Text></View>
    <Text style={{ color: tokens.muted }}>Duración de ejemplo: {Math.floor(track.durationSeconds / 60)}:{String(track.durationSeconds % 60).padStart(2,'0')}</Text>
    <Text style={{ color: tokens.text, lineHeight: 24 }}>La fuente de demostración no contiene audio. Aquí se conectará un adaptador autorizado de reproducción.</Text>
  </Screen>;
}
