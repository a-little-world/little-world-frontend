import { ReactNode, useEffect, useMemo, useRef } from 'react';

import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT } from '../api/endpoints';
import { environment } from '../environment';
import useNativeStore from '../features/stores/nativeStore';
import { hideCookieBanner } from '../router/routes';

function AuthGuard({ children }: { children: ReactNode }) {
  const { isReady, tokenState } = useNativeStore();
  const { data: authenticated } = useSWR<boolean>(
    isReady ? IS_AUTHENTICATED_ENDPOINT : null,
  );

  // Store previous authenticated state to prevent flickering during loading/token refresh
  const prevAuthenticatedRef = useRef<boolean>(false);

  const nativeAuthUndetermined =
    environment.isNative &&
    (tokenState?.isRefreshing || tokenState?.status === undefined);
  const isAuthenticated = useMemo(() => {
    if (authenticated === undefined || nativeAuthUndetermined) {
      return prevAuthenticatedRef.current;
    }

    prevAuthenticatedRef.current = Boolean(authenticated);

    return Boolean(authenticated);
  }, [authenticated, nativeAuthUndetermined]);

  useEffect(() => {
    if (isAuthenticated && !environment.isNative) {
      hideCookieBanner();
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}

export default AuthGuard;
