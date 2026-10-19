export function nextIndex(index: number, length: number, repeat: 'off' | 'all' | 'one', shuffle: boolean, random = Math.random): number | null {
  if (!length) return null;
  if (repeat === 'one') return index;
  if (shuffle && length > 1) return (index + 1 + Math.floor(random() * (length - 1))) % length;
  if (index + 1 < length) return index + 1;
  return repeat === 'all' ? 0 : null;
}
