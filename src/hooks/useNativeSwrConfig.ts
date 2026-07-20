import { SWRConfiguration } from 'swr';

import useNativeStore from '../features/stores/nativeStore';
import nativeTokenRefreshMiddleware from '../features/swr/nativeTokenRefreshMiddleware';

export const useNativeSwrConfig = (): SWRConfiguration => {
  const { apiFetchNative, isTokenRefreshing, isReady } = useNativeStore();

  return {
    fetcher: apiFetchNative,
    use: [nativeTokenRefreshMiddleware],
    isPaused: () => !isReady || isTokenRefreshing,
  };
};

export default useNativeSwrConfig;
