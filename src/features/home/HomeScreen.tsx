import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { Action, Artwork, Copy, Label } from '../../components/ui';
import { audiusSource } from '../../music/sources/audius';
import { usePlayer } from '../../music/playback/player-store';
import { useLibrary } from '../../music/core/library';
import { useThemeStore } from '../../theme/theme-store';
export function HomeScreen() {
  const { tokens } = useThemeStore(s => s.theme); const recent = useLibrary(s => s.recent);
  const result = useQuery({ queryKey: ['audius', ''], queryFn: ({ signal }) => audiusSource.search('', signal) });
  const tracks = result.data ?? []; const featured = tracks[0];
  return <Screen title="Dale play a tu día." subtitle="Tu música. Tu espacio. Tu manera de escuchar.">
    <LinearGradient colors={[`${tokens.accent}40`, tokens.surface]} style={{ borderRadius: 28, padding: 24, gap: 20 }}>
      <Text style={{ color: tokens.accent, fontSize: 11, fontWeight: '800', letterSpacing: 2 }}>DESCUBRE EN AUDIUS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}><View style={{ flex: 1, gap: 10 }}><Text style={{ color: tokens.text, fontSize: 28, fontWeight: '800', letterSpacing: -1 }}>Algo nuevo.{ '\n' }Muy tuyo.</Text><Copy>Una selección que cambia con la música de la comunidad.</Copy></View><Artwork track={featured} size={108} /></View>
      <Action onPress={() => { if (featured) { usePlayer.getState().play(featured, tracks); router.push({ pathname: '/player/[id]', params: { id: featured.id } }); } else router.push('/search'); }}>{featured ? 'Escuchar selección' : 'Explorar música'}</Action>
    </LinearGradient>
    {!!recent.length && <><Label>Vuelve a tu música</Label><TrackList tracks={recent.slice(0, 3)} /></>}
    <Label>En rotación</Label>
    {result.isPending ? <Copy>Cargando el catálogo…</Copy> : result.isError ? <><Copy>{result.error.message}</Copy><Action onPress={() => void result.refetch()}>Volver a intentar</Action></> : <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>{tracks.slice(0, 8).map(track => <Pressable accessibilityRole="button" accessibilityLabel={`Reproducir ${track.title}`} key={track.id} onPress={() => { usePlayer.getState().play(track, tracks); router.push({ pathname: '/player/[id]', params: { id: track.id } }); }} style={{ width: 152, gap: 8 }}><Artwork track={track} size={152} /><Text numberOfLines={1} style={{ color: tokens.text, fontWeight: '700' }}>{track.title}</Text><Text numberOfLines={1} style={{ color: tokens.muted, fontSize: 12 }}>{track.artist}</Text></Pressable>)}</ScrollView>}
    <Label>Para seguir descubriendo</Label><TrackList tracks={tracks.slice(8, 18)} />
    <Copy>Catálogo y audio proporcionados por Audius. La disponibilidad depende de cada artista.</Copy>
  </Screen>;
}
