import { NavigateFunction } from 'react-router-dom';
import { create } from 'zustand';

interface NavigationState {
  navigate: NavigateFunction | null;
  setNavigate: (navigate: NavigateFunction) => void;
}

const useNavigationStore = create<NavigationState>(set => ({
  navigate: null,
  setNavigate: navigate => set({ navigate }),
}));

export default useNavigationStore;
