import { describe, expect, it } from 'vitest';
import { nextIndex } from './queue';
describe('queue transitions', () => {
  it('stops at the end with repeat off', () => { expect(nextIndex(2, 3, 'off', false)).toBeNull(); });
  it('loops all or repeats the current track', () => { expect(nextIndex(2, 3, 'all', false)).toBe(0); expect(nextIndex(1, 3, 'one', false)).toBe(1); });
  it('does not shuffle to the same song', () => { for (let i = 0; i < 3; i++) for (const random of [0, 0.49, 0.99]) expect(nextIndex(i, 3, 'off', true, () => random)).not.toBe(i); });
  it('handles empty and single-song queues', () => { expect(nextIndex(0, 0, 'all', true)).toBeNull(); expect(nextIndex(0, 1, 'off', true)).toBeNull(); expect(nextIndex(0, 1, 'all', true)).toBe(0); });
});
