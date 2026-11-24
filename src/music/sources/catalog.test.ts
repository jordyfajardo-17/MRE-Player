import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchCatalog } from './catalog';
import { sourceRegistry } from './registry';
const a = { id: 'a', providerId: 'audius', title: 'A', artist: 'Artist', durationSeconds: 10 };
const b = { ...a, id: 'b', providerId: 'archive' };
afterEach(() => vi.restoreAllMocks());
describe('catalog federation', () => {
  it('interleaves sources and deduplicates stable IDs', async () => {
    vi.spyOn(sourceRegistry.get('audius'), 'search').mockResolvedValue([a, a]);
    vi.spyOn(sourceRegistry.get('archive'), 'search').mockResolvedValue([b]);
    expect((await searchCatalog('all', '')).tracks.map(t => t.id)).toEqual(['a', 'b']);
  });
  it('preserves working results and reports partial failure', async () => {
    vi.spyOn(sourceRegistry.get('audius'), 'search').mockRejectedValue(new Error('offline'));
    vi.spyOn(sourceRegistry.get('archive'), 'search').mockResolvedValue([b]);
    const result = await searchCatalog('all', ''); expect(result.tracks).toEqual([b]); expect(result.notices[0]).toContain('Audius');
  });
  it('reports total failure instead of disguising it as an empty catalog', async () => {
    vi.spyOn(sourceRegistry.get('audius'), 'search').mockRejectedValue(new Error('offline'));
    await expect(searchCatalog('audius', '')).rejects.toThrow('offline');
  });
});
