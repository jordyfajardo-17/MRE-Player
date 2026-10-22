export function shouldExpandPlayer(start: number, translation: number, velocity: number, travel: number): boolean {
  'worklet';
  if (velocity < -650) return true;
  if (velocity > 650) return false;
  if (start < 0.5 && translation < -55) return true;
  if (start >= 0.5 && translation > 80) return false;
  return start - translation / Math.max(1, travel) >= 0.5;
}
