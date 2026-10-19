import { releasePlayer, usePlayer } from './player-store';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const audio = vi.hoisted(() => ({ players: [] as any[], remember: vi.fn() }));
vi.mock('react-native', () => ({ Platform: { OS: 'web' } }));
vi.mock('../core/library', () => ({ useLibrary: { getState: () => ({ remember: audio.remember }) } }));
vi.mock('expo-audio', () => ({ setAudioModeAsync: vi.fn().mockResolvedValue(undefined), createAudioPlayer: () => {
  const p = { playing: false, volume: 1, callback: (_s: any) => {}, play: vi.fn(), pause: vi.fn(), release: vi.fn(), seekTo: vi.fn().mockResolvedValue(undefined), addListener: vi.fn((_name, cb) => { p.callback = cb; return { remove: vi.fn() }; }) }; audio.players.push(p); return p;
} }));
const a = { id: 'a', providerId: 'local', title: 'A', artist: 'Artist', durationSeconds: 30, uri: 'file:///a.mp3' };
const b = { ...a, id: 'b', title: 'B', uri: 'file:///b.mp3' };
beforeEach(() => { vi.useFakeTimers(); audio.players.length = 0; usePlayer.setState({ track: null, queue: [], index: 0, repeat: 'off', shuffle: false, position: 0, playing: false, error: null }); });
afterEach(() => { releasePlayer(); vi.useRealTimers(); });
describe('playback lifecycle', () => {
  it('releases previous audio and ignores stale events', () => {
    usePlayer.getState().play(a, [a, b]); const first = audio.players[0]; usePlayer.getState().next();
    expect(first.release).toHaveBeenCalled(); expect(usePlayer.getState().track?.id).toBe('b'); first.callback({ playing: true, currentTime: 29 }); expect(usePlayer.getState().position).toBe(0);
  });
  it('advances on completion and stops at end', () => {
    usePlayer.getState().play(a, [a, b]); audio.players[0].callback({ isLoaded: true, playing: false, currentTime: 30, duration: 30, didJustFinish: true });
    expect(usePlayer.getState().track?.id).toBe('b'); audio.players[1].callback({ isLoaded: true, playing: false, currentTime: 30, duration: 30, didJustFinish: true }); expect(audio.players).toHaveLength(2);
  });
  it('exposes loading failures and supports retry', () => {
    usePlayer.getState().play(a); vi.advanceTimersByTime(20000); expect(usePlayer.getState().error).toContain('cargar'); usePlayer.getState().toggle(); expect(audio.players).toHaveLength(2);
  });
  it('pauses after the sleep timer and can cancel it', () => {
    usePlayer.getState().play(a); usePlayer.getState().sleep(15); usePlayer.getState().sleep(0); vi.advanceTimersByTime(15 * 60000); expect(usePlayer.getState().sleepAt).toBeNull();
    usePlayer.getState().sleep(15); vi.advanceTimersByTime(15 * 60000); expect(audio.players[0].pause).toHaveBeenCalled(); expect(usePlayer.getState().sleepAt).toBeNull();
  });
  it('preserves current index during reordering and removal', () => {
    usePlayer.getState().play(b, [a, b]); usePlayer.getState().move(1, -1); expect(usePlayer.getState().index).toBe(0); usePlayer.getState().remove(0); expect(usePlayer.getState().queue).toHaveLength(2); usePlayer.getState().remove(1); expect(usePlayer.getState().queue).toHaveLength(1);
  });
});

