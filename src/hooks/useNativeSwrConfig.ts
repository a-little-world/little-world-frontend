import { SWRConfiguration } from 'swr';

import { apiFetch } from '../api/helpers';
import useNativeStore from '../features/stores/nativeStore';

export const useNativeSwrConfig = (): SWRConfiguration => ({
  fetcher: apiFetch,
  isPaused: () => !useNativeStore.getState().isReady,
});

export default useNativeSwrConfig;
