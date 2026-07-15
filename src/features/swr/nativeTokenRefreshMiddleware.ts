import { mutate, type Middleware } from 'swr';

import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from '.';
import { TokenStatus } from '../../api/types';
import useNativeStore from '../stores/nativeStore';

let tokenRefreshPromise: Promise<TokenStatus> | null = null;

async function triggerLogout() {
  await mutate(IS_AUTHENTICATED_ENDPOINT, false, false);
  await mutate(USER_ENDPOINT, null, false);
}

async function refreshToken() {
  const { setIsTokenRefreshing, refreshAccessToken, setTokenStatus } =
    useNativeStore.getState();

  if (!tokenRefreshPromise) {
    setIsTokenRefreshing(true);
    // infinite refresh loop prevented on native side -> if token expired/missing it does not perform any requests
    tokenRefreshPromise = refreshAccessToken()
      .then(status => {
        setTokenStatus(status);
        return status;
      })
      .finally(() => {
        setIsTokenRefreshing(false);
        tokenRefreshPromise = null;
      });
  }

  return tokenRefreshPromise;
}

const nativeTokenRefreshMiddleware: Middleware =
  useSWRNext => (key, fetcher, config) => {
    if (!fetcher) {
      return useSWRNext(key, fetcher, config);
    }

    const wrappedFetcher = async (...args: Parameters<typeof fetcher>) => {
      try {
        return await fetcher(...args);
      } catch (error: any) {
        const { getAccessToken } = useNativeStore.getState();
        const accessToken = await getAccessToken();

        const isTokenExpiredError =
          error?.status === 401 || error?.code === 'token_not_valid';
        const isTokenMissingError = error?.status === 403 && !accessToken;
        const isTokenError = isTokenExpiredError || isTokenMissingError;

        if (!isTokenError) throw error;

        const tokenStatus = await refreshToken();

        if (tokenStatus === TokenStatus.VALID) {
          return fetcher(...args);
        }

        await triggerLogout();
        throw new Error('Unauthenticated');
      }
    };

    return useSWRNext(key, wrappedFetcher, config);
  };

export default nativeTokenRefreshMiddleware;
