import { create } from 'zustand';

interface MobileAuthTokenState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  setTokens: (
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) => void;
  setAccessToken: (accessToken: string | undefined) => void;
  setRefreshToken: (refreshToken: string | undefined) => void;
  clearTokens: () => void;
}

const useMobileAuthTokenStore = create<MobileAuthTokenState>(set => ({
  accessToken: undefined,
  refreshToken: undefined,
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  setAccessToken: accessToken => set({ accessToken }),
  setRefreshToken: refreshToken => set({ refreshToken }),
  clearTokens: () => set({ accessToken: undefined, refreshToken: undefined }),
}));

export default useMobileAuthTokenStore;
