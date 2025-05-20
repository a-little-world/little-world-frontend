import { create } from 'zustand';

interface CallSetupData {
  userId: string;
}

interface CallSetupState {
  callSetup: CallSetupData | null;
  initCallSetup: (data: CallSetupData) => void;
  cancelCallSetup: () => void;
}

export const useCallSetupStore = create<CallSetupState>((set) => ({
  callSetup: null,
  initCallSetup: (data) => set({ callSetup: data }),
  cancelCallSetup: () => set({ callSetup: null }),
})); 