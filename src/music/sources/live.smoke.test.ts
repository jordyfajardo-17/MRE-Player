import { expect, it } from 'vitest';
import { archiveSource } from './archive';

it.skipIf(process.env.MRE_LIVE_API_CHECK !== '1')('loads the official archive API and reads a playable stream range', async () => {
  const tracks = await archiveSource.search('piano', AbortSignal.timeout(45_000));
  expect(tracks.length).toBeGreaterThan(0);
  const track = tracks[0];
  expect(track.licenseUrl).toMatch(/creativecommons.org/);
  const response = await fetch(track.uri!, { headers: { Range: 'bytes=0-4095' }, signal: AbortSignal.timeout(30_000) });
  expect(response.ok).toBe(true);
  expect(response.headers.get('content-type')).toMatch(/audio|octet-stream/);
  const reader = response.body!.getReader();
  const first = await reader.read(); expect(first.value?.byteLength).toBeGreaterThan(0);
  await reader.cancel();
  console.info(JSON.stringify({ provider: track.providerId, title: track.title, artist: track.artist, license: track.licenseLabel, status: response.status }));
}, 80_000);
