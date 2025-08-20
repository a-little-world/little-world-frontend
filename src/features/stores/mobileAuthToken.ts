import { create } from 'zustand';

interface MobileAuthTokenState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const useMobileAuthTokenStore = create<MobileAuthTokenState>(set => ({
  token: null,
  setToken: token => set({ token }),
  clearToken: () => set({ token: null }),
}));

export default useMobileAuthTokenStore; 