export interface Track { id: string; providerId: string; title: string; artist: string; durationSeconds: number; artwork?: string; uri?: string; url?: string; genre?: string; }
export interface SourceCapabilities { search: boolean; playlists: boolean; playback: boolean; backgroundPlayback: boolean; }
export interface MusicSource { id: string; name: string; capabilities: SourceCapabilities; search(query: string, signal?: AbortSignal): Promise<Track[]>; }
export class UnsupportedCapabilityError extends Error {
  constructor(capability: string) { super(`La fuente no admite ${capability}.`); this.name = 'UnsupportedCapabilityError'; }
}
