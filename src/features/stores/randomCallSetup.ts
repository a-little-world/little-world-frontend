import { create } from 'zustand';

interface RandomCallSetupData {
  userId: string;
  authData: {
    chatId: string | null,
    token: string | null,
    livekitServerUrl: string | null,
    randomCallMatchId: string | null,
  };
}

interface RandomCallSetupState {
  randomCallSetup: RandomCallSetupData | null;
  initRandomCallSetup: (data: RandomCallSetupData) => void;
  cancelRandomCallSetup: () => void;
}

const useRandomCallSetupStore = create<RandomCallSetupState>((set) => ({
  randomCallSetup: null,
  initRandomCallSetup: (data) => set({ randomCallSetup: data }),
  cancelRandomCallSetup: () => set({ randomCallSetup: null }),
}));

export default useRandomCallSetupStore;