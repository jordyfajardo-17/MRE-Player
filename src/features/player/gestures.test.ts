import { describe, expect, it } from 'vitest';
import { shouldExpandPlayer } from './gestures';
describe('player gesture settling', () => {
  it('opens with an intentional upward swipe and cancels short drags', () => {
    expect(shouldExpandPlayer(0, -65, 0, 700)).toBe(true);
    expect(shouldExpandPlayer(0, -15, 0, 700)).toBe(false);
  });
  it('collapses only from the player handle when dragging down', () => {
    expect(shouldExpandPlayer(1, 90, 0, 700)).toBe(false);
    expect(shouldExpandPlayer(1, 25, 0, 700)).toBe(true);
  });
  it('supports fast flings and bounded travel on small screens', () => {
    expect(shouldExpandPlayer(0, -5, -800, 0)).toBe(true);
    expect(shouldExpandPlayer(1, 5, 800, 700)).toBe(false);
    expect(shouldExpandPlayer(0, 0, 0, 0)).toBe(false);
  });
});
