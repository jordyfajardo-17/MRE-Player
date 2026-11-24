import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** Reserved for future OAuth adapters. Never use AsyncStorage for provider tokens. */
export async function saveProviderToken(providerId: string, token: string): Promise<void> {
  if (Platform.OS === 'web') throw new Error('El almacenamiento de credenciales web requiere un flujo propio.');
  if (!/^[a-z0-9.-]+$/.test(providerId)) throw new Error('Proveedor no válido.');
  await SecureStore.setItemAsync(`mre.provider.${providerId}`, token);
}
export async function removeProviderToken(providerId: string): Promise<void> {
  if (!/^[a-z0-9.-]+$/.test(providerId)) throw new Error('Proveedor no válido.');
  if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(`mre.provider.${providerId}`);
}
