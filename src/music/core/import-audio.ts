import { getDocumentAsync } from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';
import type { Track } from './types';
export async function importAudio(): Promise<Track[]> {
  const result = await getDocumentAsync({ type: 'audio/*', multiple: true, copyToCacheDirectory: true });
  if (result.canceled) return [];
  return result.assets.map((asset, index) => {
    const id = `local:${Date.now()}-${index}`; let uri = asset.uri;
    if (Platform.OS !== 'web') { const extension = asset.name.match(/\.[a-zA-Z0-9]+$/)?.[0] ?? '.audio'; const target = new File(Paths.document, `${id.replace(':', '-')}${extension}`); new File(asset.uri).copy(target); uri = target.uri; }
    return { id, providerId: 'local', title: asset.name.replace(/\.[^.]+$/, ''), artist: 'Mis archivos', durationSeconds: 0, uri };
  });
}
