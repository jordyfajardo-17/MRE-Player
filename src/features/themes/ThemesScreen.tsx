import { parseTheme, themePresets } from '@mre/theme-core';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { useThemeStore } from '../../theme/theme-store';
export function ThemesScreen() {
  const { theme, apply } = useThemeStore();
  const [json, setJson] = useState(''); const [notice, setNotice] = useState('');
  const { tokens } = theme;
  const importTheme = () => {
    try { const parsed = parseTheme(json); void apply(parsed); setNotice(`Tema aplicado: ${parsed.name}`); }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Tema no válido.'); }
  };
  return <Screen title="Tu identidad visual" subtitle="Elige un preset o importa el JSON exportado desde MRE Studio.">
    {themePresets.map((preset) => <Pressable key={preset.id} accessibilityRole="button" accessibilityState={{ selected: preset.id === theme.id }} onPress={() => { void apply(preset); setNotice(''); }}
      style={{ padding: 20, backgroundColor: tokens.surface, borderRadius: preset.tokens.radiusDp, borderWidth: 1, borderColor: theme.id === preset.id ? preset.tokens.accent : tokens.surface, gap: 8 }}>
      <Text style={{ color: preset.tokens.accent, fontSize: 20, fontWeight: '600' }}>{preset.name}</Text>
      <Text style={{ color: tokens.muted }}>{preset.id === theme.id ? 'Aplicado' : 'Toca para aplicar'} · {preset.components.layout}</Text>
    </Pressable>)}
    <View style={{ gap: 12 }}>
      <Text style={{ color: tokens.text, fontSize: 20 }}>Importar tema</Text>
      <TextInput accessibilityLabel="JSON del tema" multiline value={json} onChangeText={setJson} maxLength={65_537} placeholder="Pega el contenido de un .mmetheme.json" placeholderTextColor={tokens.muted}
        style={{ minHeight: 140, padding: 16, color: tokens.text, backgroundColor: tokens.surface, borderRadius: tokens.radiusDp, textAlignVertical: 'top' }} />
      <Pressable accessibilityRole="button" onPress={importTheme} style={{ padding: 16, minHeight: 48, borderRadius: tokens.radiusDp, backgroundColor: tokens.accent }}><Text style={{ color: tokens.background, fontWeight: '700' }}>Validar y aplicar</Text></Pressable>
      {!!notice && <Text accessibilityRole="alert" style={{ color: tokens.text }}>{notice}</Text>}
    </View>
    <Text style={{ color: tokens.muted, lineHeight: 22 }}>La tienda llegará en otra etapa. Esta base aplica colores, densidad, radio y navegación; los efectos glass y variantes de reproductor se implementarán después.</Text>
  </Screen>;
}
