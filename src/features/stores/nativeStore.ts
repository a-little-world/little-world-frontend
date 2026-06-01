import { create } from 'zustand';

import { ApiFetchFn, TokenStatus } from '../../api/types';
import { environment } from '../../environment';

interface NativeStoreState {
  isReady: boolean;
  setReady: () => void; // set isReady to true when native has initialized web
  apiFetchNative: ApiFetchFn;
  setApiFetchNative: (fetch: ApiFetchFn) => void;
  refreshAccessToken: () => Promise<TokenStatus>;
  setRefreshAccessToken: (refreshFn: () => Promise<TokenStatus>) => void;
  tokenStatus: TokenStatus | undefined; // undefined = token status has not been determined yet
  setTokenStatus: (status: TokenStatus | undefined) => void;
  isTokenRefreshing: boolean;
  setIsTokenRefreshing: (isRefreshing: boolean) => void;
  getAccessToken: () => string | undefined;
  setGetAccesToken: (getAccessTokenFn: () => string | undefined) => void;
  setAccessTokens: (
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) => Promise<void>;
  setSetAccessTokens: (
    setAccessTokensFn: (
      accessToken: string | undefined,
      refreshToken: string | undefined,
    ) => Promise<void>,
  ) => void;
}

const useNativeStore = create<NativeStoreState>(set => {
  const errorFn = (functionName: string) => () => {
    throw new Error(`${functionName} has not been set yet.`);
  };

  return {
    isReady: !environment.isNative,
    setReady: () => set({ isReady: true }),
    apiFetchNative: errorFn('apiFetchNative'),
    setApiFetchNative: apiFetchNative => set({ apiFetchNative }),
    refreshAccessToken: errorFn('refreshAccessToken'),
    tokenStatus: undefined,
    setRefreshAccessToken: refreshAccessToken => set({ refreshAccessToken }),
    setTokenStatus: tokenStatus => set({ tokenStatus }),
    isTokenRefreshing: false,
    setIsTokenRefreshing: isTokenRefreshing => set({ isTokenRefreshing }),
    getAccessToken: errorFn('getAccessToken'),
    setGetAccesToken: getAccessToken => set({ getAccessToken }),
    setAccessTokens: errorFn('setAccessTokens'),
    setSetAccessTokens: setAccessTokens => set({ setAccessTokens }),
  };
});

export default useNativeStore;
