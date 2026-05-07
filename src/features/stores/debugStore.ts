import { create } from 'zustand';

type DebugState = {
  debugEnabled: boolean;
  backendUrlOverride: string | null;
};

type Actions = {
  setDebugConfig(config: {
    debugEnabled: boolean;
    backendUrlOverride: string | null;
  }): void;
};

const useDebugStore = create<DebugState & Actions>(set => ({
  debugEnabled: false,
  backendUrlOverride: null,
  setDebugConfig: config => set(config),
}));

export const debugStore = {
  getState: () => useDebugStore.getState(),
};

export default useDebugStore;
