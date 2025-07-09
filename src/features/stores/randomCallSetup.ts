import { create } from 'zustand';

interface RandomCallSetupData {
  userId: string;
}

interface RandomCallSetupState {
  randomCallSetup: RandomCallSetupData | null;
  initRandomCallSetup: (data: RandomCallSetupData) => void;
  cancelRandomCallSetup: (data: RandomCallSetupData) => void;
}

const useRandomCallSetupStore = create<RandomCallSetupState>((set) => ({
  randomCallSetup: null,
  initRandomCallSetup: (data) => set({ randomCallSetup: data }),
  cancelRandomCallSetup: (data) => set({ randomCallSetup: data }),
}));

export default useRandomCallSetupStore;