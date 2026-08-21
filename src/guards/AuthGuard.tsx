import { ReactNode, useMemo, useRef } from 'react';

import useSWR from 'swr';

import { environment } from '../environment';
import useNativeStore from '../features/stores/nativeStore';
import { IS_AUTHENTICATED_ENDPOINT } from '../features/swr/index';

function AuthGuard({ children }: { children: ReactNode }) {
  const { data: authenticated, isValidating } = useSWR<boolean>(
    IS_AUTHENTICATED_ENDPOINT,
  );
  const { tokenState } = useNativeStore();

  // Store previous authenticated state to prevent flickering during loading/token refresh
  const prevAuthenticatedRef = useRef<boolean>(false);

  const nativeAuthUndetermined =
    environment.isNative &&
    (tokenState?.isRefreshing || tokenState?.status === undefined);
  const isAuthenticated = useMemo(() => {
    // During loading, maintain previous state
    if (isValidating || nativeAuthUndetermined) {
      return prevAuthenticatedRef.current;
    }

    prevAuthenticatedRef.current = Boolean(authenticated);

    return Boolean(authenticated);
  }, [authenticated, isValidating, nativeAuthUndetermined]);

  return isAuthenticated ? children : null;
}

export default AuthGuard;
