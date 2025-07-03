import { create } from 'zustand';

interface RandomCallSetupData {
  userId: string;
}

interface RandomCallSetupState {
  randomCallSetup: RandomCallSetupData | null;
  initRandomCallSetup: (data: RandomCallSetupData) => void;
  cancelRandomCallSetup: () => void;
}

export const useRandomCallSetupStore = create<RandomCallSetupState>((set) => ({
  randomCallSetup: null,
  initRandomCallSetup: (data) => set({ randomCallSetup: data }),
  cancelRandomCallSetup: () => set({ randomCallSetup: null }),
})); 