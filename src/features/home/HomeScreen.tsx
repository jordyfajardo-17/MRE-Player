import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { Action, Artwork, Copy, Label, Surface } from '../../components/ui';
import { searchCatalog, sourceLabels } from '../../music/sources/catalog';
import { usePlayerPresentation } from '../player/presentation-store';
import { usePlayer } from '../../music/playback/player-store';
import { useLibrary } from '../../music/core/library';
import { useThemeStore } from '../../theme/theme-store';
export function HomeScreen() {
  const { tokens } = useThemeStore(s => s.theme); const recent = useLibrary(s => s.recent);
  const result = useQuery({ queryKey: ['discovery', 'all'], queryFn: ({ signal }) => searchCatalog('all', '', 1, signal) });
  const tracks = result.data?.tracks ?? []; const featured = tracks[0];
  return <Screen title="Dale play a tu día." subtitle="Tu música. Tu espacio. Tu manera de escuchar.">
    <Surface style={{ borderRadius: 30 }}><LinearGradient colors={[`${tokens.accent}25`, '#FFFFFF04']} style={{ padding: 24, gap: 20 }}>
      <Text style={{ color: tokens.accent, fontSize: 11, fontWeight: '800', letterSpacing: 2 }}>TU PRÓXIMO DESCUBRIMIENTO</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}><View style={{ flex: 1, gap: 10 }}><Text style={{ color: tokens.text, fontSize: 28, fontWeight: '800', letterSpacing: -1 }}>Algo nuevo.{ '\n' }Muy tuyo.</Text><Copy>Artistas independientes y música abierta. Dos catálogos, más posibilidades.</Copy></View><Artwork track={featured} size={108} /></View>
      <Action onPress={() => { if (featured) { usePlayer.getState().play(featured, tracks); usePlayerPresentation.getState().open(); } else router.push('/search'); }}>{featured ? 'Escuchar selección' : 'Explorar música'}</Action>
    </LinearGradient></Surface>
    {!!recent.length && <><Label>Vuelve a tu música</Label><TrackList tracks={recent.slice(0, 3)} /></>}
    {result.data?.notices.map(notice => <Copy key={notice}>{notice}</Copy>)}
    <Label>En rotación</Label>
    {result.isPending ? <Copy>Cargando el catálogo…</Copy> : result.isError ? <><Copy>{result.error.message}</Copy><Action onPress={() => void result.refetch()}>Volver a intentar</Action></> : <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>{tracks.slice(0, 8).map(track => <Pressable accessibilityRole="button" accessibilityLabel={`Reproducir ${track.title}`} key={track.id} onPress={() => { usePlayer.getState().play(track, tracks); usePlayerPresentation.getState().open(); }} style={{ width: 152, gap: 8 }}><Artwork track={track} size={152} /><Text numberOfLines={1} style={{ color: tokens.text, fontWeight: '700' }}>{track.title}</Text><Text numberOfLines={1} style={{ color: tokens.muted, fontSize: 12 }}>{track.artist} · {sourceLabels[track.providerId]}</Text></Pressable>)}</ScrollView>}
    <Label>Para seguir descubriendo</Label><TrackList tracks={tracks.slice(8, 18)} />
    <Copy>Audius y Archivo abierto conservan la atribución y el enlace de origen. La disponibilidad depende de cada fuente.</Copy>
  </Screen>;
}
