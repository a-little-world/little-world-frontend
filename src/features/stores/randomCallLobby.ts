import { create } from 'zustand';

interface RandomCallLobbyData {
    userId: string;
    prevMatchId: string;
}

interface RandomCallLobbyState {
    randomCallLobby: RandomCallLobbyData | null;
    initRandomCallLobby: (data: RandomCallLobbyData) => void;
    cancelRandomCallLobby: (data: RandomCallLobbyData) => void;
}

const useRandomCallLobbyStore = create<RandomCallLobbyState>((set) => ({
    randomCallLobby: null,
    initRandomCallLobby: (data) => set({ randomCallLobby: data }),
    cancelRandomCallLobby: (data) => set({ randomCallLobby: data }),
}));

export default useRandomCallLobbyStore;