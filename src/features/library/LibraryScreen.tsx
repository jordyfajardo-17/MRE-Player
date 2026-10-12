import { Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { useThemeStore } from '../../theme/theme-store';
export function LibraryScreen() {
  const { tokens } = useThemeStore((state) => state.theme);
  return <Screen title="Tu biblioteca" subtitle="Tus playlists permanecerán vinculadas a su proveedor de origen.">
    <Text style={{ color: tokens.text, fontSize: 20 }}>Todavía no hay cuentas conectadas</Text>
    {['Google / YouTube','Spotify','Apple Music'].map((name) => <View key={name} style={{ padding: 20, borderRadius: tokens.radiusDp, backgroundColor: tokens.surface, gap: 8 }}>
      <Text style={{ color: tokens.text, fontWeight: '600' }}>{name}</Text>
      <Text style={{ color: tokens.muted }}>Integración prevista · requiere configurar OAuth y validar la reproducción.</Text>
    </View>)}
  </Screen>;
}
