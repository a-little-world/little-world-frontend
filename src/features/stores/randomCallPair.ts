import { create } from 'zustand';

interface RandomCallPairData {
    matchId: string
}

interface RandomCallPairState {
    randomCallPair: RandomCallPairData | null;
    initRandomCallPair: (data: RandomCallPairData) => void;
    cancelRandomCallPair: () => void;
}

const useRandomCallPairStore = create<RandomCallPairState>((set) => ({
    randomCallPair: null,
    initRandomCallPair: (data) => set({ randomCallPair: data }),
    cancelRandomCallPair: () => set({ randomCallPair: null }),
}));

export default useRandomCallPairStore;