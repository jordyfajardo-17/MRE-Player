import { describe, expect, it, vi, afterEach } from 'vitest';
import { audiusSource, parseAudiusTrack } from './audius';
const fixture = { id: 'abc123', title: 'Test', user: { name: 'Artist' }, duration: 123, is_streamable: true, is_stream_gated: false, artwork: { '480x480': 'https://example.com/art.jpg' } };
afterEach(() => vi.unstubAllGlobals());
describe('Audius provider', () => {
  it('preserves provider identity and uses a renewable stream endpoint', () => {
    const track = parseAudiusTrack(fixture)!;
    expect(track.id).toBe('audius:abc123'); expect(track.artist).toBe('Artist'); expect(track.uri).toContain('/tracks/abc123/stream');
  });
  it('excludes gated, unavailable, malformed and non-streamable tracks', () => {
    for (const input of [null, {}, { ...fixture, is_stream_gated: true }, { ...fixture, is_streamable: false }, { ...fixture, is_available: false }, { ...fixture, id: '../secret' }]) expect(parseAudiusTrack(input)).toBeNull();
  });
  it('encodes queries and filters unsafe tracks', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [fixture, { ...fixture, is_stream_gated: true }] }) }); vi.stubGlobal('fetch', fetcher);
    expect(await audiusSource.search(' jazz & soul ')).toHaveLength(1); expect(fetcher.mock.calls[0][0]).toContain('query=jazz%20%26%20soul');
  });
  it('reports rate limits and malformed responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 })); await expect(audiusSource.search('')).rejects.toThrow('muchas consultas');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })); await expect(audiusSource.search('')).rejects.toThrow('no válida');
  });
});
