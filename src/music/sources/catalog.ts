import type { Track } from '../core/types';
import { sourceRegistry } from './registry';

export type CatalogSource = 'all' | 'audius' | 'archive';
export const sourceLabels: Record<string, string> = { audius: 'Audius', archive: 'Archivo abierto', local: 'Mis archivos', demo: 'Demostración' };
export interface CatalogPage { tracks: Track[]; notices: string[]; }
export async function searchCatalog(source: CatalogSource, query: string, page = 1, signal?: AbortSignal): Promise<CatalogPage> {
  const ids = source === 'all' ? ['audius', 'archive'] : [source];
  const results = await Promise.allSettled(ids.map(id => sourceRegistry.get(id).search(query, signal, { page })));
  if (signal?.aborted) throw new Error('Consulta cancelada.');
  const notices: string[] = [];
  const lists: Track[][] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') lists.push(result.value);
    else notices.push(`${sourceLabels[ids[index]]}: ${result.reason instanceof Error ? result.reason.message : 'No disponible en este momento.'}`);
  });
  if (!lists.length) throw new Error(notices.join('\n'));
  const tracks: Track[] = [];
  const seen = new Set<string>();
  // Interleave catalogs so the second source is visible even when Audius returns 40 results.
  for (let i = 0; i < Math.max(0, ...lists.map(list => list.length)); i++) {
    for (const list of lists) { const track = list[i]; if (track && !seen.has(track.id)) { tracks.push(track); seen.add(track.id); } }
  }
  return { tracks, notices };
}
