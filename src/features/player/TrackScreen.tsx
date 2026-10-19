import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Share, Text, View, useWindowDimensions } from 'react-native';
import { Screen } from '../../components/Screen';
import { Action, Artwork, Copy, IconButton, Label, Surface, time } from '../../components/ui';
import { usePlayer } from '../../music/playback/player-store';
import { useLibrary } from '../../music/core/library';
import { useThemeStore } from '../../theme/theme-store';
export function TrackScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const p = usePlayer(); const library = useLibrary();
  const { tokens, components } = useThemeStore(s => s.theme); const { width } = useWindowDimensions(); const [panel, setPanel] = useState('queue'); const [notice, setNotice] = useState('');
  const track = p.track?.id === id ? p.track : [...library.recent, ...library.favorites, ...library.local, ...p.queue].find(t => t.id === id);
  if (!track) return <Screen title="Pista no disponible" subtitle="Busca una canción en el catálogo para escucharla."><Copy>La pista no está en esta sesión.</Copy></Screen>;
  if (p.track?.id !== track.id) return <Screen title={track.title} subtitle={track.artist}><Artwork track={track} size={Math.min(width - 48, 340)} /><Action onPress={() => p.play(track)}>Reproducir</Action></Screen>;
  const liked = library.favorites.some(t => t.id === track.id); const size = Math.min(width - 64, components.player === 'minimal' ? 170 : components.player === 'immersive' ? 390 : 310);
  return <Screen title="Ahora suena" subtitle={`${track.providerId === 'local' ? 'TU ARCHIVO' : 'AUDIUS'} · ${track.genre ?? 'Tu selección'}`}>
    <Surface style={{ padding: components.player === 'immersive' ? 8 : 20, alignItems: 'center', alignSelf: 'center' }}><Artwork track={track} size={size} /></Surface>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}><View style={{ flex: 1, gap: 6 }}><Label>{track.title}</Label><Copy>{track.artist}</Copy></View><IconButton icon={liked ? 'heart' : 'heart-outline'} label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'} active={liked} onPress={() => library.favorite(track)} /></View>
    <View><Slider accessibilityLabel="Posición de reproducción" minimumValue={0} maximumValue={p.duration || 1} value={Math.min(p.position, p.duration)} onSlidingComplete={p.seek} minimumTrackTintColor={tokens.accent} maximumTrackTintColor={tokens.surface} thumbTintColor={tokens.text} /><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Copy>{time(p.position)}</Copy><Copy>{time(p.duration)}</Copy></View></View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
      <IconButton icon="shuffle" label="Reproducción aleatoria" active={p.shuffle} onPress={() => usePlayer.setState({ shuffle: !p.shuffle })} />
      <IconButton icon="play-skip-back" label="Anterior" size={30} onPress={p.previous} />
      <View style={{ backgroundColor: tokens.accent, borderRadius: 42, padding: 10 }}><IconButton icon={p.playing ? 'pause' : 'play'} label={p.playing ? 'Pausar' : 'Reproducir'} size={36} onPress={p.toggle} /></View>
      <IconButton icon="play-skip-forward" label="Siguiente" size={30} onPress={() => p.next()} />
      <View><IconButton icon="repeat" label={`Repetir: ${p.repeat}`} active={p.repeat !== 'off'} onPress={() => usePlayer.setState({ repeat: p.repeat === 'off' ? 'all' : p.repeat === 'all' ? 'one' : 'off' })} />{p.repeat === 'one' && <Text style={{ color: tokens.accent, textAlign: 'center' }}>1</Text>}</View>
    </View>
    {p.loading && <Copy>Cargando audio…</Copy>}{p.error && <><Text accessibilityRole="alert" style={{ color: tokens.text }}>{p.error}</Text><Action onPress={() => p.play(track)}>Reintentar audio</Action></>}
    <View style={{ flexDirection: 'row', alignItems: 'center' }}><IconButton icon="volume-low" label="Silenciar" onPress={() => p.setVolume(0)} /><Slider style={{ flex: 1 }} accessibilityLabel="Volumen" minimumValue={0} maximumValue={1} value={p.volume} onValueChange={p.setVolume} minimumTrackTintColor={tokens.accent} thumbTintColor={tokens.text} /><IconButton icon="volume-high" label="Volumen máximo" onPress={() => p.setVolume(1)} /></View>
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>{[['queue', 'Cola'], ['playlist', 'Guardar'], ['sleep', 'Temporizador'], ['info', 'Información']].map(([key, name]) => <Action key={key} secondary={panel !== key} onPress={() => setPanel(key)}>{name}</Action>)}</View>
    {panel === 'queue' && <><Label>A continuación · {p.queue.length}</Label>{p.queue.map((t, index) => <Surface key={`${t.id}-${index}`} style={{ padding: 10 }}><View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ flex: 1 }}><Text numberOfLines={1} style={{ color: index === p.index ? tokens.accent : tokens.text }}>{index + 1}. {t.title}</Text><Copy>{t.artist}</Copy></View><IconButton icon="play" label={`Escuchar ${t.title}`} onPress={() => p.play(t, p.queue)} /><IconButton icon="arrow-up" label={`Subir ${t.title}`} onPress={() => p.move(index, -1)} />{index !== p.index && <IconButton icon="close" label={`Quitar ${t.title}`} onPress={() => p.remove(index)} />}</View></Surface>)}</>}
    {panel === 'playlist' && <><Label>Guardar en playlist</Label>{!library.playlists.length && <Copy>Crea una playlist en Biblioteca y vuelve aquí para añadir canciones.</Copy>}{library.playlists.map(list => <Action secondary key={list.id} onPress={() => { library.addToPlaylist(list.id, track); setNotice(`Guardada en ${list.name}`); }}>{list.name}</Action>)}{!!notice && <Copy>{notice}</Copy>}</>}
    {panel === 'sleep' && <><Label>Duerme con música</Label><Copy>{p.sleepAt ? `Se pausará a las ${new Date(p.sleepAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Pausa automática desactivada'}</Copy>{[15, 30, 60, 0].map(m => <Action secondary key={m} onPress={() => p.sleep(m)}>{m ? `${m} minutos` : 'Desactivar'}</Action>)}</>}
    {panel === 'info' && <><Copy>Las letras no están disponibles en esta fuente.</Copy>{track.url && <><Action secondary onPress={() => void Linking.openURL(track.url!).catch(() => setNotice('No se pudo abrir el enlace.'))}>Ver artista y canción en Audius</Action><Action secondary onPress={() => void Share.share({ message: `${track.title} — ${track.artist}\n${track.url}` }).catch(() => setNotice('No se pudo compartir.'))}>Compartir canción</Action></>}{!!notice && <Copy>{notice}</Copy>}</>}
  </Screen>;
}
