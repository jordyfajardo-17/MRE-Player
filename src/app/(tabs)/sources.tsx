import { View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Copy, Label, Surface } from '../../components/ui';
export default function SourcesScreen() {
  return <Screen title="Tus fuentes." subtitle="Cada servicio conserva su catálogo y sus capacidades.">
    {[['Audius', 'Disponible', 'Búsqueda, catálogo y reproducción de pistas públicas habilitadas por sus artistas. Requiere conexión a internet.'], ['Mis archivos', 'Disponible', 'Importa audio desde Biblioteca. Reproducción completa y sin conexión en Android e iOS.'], ['Spotify', 'Pendiente de configurar', 'Necesita una aplicación de desarrollador, autorización y reproducción mediante mecanismos oficiales.'], ['Apple Music', 'Pendiente de configurar', 'Necesita MusicKit, credenciales del desarrollador y una cuenta compatible.'], ['YouTube', 'Pendiente de configurar', 'Necesita configuración de Google y un reproductor de video visible. No se ofrece extracción de audio ni reproducción oculta.']].map(([name, status, description]) => <Surface key={name} style={{ padding: 22 }}><View style={{ gap: 8 }}><Label>{name}</Label><Copy>{status}</Copy><Copy>{description}</Copy></View></Surface>)}
    <Copy>Los favoritos y las playlists de MRE se guardan en este dispositivo; no modifican cuentas externas.</Copy>
  </Screen>;
}
