import type { MusicSource, Track } from '../core/types';
export const AUDIUS_API = 'https://discoveryprovider.audius.co/v1';
export function parseAudiusTrack(value: unknown): Track | null {
  if (!value || typeof value !== 'object') return null;
  const t = value as Record<string, unknown>;
  const u = t.user as Record<string, unknown> | undefined;
  if (typeof t.id !== 'string' || !/^[a-zA-Z0-9]+$/.test(t.id) || typeof t.title !== 'string' || typeof u?.name !== 'string' || t.is_streamable !== true || t.is_stream_gated === true || t.is_available === false) return null;
  const art = t.artwork as Record<string, unknown> | undefined;
  const artwork = art?.['480x480'];
  return { id: `audius:${t.id}`, providerId: 'audius', title: t.title, artist: u.name,
    durationSeconds: typeof t.duration === 'number' && Number.isFinite(t.duration) ? Math.max(0, t.duration) : 0,
    artwork: typeof artwork === 'string' && artwork.startsWith('https://') ? artwork : undefined,
    uri: `${AUDIUS_API}/tracks/${t.id}/stream?app_name=MREPlayer`,
    url: typeof t.permalink === 'string' && t.permalink.startsWith('/') ? `https://audius.co${t.permalink}` : undefined,
    genre: typeof t.genre === 'string' ? t.genre : undefined };
}
export const audiusSource: MusicSource = {
  id: 'audius', name: 'Audius', capabilities: { search: true, playlists: false, playback: true, backgroundPlayback: true },
  async search(query, signal) {
    const path = query.trim() ? `/tracks/search?query=${encodeURIComponent(query.trim())}` : '/tracks/trending?time=week';
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (signal?.aborted) cancel();
    signal?.addEventListener('abort', cancel);
    const timeout = setTimeout(cancel, 15000);
    try {
    const response = await fetch(`${AUDIUS_API}${path}&limit=40&app_name=MREPlayer`, { signal: controller.signal });
    if (!response.ok) throw new Error(response.status === 429 ? 'Audius está recibiendo muchas consultas. Intenta más tarde.' : 'No se pudo consultar Audius. Intenta de nuevo.');
    const body: unknown = await response.json();
    if (!body || typeof body !== 'object' || !('data' in body) || !Array.isArray(body.data)) throw new Error('La fuente devolvió una respuesta no válida.');
    return body.data.map(parseAudiusTrack).filter((t): t is Track => t !== null);
    } finally { clearTimeout(timeout); signal?.removeEventListener('abort', cancel); }
  },
};
