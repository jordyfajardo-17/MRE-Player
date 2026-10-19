import { useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { TrackList } from '../../components/TrackList';
import { Action, Copy, IconButton, Label, Surface } from '../../components/ui';
import { useThemeStore } from '../../theme/theme-store';
import { useLibrary } from '../../music/core/library';
import { importAudio } from '../../music/core/import-audio';
export function LibraryScreen() {
  const { tokens } = useThemeStore(s => s.theme); const library = useLibrary(); const [tab, setTab] = useState('favorites'); const [name, setName] = useState(''); const [notice, setNotice] = useState(''); const [selected, setSelected] = useState('');
  const playlist = library.playlists.find(p => p.id === selected);
  return <Screen title="Todo lo que te mueve." subtitle="Favoritos, playlists y archivos. Guardados en este dispositivo.">
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[['favorites', 'Favoritos'], ['playlists', 'Playlists'], ['local', 'Mis archivos'], ['recent', 'Historial']].map(([key, label]) => <Action key={key} secondary={tab !== key} onPress={() => setTab(key)}>{label}</Action>)}</View>
    {library.notice && <Copy>{library.notice}</Copy>}{!!notice && <Copy>{notice}</Copy>}
    {tab === 'favorites' && <TrackList tracks={library.favorites} />}
    {tab === 'recent' && <TrackList tracks={library.recent} />}
    {tab === 'local' && <><Action onPress={() => { void importAudio().then(tracks => { tracks.forEach(library.addLocal); setNotice(tracks.length ? `${tracks.length} archivos importados.` : ''); }).catch(() => setNotice('No se pudieron importar los archivos. Comprueba el formato y el espacio disponible.')); }}>Importar audio</Action><Copy>{Platform.OS === 'web' ? 'En el navegador, los archivos importados están disponibles durante esta sesión. En Android e iOS se conservan en la app.' : 'Los archivos se copian a la app para que puedas escucharlos sin conexión.'}</Copy><TrackList tracks={library.local} /></>}
    {tab === 'playlists' && <><View style={{ flexDirection: 'row', gap: 10 }}><TextInput accessibilityLabel="Nombre de la playlist" value={name} onChangeText={setName} maxLength={80} placeholder="Nueva playlist" placeholderTextColor={tokens.muted} style={{ flex: 1, color: tokens.text, backgroundColor: tokens.surface, borderRadius: 16, padding: 14 }} /><Action onPress={() => { library.createPlaylist(name); setName(''); }}>Crear</Action></View>
      {library.playlists.map(p => <Surface key={p.id} style={{ padding: 14 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><Label>{p.name}</Label><Copy>{p.tracks.length} {p.tracks.length === 1 ? 'canción' : 'canciones'}</Copy></View><Action secondary onPress={() => setSelected(p.id)}>Abrir</Action><IconButton icon="trash-outline" label={`Eliminar playlist ${p.name}`} onPress={() => { library.deletePlaylist(p.id); if (selected === p.id) setSelected(''); }} /></View></Surface>)}
      {playlist && <><Label>{playlist.name}</Label><TrackList tracks={playlist.tracks} />{playlist.tracks.map(t => <Action secondary key={t.id} onPress={() => library.removeFromPlaylist(playlist.id, t.id)}>Quitar {t.title}</Action>)}<Copy>Añade canciones desde Guardar en el reproductor.</Copy></>}
    </>}
  </Screen>;
}


