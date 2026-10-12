import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { sourceRegistry } from '../../music/sources/registry';
import { useThemeStore } from '../../theme/theme-store';
export function SearchScreen() {
  const [query, setQuery] = useState('');
  const { tokens } = useThemeStore((state) => state.theme);
  const { data, isPending, isError } = useQuery({ queryKey: ['tracks','demo',query], queryFn: () => sourceRegistry.get('demo').search(query) });
  return <Screen title="Buscar" subtitle="Busca por título o artista en el catálogo de demostración.">
    <TextInput accessibilityLabel="Buscar pistas" placeholder="Título o artista" placeholderTextColor={tokens.muted} value={query} onChangeText={setQuery}
      style={{ backgroundColor: tokens.surface, color: tokens.text, padding: 16, borderRadius: tokens.radiusDp }} />
    {isError ? <Text style={{ color: tokens.text }}>No se pudo consultar la fuente.</Text> : isPending ? <Text style={{ color: tokens.muted }}>Buscando…</Text> : <TrackList tracks={data ?? []} />}
  </Screen>;
}
