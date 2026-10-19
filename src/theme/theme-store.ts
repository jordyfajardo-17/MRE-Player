import { create } from 'zustand';
import { defaultTheme, validateTheme, type MusicTheme } from '@mre/theme-core';
import { loadTheme, saveTheme } from '../storage/theme-storage';

interface ThemeState {
  theme: MusicTheme; hydrated: boolean; storageNotice: string | null;
  hydrate(): Promise<void>; apply(theme: MusicTheme): Promise<void>;
}
let hydration: Promise<void> | undefined;
let pendingSave = Promise.resolve();
export const useThemeStore = create<ThemeState>((set) => ({
  theme: defaultTheme(), hydrated: false, storageNotice: null,
  hydrate: () => {
    if (!hydration) hydration = (async () => {
      try { const theme = await loadTheme(); set({ theme: theme ?? defaultTheme(), hydrated: true }); }
      catch { set({ hydrated: true, storageNotice: 'No se pudo recuperar el tema guardado. Usamos Emerald.' }); }
    })();
    return hydration;
  },
  apply: async (input) => {
    const theme = validateTheme(input);
    set({ theme, storageNotice: null });
    pendingSave = pendingSave.then(() => saveTheme(theme)).catch(() => {
      set({ storageNotice: 'El tema está aplicado, pero no se pudo guardar en este dispositivo.' });
    });
    await pendingSave;
  },
}));
