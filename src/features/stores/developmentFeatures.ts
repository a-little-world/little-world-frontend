import { create } from 'zustand';

interface DevelopmentFeaturesState {
  enabled: boolean;
  enable: () => void;
  disable: () => void;
  toggle: () => void;
}

export const useDevelopmentFeaturesStore = create<DevelopmentFeaturesState>((set) => ({
  enabled: false,
  enable: () => set({ enabled: true }),
  disable: () => set({ enabled: false }),
  toggle: () => set((state) => ({ enabled: !state.enabled })),
})); 