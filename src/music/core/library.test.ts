import { useLibrary } from './library';
import { afterEach, describe, expect, it, vi } from 'vitest';
const storage = vi.hoisted(() => new Map<string, string>());
vi.mock('@react-native-async-storage/async-storage', () => ({ default: { getItem: vi.fn(async (k: string) => storage.get(k) ?? null), setItem: vi.fn(async (k: string, v: string) => { storage.set(k, v); }), removeItem: vi.fn(async (k: string) => { storage.delete(k); }) } }));
const track = { id: 'audius:a', providerId: 'audius', title: 'Song', artist: 'Artist', durationSeconds: 30, uri: 'https://example.com/a.mp3' };
afterEach(() => useLibrary.setState({ favorites: [], recent: [], local: [], playlists: [] }));
describe('local library', () => {
  it('toggles favorites and deduplicates history', () => { const s = useLibrary.getState(); s.favorite(track); expect(useLibrary.getState().favorites).toHaveLength(1); s.favorite(track); expect(useLibrary.getState().favorites).toHaveLength(0); s.remember(track); s.remember(track); expect(useLibrary.getState().recent).toHaveLength(1); });
  it('creates playlists and adds a track only once', () => { const s = useLibrary.getState(); s.createPlaylist('  Jazz  '); const id = useLibrary.getState().playlists[0].id; s.addToPlaylist(id, track); s.addToPlaylist(id, track); expect(useLibrary.getState().playlists[0]).toMatchObject({ name: 'Jazz', tracks: [track] }); s.removeFromPlaylist(id, track.id); expect(useLibrary.getState().playlists[0].tracks).toEqual([]); s.deletePlaylist(id); expect(useLibrary.getState().playlists).toEqual([]); });
  it('does not persist browser blob URLs', async () => { useLibrary.getState().addLocal({ ...track, providerId: 'local', uri: 'blob:session-only' }); await Promise.resolve(); const data = storage.get('mre-library-v1')!; expect(JSON.parse(data).state.local).toEqual([]); });
});

