import { layouts, navigations, parseTheme, players, surfaces, themePresets, type MusicTheme } from '@mre/theme-core';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Action, Copy, Label, Surface } from '../../components/ui';
import { useThemeStore } from '../../theme/theme-store';
const descriptions = ['Listas compactas, negro profundo y acento verde. Inspiración Spotify.', 'Carátulas protagonistas, cápsula flotante y cristal nativo compatible. Inspiración Apple Music.', 'Superficies cálidas y reproductor inmersivo. Inspiración YouTube Music.'];
export function ThemesScreen() {
  const { theme, apply } = useThemeStore(); const [json, setJson] = useState(''); const [notice, setNotice] = useState(''); const [previous, setPrevious] = useState<MusicTheme | null>(null); const { tokens } = theme;
  const change = (next: MusicTheme) => { if (!previous) setPrevious(theme); useThemeStore.setState({ theme: next }); setNotice('Vista previa. Guarda para conservarla.'); };
  const component = <K extends keyof MusicTheme['components']>(key: K, value: MusicTheme['components'][K]) => change({ ...theme, id: 'mre.personal', name: 'Mi combinación', components: { ...theme.components, [key]: value } });
  return <Screen title="Hazlo tuyo." subtitle="Tres puntos de partida. Una experiencia que lleva tu estilo.">
    {themePresets.map((preset, i) => <Pressable key={preset.id} accessibilityRole="button" accessibilityLabel={`Previsualizar ${preset.name}`} accessibilityState={{ selected: theme.id === preset.id }} onPress={() => change(preset)} style={{ padding: 22, borderRadius: 26, backgroundColor: preset.tokens.surface, borderWidth: 2, borderColor: theme.id === preset.id ? preset.tokens.accent : '#FFFFFF12', gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>{[preset.tokens.accent, preset.tokens.background, preset.tokens.muted].map(color => <View key={color} style={{ width: 38, height: 38, backgroundColor: color, borderRadius: 14, borderWidth: 1, borderColor: '#FFFFFF20' }} />)}</View>
      <Text style={{ color: preset.tokens.text, fontSize: 24, fontWeight: '700' }}>{preset.name}</Text><Text style={{ color: preset.tokens.muted, lineHeight: 21 }}>{descriptions[i]}</Text>
    </Pressable>)}
    {previous && <Surface style={{ padding: 18, gap: 12 }}><Label>Prueba tu combinación</Label><Copy>El audio sigue sonando mientras cambias la apariencia.</Copy><Action onPress={() => { void apply(theme); setPrevious(null); setNotice('Apariencia guardada.'); }}>Guardar apariencia</Action><Action secondary onPress={() => { useThemeStore.setState({ theme: previous }); setPrevious(null); setNotice('Vista previa cancelada.'); }}>Cancelar vista previa</Action></Surface>}
    <Label>Combina componentes</Label>
    {([{ key: 'layout', name: 'Estructura', values: layouts, labels: ['Compacta', 'Densa', 'Carátulas'] }, { key: 'surface', name: 'Material', values: surfaces, labels: ['Plano', 'Cristal', 'Liquid Glass'] }, { key: 'navigation', name: 'Navegación', values: navigations, labels: ['Barra', 'Cápsula'] }, { key: 'player', name: 'Reproductor', values: players, labels: ['Minimal', 'Carátula', 'Inmersivo'] }] as const).map(group => <View key={group.key} style={{ gap: 10 }}><Copy>{group.name}</Copy><View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{group.values.map((value, i) => <Action secondary={theme.components[group.key] !== value} key={value} onPress={() => component(group.key, value)}>{group.labels[i]}</Action>)}</View></View>)}
    <Label>Acento</Label><View style={{ flexDirection: 'row', gap: 8 }}>{['#6AE4AC', '#ADC8FF', '#FDBD91', '#F8A4CC', '#D0B5FF'].map(color => <Pressable key={color} accessibilityRole="button" accessibilityLabel={`Acento ${color}`} onPress={() => change({ ...theme, tokens: { ...tokens, accent: color } })} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: color, borderWidth: 3, borderColor: tokens.accent === color ? tokens.text : tokens.background }} />)}</View>
    <Label>Importar desde Studio</Label><TextInput accessibilityLabel="JSON del tema" multiline value={json} onChangeText={setJson} maxLength={65537} placeholder="Pega tu .mmetheme.json" placeholderTextColor={tokens.muted} style={{ minHeight: 130, padding: 16, color: tokens.text, backgroundColor: tokens.surface, borderRadius: tokens.radiusDp, textAlignVertical: 'top' }} />
    <Action secondary onPress={() => { try { change(parseTheme(json)); } catch (error) { setNotice(error instanceof Error ? error.message : 'Tema no válido.'); } }}>Validar y previsualizar</Action>
    {!!notice && <Text accessibilityRole="alert" style={{ color: tokens.text }}>{notice}</Text>}
    <Copy>Diseños independientes, sin afiliación con las marcas de referencia. Los materiales se adaptan al dispositivo y a la preferencia de reducir transparencia.</Copy>
  </Screen>;
}
