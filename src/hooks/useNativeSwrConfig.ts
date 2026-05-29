import { SWRConfiguration } from 'swr';
import useNativeStore from '../features/stores/nativeStore';
import nativeTokenRefreshMiddleware from '../features/swr/nativeTokenRefreshMiddleware';

export const useNativeSwrConfig = (): SWRConfiguration => {
  const { apiFetchNative, isTokenRefreshing } = useNativeStore();

  return {
    fetcher: apiFetchNative,
    use: [nativeTokenRefreshMiddleware],
    isPaused: () => isTokenRefreshing,
  };
};

export default useNativeSwrConfig;
