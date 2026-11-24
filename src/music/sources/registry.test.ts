import { describe, expect, it } from 'vitest';
import { demoSource } from './demo';
import { SourceRegistry } from './registry';
describe('source boundaries', () => {
  it('rejects duplicates and missing providers', () => {
    const registry = new SourceRegistry(); registry.register(demoSource);
    expect(() => registry.register(demoSource)).toThrow(/ya está/);
    expect(() => registry.get('spotify')).toThrow(/no registrada/);
  });
  it('searches demo metadata without claiming playback', async () => {
    expect((await demoSource.search(' AURORA ')).map((track) => track.id)).toEqual(['demo-aurora']);
    expect(await demoSource.search('no matching track')).toEqual([]);
    expect(demoSource.capabilities.playback).toBe(false);
  });
});
