import { create } from 'zustand';
interface Presentation { expanded: boolean; present: boolean; open(): void; collapse(): void; preview(): void; dismiss(): void; }
export const usePlayerPresentation = create<Presentation>((set, get) => ({
  expanded: false, present: false,
  open: () => set({ expanded: true, present: true }),
  collapse: () => set({ expanded: false }),
  preview: () => set({ present: true }),
  dismiss: () => { if (!get().expanded) set({ present: false }); },
}));
