import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseTheme, serializeTheme, type MusicTheme } from '@mre/theme-core';
const KEY = 'mre.theme.v1';
export async function loadTheme(): Promise<MusicTheme | null> {
  const value = await AsyncStorage.getItem(KEY);
  return value ? parseTheme(value) : null;
}
export async function saveTheme(theme: MusicTheme): Promise<void> { await AsyncStorage.setItem(KEY, serializeTheme(theme)); }
