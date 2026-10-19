import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Track } from '../core/types';
export interface Playlist { id: string; name: string; tracks: Track[]; }
interface LibraryState {
  favorites: Track[]; recent: Track[]; local: Track[]; playlists: Playlist[]; notice: string | null;
  favorite(t: Track): void; remember(t: Track): void; addLocal(t: Track): void;
  createPlaylist(name: string): void; deletePlaylist(id: string): void; addToPlaylist(id: string, t: Track): void; removeFromPlaylist(id: string, key: string): void;
}
export const useLibrary = create<LibraryState>()(persist((set) => ({
  favorites: [], recent: [], local: [], playlists: [], notice: null,
  favorite: (t) => set(s => ({ favorites: s.favorites.some(x => x.id === t.id) ? s.favorites.filter(x => x.id !== t.id) : [t, ...s.favorites] })),
  remember: (t) => set(s => ({ recent: [t, ...s.recent.filter(x => x.id !== t.id)].slice(0, 40) })),
  addLocal: (t) => set(s => ({ local: [t, ...s.local.filter(x => x.id !== t.id)] })),
  createPlaylist: (name) => { if (name.trim()) set(s => ({ playlists: [...s.playlists, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: name.trim().slice(0, 80), tracks: [] }] })); },
  deletePlaylist: (id) => set(s => ({ playlists: s.playlists.filter(p => p.id !== id) })),
  addToPlaylist: (id, t) => set(s => ({ playlists: s.playlists.map(p => p.id === id && !p.tracks.some(x => x.id === t.id) ? { ...p, tracks: [...p.tracks, t] } : p) })),
  removeFromPlaylist: (id, key) => set(s => ({ playlists: s.playlists.map(p => p.id === id ? { ...p, tracks: p.tracks.filter(t => t.id !== key) } : p) })),
}), { name: 'mre-library-v1', storage: createJSONStorage(() => AsyncStorage), partialize: s => ({ favorites: s.favorites.filter(t => !t.uri?.startsWith('blob:')), recent: s.recent.filter(t => !t.uri?.startsWith('blob:')), local: s.local.filter(t => !t.uri?.startsWith('blob:')), playlists: s.playlists.map(p => ({ ...p, tracks: p.tracks.filter(t => !t.uri?.startsWith('blob:')) })) }), onRehydrateStorage: () => (_state, error) => { if (error) setTimeout(() => useLibrary.setState({ notice: 'No se pudo recuperar la biblioteca guardada.' }), 0); } }));
