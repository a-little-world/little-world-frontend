import type { Middleware } from 'swr';

import { TokenStatus } from '../../api/helpers';
import useNativeStore from '../stores/nativeStore';

let tokenRefreshPromise: Promise<TokenStatus> | null = null;
const nativeTokenRefreshMiddleware: Middleware =
  useSWRNext => (key, fetcher, config) => {
    if (!fetcher) {
      return useSWRNext(key, fetcher, config);
    }

    const wrappedFetcher = async (...args: Parameters<typeof fetcher>) => {
      try {
        return await fetcher(...args);
      } catch (error: any) {
        const isTokenError =
          error?.status === 401 || error?.code === 'token_not_valid';

        if (!isTokenError) throw error;

        const { setIstokenRefreshing, refreshAccessToken, setTokenStatus } =
          useNativeStore.getState();

        if (!tokenRefreshPromise) {
          setIstokenRefreshing(true);
          // infinite refresh loop prevented on native side -> if token expired/missing it does not perform any requests
          tokenRefreshPromise = refreshAccessToken()
            .then(status => {
              setTokenStatus(status);
              return status;
            })
            .finally(() => {
              setIstokenRefreshing(false);
              tokenRefreshPromise = null;
            });
        }
        const tokenStatus = await tokenRefreshPromise;

        if (tokenStatus === TokenStatus.VALID) {
          return fetcher(...args);
        }
        throw new Error('Unauthenticated');
      }
    };

    return useSWRNext(key, wrappedFetcher, config);
  };

export default nativeTokenRefreshMiddleware;
