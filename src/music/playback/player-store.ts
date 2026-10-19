import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';
import { create } from 'zustand';
import type { Track } from '../core/types';
import { useLibrary } from '../core/library';
import { nextIndex } from './queue';
interface PlayerState {
  track: Track | null; queue: Track[]; index: number; playing: boolean; loading: boolean; position: number; duration: number; error: string | null; repeat: 'off' | 'all' | 'one'; shuffle: boolean; volume: number; sleepAt: number | null;
  play(t: Track, queue?: Track[]): void; toggle(): void; seek(seconds: number): void; next(auto?: boolean): void; previous(): void; enqueue(t: Track): void; remove(index: number): void; move(index: number, direction: number): void; setVolume(v: number): void; sleep(minutes: number): void;
}
let engine: AudioPlayer | undefined;
let subscription: { remove(): void } | undefined;
let loadTimer: ReturnType<typeof setTimeout> | undefined;
let sleepTimer: ReturnType<typeof setTimeout> | undefined;
let generation = 0;
function dispose() { subscription?.remove(); subscription = undefined; engine?.pause(); engine?.release(); engine = undefined; clearTimeout(loadTimer); }
export const usePlayer = create<PlayerState>((set, get) => ({
  track: null, queue: [], index: 0, playing: false, loading: false, position: 0, duration: 0, error: null, repeat: 'off', shuffle: false, volume: 1, sleepAt: null,
  play: (track, input) => {
    if (!track.uri) { set({ error: 'Esta pista no tiene reproducción disponible.' }); return; }
    const current = ++generation;
    dispose();
    const queue = input?.filter(t => !!t.uri) ?? (get().queue.some(t => t.id === track.id) ? get().queue : [track]);
    set({ track, queue, index: queue.findIndex(t => t.id === track.id), loading: true, playing: false, position: 0, duration: track.durationSeconds, error: null });
    try {
      engine = createAudioPlayer({ uri: track.uri }, { updateInterval: 500 });
      engine.volume = get().volume;
      subscription = engine.addListener('playbackStatusUpdate', status => {
        if (current !== generation) return;
        if (status.error) { clearTimeout(loadTimer); set({ playing: false, loading: false, error: 'El audio no está disponible. Intenta otra pista o vuelve a cargar.' }); return; }
        if (status.isLoaded) clearTimeout(loadTimer);
        set({ playing: status.playing, loading: !status.isLoaded || status.isBuffering, position: status.currentTime, duration: status.duration || track.durationSeconds });
        if (status.didJustFinish) get().next(true);
      });
      loadTimer = setTimeout(() => { if (current === generation && get().loading) { engine?.pause(); set({ loading: false, playing: false, error: 'No se pudo cargar el audio. Comprueba tu conexión y vuelve a intentar.' }); } }, 20000);
      if (Platform.OS !== 'web') {
        void setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true, interruptionMode: 'doNotMix' }).catch(() => set({ error: 'No se pudo configurar el audio de fondo.' }));
        engine.setActiveForLockScreen(true, { title: track.title, artist: track.artist, artworkUrl: track.artwork });
      }
      engine.play(); useLibrary.getState().remember(track);
    } catch { set({ loading: false, error: 'No se pudo reproducir esta pista. Intenta otra vez.' }); }
  },
  toggle: () => { try { if (get().error && get().track) { get().play(get().track!); return; } if (engine?.playing) engine.pause(); else if (engine) { if (get().position >= get().duration && get().duration > 0) void engine.seekTo(0); engine.play(); } } catch { set({ error: 'No se pudo iniciar la reproducción.' }); } },
  seek: seconds => { if (engine) void engine.seekTo(Math.max(0, Math.min(seconds, get().duration))).catch(() => set({ error: 'No se pudo cambiar la posición.' })); },
  next: (auto = false) => { const s = get(); const index = nextIndex(s.index, s.queue.length, auto ? s.repeat : s.repeat === 'one' ? 'all' : s.repeat, s.shuffle); if (index === null) { engine?.pause(); set({ playing: false }); } else s.play(s.queue[index], s.queue); },
  previous: () => { const s = get(); if (s.position > 3) s.seek(0); else if (s.index > 0) s.play(s.queue[s.index - 1], s.queue); else s.seek(0); },
  enqueue: t => { if (t.uri) set(s => ({ queue: s.queue.some(x => x.id === t.id) ? s.queue : [...s.queue, t] })); },
  remove: index => set(s => index === s.index ? {} : ({ queue: s.queue.filter((_, i) => i !== index), index: index < s.index ? s.index - 1 : s.index })),
  move: (index, direction) => set(s => { const target = index + direction; if (target < 0 || target >= s.queue.length) return {}; const queue = [...s.queue]; [queue[index], queue[target]] = [queue[target], queue[index]]; return { queue, index: s.index === index ? target : s.index === target ? index : s.index }; }),
  setVolume: volume => { if (engine) engine.volume = volume; set({ volume }); },
  sleep: minutes => { clearTimeout(sleepTimer); set({ sleepAt: minutes ? Date.now() + minutes * 60000 : null }); if (minutes) sleepTimer = setTimeout(() => { engine?.pause(); set({ sleepAt: null, playing: false }); }, minutes * 60000); },
}));
export function releasePlayer() { generation++; dispose(); clearTimeout(sleepTimer); }


