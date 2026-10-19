import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { Action, Copy } from '../../components/ui';
import { audiusSource } from '../../music/sources/audius';
import { useLibrary } from '../../music/core/library';
import { useThemeStore } from '../../theme/theme-store';
export function SearchScreen() {
  const [query, setQuery] = useState(''); const [term, setTerm] = useState(''); const [source, setSource] = useState('audius');
  const local = useLibrary(s => s.local); const { tokens } = useThemeStore(s => s.theme);
  useEffect(() => { const timer = setTimeout(() => setTerm(query), 450); return () => clearTimeout(timer); }, [query]);
  const result = useQuery({ queryKey: ['audius', term], queryFn: ({ signal }) => audiusSource.search(term, signal), enabled: source === 'audius' });
  const tracks = source === 'local' ? local.filter(t => `${t.title} ${t.artist}`.toLocaleLowerCase().includes(term.toLocaleLowerCase())) : result.data ?? [];
  return <Screen title="Encuentra tu sonido." subtitle="Canciones y artistas. Explora Audius o busca en tus archivos.">
    <TextInput accessibilityLabel="Buscar canciones o artistas" placeholder="¿Qué quieres escuchar?" placeholderTextColor={tokens.muted} value={query} onChangeText={setQuery} returnKeyType="search" onSubmitEditing={() => setTerm(query)} style={{ backgroundColor: tokens.surface, color: tokens.text, padding: 18, borderRadius: tokens.radiusDp, fontSize: 17 }} />
    <View style={{ flexDirection: 'row', gap: 10 }}><Action secondary={source !== 'audius'} onPress={() => setSource('audius')}>Audius</Action><Action secondary={source !== 'local'} onPress={() => setSource('local')}>Mis archivos</Action></View>
    {source === 'audius' && result.isPending ? <Copy>Buscando música…</Copy> : source === 'audius' && result.isError ? <><Copy>{result.error.message}</Copy><Action onPress={() => void result.refetch()}>Reintentar</Action></> : <><Copy>{tracks.length} canciones {term ? `para “${term}”` : 'para descubrir'}</Copy><TrackList tracks={tracks} /></>}
  </Screen>;
}
