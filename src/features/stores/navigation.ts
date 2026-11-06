import { NavigateFunction } from 'react-router-dom';
import { create } from 'zustand';

interface NavigationState {
  navigate: NavigateFunction | null;
  setNavigate: (navigate: NavigateFunction) => void;
  // screen-level back handling; returns true if it consumed the back press
  onBack: (() => boolean) | null;
}

const useNavigationStore = create<NavigationState>(set => ({
  navigate: null,
  setNavigate: navigate => set({ navigate }),
  onBack: null,
}));

export default useNavigationStore;
