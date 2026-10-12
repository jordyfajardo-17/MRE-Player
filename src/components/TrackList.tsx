import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { Track } from '../music/core/types';
import { useThemeStore } from '../theme/theme-store';
export function TrackList({ tracks }: { tracks: Track[] }) {
  const { tokens, components } = useThemeStore((state) => state.theme);
  return <View style={{ gap: components.layout === 'dense' ? 8 : 16 }}>
    {tracks.map((track, index) => <Pressable key={track.id} accessibilityRole="button" accessibilityLabel={`Ver ${track.title}, ${track.artist}`}
      onPress={() => router.push({ pathname: '/player/[id]', params: { id: track.id } })}
      style={({ pressed }) => ({ backgroundColor: tokens.surface, padding: components.layout === 'artwork' ? 24 : 16, borderRadius: tokens.radiusDp, opacity: pressed ? 0.7 : 1, flexDirection: 'row', alignItems: 'center', gap: 16 })}>
      <View style={{ backgroundColor: tokens.accent, width: 48, height: 48, borderRadius: Math.min(tokens.radiusDp, 12), alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: tokens.background, fontSize: 20 }}>{index + 1}</Text></View>
      <View style={{ flex: 1, gap: 4 }}><Text style={{ color: tokens.text, fontSize: 17, fontWeight: '600' }}>{track.title}</Text><Text style={{ color: tokens.muted }}>{track.artist}</Text></View>
      <Text style={{ color: tokens.muted }}>›</Text>
    </Pressable>)}
    {!tracks.length && <Text style={{ color: tokens.muted }}>No encontramos pistas en el catálogo de demostración.</Text>}
  </View>;
}
