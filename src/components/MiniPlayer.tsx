import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { usePlayer } from '../music/playback/player-store';
import { useThemeStore } from '../theme/theme-store';
import { Artwork, IconButton, Surface } from './ui';
export function MiniPlayer() {
  const p = usePlayer(); const { tokens } = useThemeStore(s => s.theme);
  if (!p.track) return null;
  return <View style={{ padding: 8, backgroundColor: tokens.background }}><Surface style={{ padding: 8 }}><View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Pressable accessibilityRole="button" accessibilityLabel="Abrir reproductor" onPress={() => router.push({ pathname: '/player/[id]', params: { id: p.track!.id } })} style={{ flex: 1, flexDirection: 'row', gap: 12, alignItems: 'center' }}><Artwork track={p.track} size={42} /><View style={{ flex: 1 }}><Text numberOfLines={1} style={{ color: tokens.text, fontWeight: '600' }}>{p.track.title}</Text><Text numberOfLines={1} style={{ color: tokens.muted, fontSize: 12 }}>{p.error ? 'Toca para reintentar' : p.loading ? 'Cargando audio…' : p.track.artist}</Text></View></Pressable>
    <IconButton icon={p.playing ? 'pause' : 'play'} label={p.playing ? 'Pausar' : 'Reproducir'} onPress={p.toggle} /><IconButton icon="play-skip-forward" label="Siguiente pista" onPress={() => p.next()} />
  </View><View style={{ height: 2, backgroundColor: '#FFFFFF15', marginTop: 6 }}><View style={{ height: 2, backgroundColor: tokens.accent, width: `${Math.min(100, p.duration ? p.position / p.duration * 100 : 0)}%` }} /></View></Surface></View>;
}
