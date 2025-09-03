import { create } from 'zustand';

interface MobileAuthTokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  clearTokens: () => void;
}

const useMobileAuthTokenStore = create<MobileAuthTokenState>(set => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setAccessToken: accessToken => set({ accessToken }),
  setRefreshToken: refreshToken => set({ refreshToken }),
  clearTokens: () => set({ accessToken: null, refreshToken: null }),
}));

export default useMobileAuthTokenStore; 