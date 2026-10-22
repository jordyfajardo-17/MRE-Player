import { afterEach, describe, expect, it, vi } from 'vitest';
import { archiveSearchUrl, archiveSource, parseArchiveItem } from './archive';
const item = { metadata: { identifier: 'open-music', mediatype: 'audio', creator: 'Original Artist', licenseurl: 'https://creativecommons.org/licenses/by/4.0/' }, files: [
  { name: 'Song.mp3', title: 'Song', length: '03:12.5' },
  { name: 'Song_64kb.mp3', original: 'Song.mp3' },
  { name: 'private.mp3', private: 'true' }, { name: '../secret.mp3' }, { name: 'text.pdf' },
] };
afterEach(() => vi.unstubAllGlobals());
describe('open archive source', () => {
  it('keeps attribution and stable links while excluding private, duplicate and unsafe files', () => {
    const tracks = parseArchiveItem(item);
    expect(tracks).toHaveLength(1); expect(tracks[0].artist).toBe('Original Artist');
    expect(tracks[0].durationSeconds).toBe(192.5); expect(tracks[0].licenseUrl).toContain('/by/4.0/');
    expect(tracks[0].uri).toBe('https://archive.org/download/open-music/Song.mp3');
  });
  it('rejects missing or unsupported license declarations and dark items', () => {
    for (const value of [null, {}, { ...item, is_dark: true }, { ...item, metadata: { ...item.metadata, 'access-restricted-item': 'true' } }, { ...item, metadata: { ...item.metadata, licenseurl: 'all rights reserved' } }, { ...item, metadata: { ...item.metadata, mediatype: 'movies' } }]) expect(parseArchiveItem(value)).toEqual([]);
  });
  it('prevents user search syntax from overriding the license filter and paginates albums', () => {
    const url = new URL(archiveSearchUrl('jazz OR licenseurl:* / ()', 2));
    expect(url.searchParams.get('q')).toContain('licenseurl:"https://creativecommons.org/publicdomain/zero/1.0/"');
    expect(url.searchParams.get('q')).not.toContain('licenseurl:*');
    expect(url.searchParams.get('page')).toBe('2');
  });
  it('keeps other playable albums if a metadata request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (url: string) => ({ ok: !url.endsWith('/broken'), status: 500, json: async () => url.includes('advancedsearch') ? { response: { docs: [{ identifier: 'broken' }, { identifier: 'good' }] } } : item })));
    expect(await archiveSource.search('')).toHaveLength(1);
  });
});
