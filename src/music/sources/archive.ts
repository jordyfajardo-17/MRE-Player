import type { MusicSource, Track } from '../core/types';
import { fetchSourceJson } from './http';

const ORIGIN = 'https://archive.org';
const LICENSES = [
  'https://creativecommons.org/publicdomain/zero/1.0/',
  'http://creativecommons.org/publicdomain/zero/1.0/',
  'https://creativecommons.org/licenses/by/4.0/',
  'http://creativecommons.org/licenses/by/4.0/',
];
const object = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
const first = (value: unknown): string => typeof value === 'string' ? value : Array.isArray(value) ? value.filter(v => typeof v === 'string').join(', ') : '';

export function archiveSearchUrl(query: string, page = 1): string {
  // Keep user text inside quoted search terms; it cannot alter the license filter.
  const words = query.slice(0, 120).replace(/[^\p{L}\p{N}\s'-]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 12);
  const licenses = LICENSES.map(license => `licenseurl:"${license}"`).join(' OR ');
  const q = `mediatype:audio AND (subject:music OR subject:musica) AND (${licenses})${words.length ? ` AND (${words.map(word => `"${word}"`).join(' AND ')})` : ''}`;
  const params = new URLSearchParams({ q, output: 'json', rows: '6', page: String(Math.max(1, Math.floor(page))), 'fl[]': 'identifier', sort: 'downloads desc' });
  return `${ORIGIN}/advancedsearch.php?${params}`;
}

function duration(value: unknown): number {
  const parts = String(value ?? '').split(':');
  const result = parts.reduce((total, part) => total * 60 + Number(part), 0);
  return Number.isFinite(result) && result > 0 ? result : 0;
}

export function parseArchiveItem(value: unknown): Track[] {
  const item = object(value);
  const metadata = object(item?.metadata);
  const id = first(metadata?.identifier);
  const declared = metadata?.licenseurl;
  const license = (Array.isArray(declared) ? declared : [declared]).find(v => typeof v === 'string' && LICENSES.includes(v));
  const restricted = metadata?.['access-restricted-item'];
  if (!item || !metadata || metadata.mediatype !== 'audio' || !/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(id) || !license || item.is_dark === true || restricted === true || restricted === 'true' || !Array.isArray(item.files)) return [];
  const seen = new Set<string>();
  const tracks: Track[] = [];
  for (const value of item.files) {
    const file = object(value);
    const name = typeof file?.name === 'string' ? file.name : '';
    if (!file || !/\.mp3$/i.test(name) || name.length > 500 || /[\\\u0000-\u001f]/.test(name) || name.split('/').some(part => part === '..' || part === '.') || (file.private !== undefined && file.private !== false && file.private !== 'false')) continue;
    // Prefer one MP3 representation of each original file, rather than listing every bitrate.
    const original = first(file.original) || name.replace(/_(64kb|128kb|vbr)\.mp3$/i, '');
    if (seen.has(original)) continue;
    seen.add(original);
    tracks.push({
      id: `archive:${id}:${encodeURIComponent(name)}`, providerId: 'archive',
      title: first(file.title) || name.replace(/\.mp3$/i, '').replace(/_/g, ' '),
      artist: first(file.creator) || first(metadata.creator) || 'Artista del archivo',
      durationSeconds: duration(file.length),
      artwork: `${ORIGIN}/services/img/${encodeURIComponent(id)}`,
      uri: `${ORIGIN}/download/${encodeURIComponent(id)}/${name.split('/').map(encodeURIComponent).join('/')}`,
      url: `${ORIGIN}/details/${encodeURIComponent(id)}`,
      licenseUrl: license, licenseLabel: license.includes('/zero/') ? 'CC0 declarada' : 'CC BY 4.0 declarada',
      genre: first(metadata.subject).split(/[;,]/)[0] || 'Archivo abierto',
    });
    if (tracks.length === 6) break;
  }
  return tracks;
}

export const archiveSource: MusicSource = {
  id: 'archive', name: 'Archivo abierto',
  capabilities: { search: true, playlists: false, playback: true, backgroundPlayback: true },
  async search(query, signal, options) {
    const response = object(await fetchSourceJson(archiveSearchUrl(query, options?.page), signal));
    const results = object(response?.response);
    if (!results || !Array.isArray(results.docs)) throw new Error('El archivo devolvió una respuesta no válida.');
    const ids = results.docs.map(object).map(doc => doc?.identifier).filter((id): id is string => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(id));
    const tracks: Track[][] = new Array(ids.length);
    let cursor = 0;
    let failed = 0;
    // Three workers bound request fan-out. Failure of an album does not discard other albums.
    await Promise.all(Array.from({ length: Math.min(3, ids.length) }, async () => {
      while (cursor < ids.length) {
        if (signal?.aborted) throw new Error('Consulta cancelada.');
        const index = cursor++;
        try { tracks[index] = parseArchiveItem(await fetchSourceJson(`${ORIGIN}/metadata/${encodeURIComponent(ids[index])}`, signal)); }
        catch (error) { if (signal?.aborted) throw error; failed++; tracks[index] = []; }
      }
    }));
    if (ids.length && failed === ids.length) throw new Error('No se pudieron cargar las pistas del archivo. Vuelve a intentar.');
    return tracks.flat();
  },
};
