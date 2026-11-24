import type { MusicSource, Track } from '../core/types';
export const demoTracks: Track[] = [
  { id: 'demo-aurora', providerId: 'demo', title: 'Aurora', artist: 'MRE Sessions', durationSeconds: 218 },
  { id: 'demo-orbit', providerId: 'demo', title: 'Orbit', artist: 'MRE Sessions', durationSeconds: 184 },
  { id: 'demo-slow', providerId: 'demo', title: 'Slow morning', artist: 'MRE Sessions', durationSeconds: 242 },
];
/** Original placeholder metadata only. There is no audio or provider connection. */
export const demoSource: MusicSource = {
  id: 'demo', name: 'Catálogo de demostración',
  capabilities: { search: true, playlists: false, playback: false, backgroundPlayback: false },
  search: async (query) => {
    const term = query.trim().toLocaleLowerCase();
    return demoTracks.filter((track) => `${track.title} ${track.artist}`.toLocaleLowerCase().includes(term));
  },
};
