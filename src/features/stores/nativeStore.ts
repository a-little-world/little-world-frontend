import { create } from 'zustand';

import { ApiFetchFn, TokenStatus } from '../../api/types';
import { environment } from '../../environment';

interface NativeStoreState {
  ready: Promise<void>;
  setReady: () => void;
  apiFetchNative: ApiFetchFn;
  setApiFetchNative: (fetch: ApiFetchFn) => void;
  refreshAccessToken: () => Promise<TokenStatus>;
  setRefreshAccessToken: (refreshFn: () => Promise<TokenStatus>) => void;
  tokenStatus: TokenStatus | undefined; // undefined = token status has not been determined yet
  setTokenStatus: (status: TokenStatus | undefined) => void;
  isTokenRefreshing: boolean;
  setIstokenRefreshing: (isRefreshing: boolean) => void;
  getAccessToken: () => string | undefined;
  setGetAccesToken: (getAccessTokenFn: () => string | undefined) => void;
}

const useNativeStore = create<NativeStoreState>(set => {
  let setReady: () => void = () => {};
  const readyPromise = new Promise<void>(resolve => {
    setReady = () => resolve();

    if (!environment.isNative) {
      resolve();
    }
  });

  const errorFn = (functionName: string) => () => {
    throw new Error(`${functionName} has not been set yet.`);
  };

  return {
    ready: readyPromise,
    setReady,
    apiFetchNative: errorFn('apiFetchNative'),
    setApiFetchNative: apiFetchNative => set({ apiFetchNative }),
    refreshAccessToken: errorFn('refreshAccessToken'),
    tokenStatus: undefined,
    setRefreshAccessToken: refreshAccessToken => set({ refreshAccessToken }),
    setTokenStatus: tokenStatus => set({ tokenStatus }),
    isTokenRefreshing: false,
    setIstokenRefreshing: isTokenRefreshing => set({ isTokenRefreshing }),
    getAccessToken: () => undefined,
    setGetAccesToken: getAccessToken => set({ getAccessToken }),
  };
});

export default useNativeStore;
