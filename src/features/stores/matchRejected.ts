import { create } from 'zustand';

interface MatchRejectedState {
  rejected: boolean;
  setMatchRejected: (value: boolean) => void;
}

export const useMatchRejectedStore = create<MatchRejectedState>((set) => ({
  rejected: false,
  setMatchRejected: (value) => set({ rejected: value }),
})); 