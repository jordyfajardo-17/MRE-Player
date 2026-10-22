import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { Action, Copy, Label, Surface } from '../../components/ui';
import { searchCatalog, type CatalogSource } from '../../music/sources/catalog';
import { useLibrary } from '../../music/core/library';
import { useThemeStore } from '../../theme/theme-store';
export function SearchScreen() {
  const [query, setQuery] = useState(''); const [term, setTerm] = useState(''); const [source, setSource] = useState<CatalogSource | 'local'>('all');
  const local = useLibrary(s => s.local); const { tokens } = useThemeStore(s => s.theme);
  useEffect(() => { const timer = setTimeout(() => setTerm(query), 450); return () => clearTimeout(timer); }, [query]);
  const result = useInfiniteQuery({ queryKey: ['catalog', source, term], initialPageParam: 1,
    queryFn: ({ signal, pageParam }) => searchCatalog(source === 'local' ? 'all' : source, term, pageParam, signal),
    enabled: source !== 'local', getNextPageParam: (last, pages) => last.tracks.length && pages.length < 8 ? pages.length + 1 : undefined });
  const tracks = source === 'local' ? local.filter(t => `${t.title} ${t.artist}`.toLocaleLowerCase().includes(term.toLocaleLowerCase())) : [...new Map(result.data?.pages.flatMap(page => page.tracks).map(track => [track.id, track])).values()];
  const notices = [...new Set(result.data?.pages.flatMap(page => page.notices))];
  return <Screen title="Encuentra tu sonido." subtitle="Más caminos para descubrir. Elige una fuente o explóralas juntas.">
    <Surface style={{ padding: 4 }}><TextInput accessibilityLabel="Buscar canciones o artistas" placeholder="Canción, artista o estilo" placeholderTextColor={tokens.muted} value={query} onChangeText={setQuery} returnKeyType="search" onSubmitEditing={() => setTerm(query)} style={{ color: tokens.text, padding: 14, fontSize: 17 }} /></Surface>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{([['all', 'Todas'], ['audius', 'Audius'], ['archive', 'Archivo abierto'], ['local', 'Mis archivos']] as const).map(([id, title]) => <Action key={id} secondary={source !== id} onPress={() => setSource(id)}>{title}</Action>)}</View>
    {!query && <><Label>Prueba otro ambiente</Label><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['Ambient', 'Jazz', 'Classical', 'Electronic', 'Rock', 'Piano'].map(genre => <Action secondary key={genre} onPress={() => { setQuery(genre); setTerm(genre); }}>{genre}</Action>)}</View></>}
    {notices.map(notice => <Copy key={notice}>{notice}</Copy>)}
    {source !== 'local' && result.isPending ? <Copy>Buscando música en las fuentes seleccionadas…</Copy> : source !== 'local' && result.isError && !tracks.length ? <><Copy>{result.error.message}</Copy><Action onPress={() => void result.refetch()}>Reintentar búsqueda</Action></> : <><Copy>{tracks.length} canciones {term ? `para “${term}”` : 'para descubrir'}</Copy><TrackList tracks={tracks} /></>}
    {source !== 'local' && result.hasNextPage && <Action secondary onPress={() => { if (!result.isFetchingNextPage) void result.fetchNextPage(); }}>{result.isFetchingNextPage ? 'Cargando más…' : 'Cargar más canciones'}</Action>}
    {result.isFetchNextPageError && <Copy>No se pudo cargar la siguiente página. Las canciones anteriores siguen disponibles.</Copy>}
    {source === 'archive' && <Copy>Música con licencias CC0 o CC BY declaradas en Internet Archive. La información y el enlace de atribución acompañan a cada pista.</Copy>}
  </Screen>;
}
