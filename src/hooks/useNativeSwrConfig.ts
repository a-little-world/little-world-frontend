import { SWRConfiguration } from 'swr';

import { apiFetch } from '../api/helpers';
import useNativeStore from '../features/stores/nativeStore';

export const useNativeSwrConfig = (): SWRConfiguration => {
  const { isReady } = useNativeStore();

  return {
    fetcher: apiFetch,
    isPaused: () => !isReady,
  };
};

export default useNativeSwrConfig;
