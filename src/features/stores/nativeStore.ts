import { create } from 'zustand';

import { ApiFetchFn, TokenStatus } from '../../api/types';
import { environment } from '../../environment';

export interface TokenState {
  isRefreshing: boolean;
  status?: TokenStatus;
}

interface NativeStoreState {
  isReady: boolean;
  setReady: () => void; // set isReady to true when native has initialized web
  apiFetchNative: ApiFetchFn;
  setApiFetchNative: (fetch: ApiFetchFn) => void;
  getAccessToken: () => Promise<string | undefined>;
  setGetAccesToken: (
    getAccessTokenFn: () => Promise<string | undefined>,
  ) => void;
  tokenState?: TokenState;
  setTokenState: (tokenState: TokenState) => void;
  getInstallId: () => Promise<string>;
  setGetInstallId: (getInstallIdFn: () => Promise<string>) => void;
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
    getAccessToken: errorFn('getAccessToken'),
    setGetAccesToken: getAccessToken => set({ getAccessToken }),
    setTokenState: tokenState => set({ tokenState }),
    getInstallId: errorFn('getInstallId'),
    setGetInstallId: getInstallId => set({ getInstallId }),
    setAccessTokens: errorFn('setAccessTokens'),
    setSetAccessTokens: setAccessTokens => set({ setAccessTokens }),
  };
});

export default useNativeStore;
