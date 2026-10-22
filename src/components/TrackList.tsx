import { usePlayerPresentation } from '../features/player/presentation-store';
import { sourceLabels } from '../music/sources/catalog';
import { Pressable, Text, View } from 'react-native';
import type { Track } from '../music/core/types';
import { useThemeStore } from '../theme/theme-store';
import { usePlayer } from '../music/playback/player-store';
import { useLibrary } from '../music/core/library';
import { Artwork, Copy, IconButton, Surface } from './ui';
export function TrackList({ tracks }: { tracks: Track[] }) {
  const { tokens, components } = useThemeStore(s => s.theme);
  const active = usePlayer(s => s.track?.id); const favorites = useLibrary(s => s.favorites);
  return <View style={{ gap: components.layout === 'dense' ? 4 : 12 }}>
    {tracks.map((track, index) => <Surface key={`${track.id}-${index}`} style={{ padding: 8, paddingVertical: components.layout === 'dense' ? 6 : 12, ...(active === track.id ? { backgroundColor: `${tokens.accent}22` } : {}), borderRadius: Math.min(tokens.radiusDp, 18), flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Reproducir ${track.title}, ${track.artist}`} onPress={() => { usePlayer.getState().play(track, tracks); usePlayerPresentation.getState().open(); }} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 }}>
        <Artwork track={track} size={components.layout === 'artwork' ? 68 : 50} />
        <View style={{ flex: 1, gap: 5 }}><Text numberOfLines={1} style={{ color: active === track.id ? tokens.accent : tokens.text, fontSize: 15, fontWeight: '600' }}>{track.title}</Text><Text numberOfLines={1} style={{ color: tokens.muted, fontSize: 12 }}>{track.artist} · {sourceLabels[track.providerId] ?? track.providerId}</Text></View>
      </Pressable>
      <IconButton icon={favorites.some(t => t.id === track.id) ? 'heart' : 'heart-outline'} label={`Favorito: ${track.title}`} active={favorites.some(t => t.id === track.id)} onPress={() => useLibrary.getState().favorite(track)} size={19} />
      <IconButton icon="add" label={`Añadir a la cola: ${track.title}`} onPress={() => usePlayer.getState().enqueue(track)} size={20} />
    </Surface>)}
    {!tracks.length && <Copy>No hay pistas aquí todavía.</Copy>}
  </View>;
}
