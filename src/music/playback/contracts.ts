import type { Track } from '../core/types';
export type PlaybackTarget =
  | { kind: 'direct-audio'; uri: string }
  | { kind: 'provider-sdk'; providerId: string; trackId: string }
  | { kind: 'visible-video'; providerId: string; videoId: string }
  | { kind: 'remote-control'; providerId: string; trackId: string };
export interface PlaybackAdapter {
  readonly providerId: string;
  resolve(track: Track): Promise<PlaybackTarget>;
  play(target: PlaybackTarget): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
}
// No generic audio engine is selected yet. Provider APIs do not universally expose audio URLs.
