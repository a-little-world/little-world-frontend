import { ReactNode, useEffect, useMemo, useRef } from 'react';

import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT } from '../api/endpoints';
import { reportE2EECapability } from '../api/livekit';
import { environment } from '../environment';
import useNativeStore from '../features/stores/nativeStore';
import { isE2EEAvailable } from '../helpers/e2ee';
import { hideCookieBanner } from '../router/routes';

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

  useEffect(() => {
    if (isAuthenticated && !environment.isNative) {
      hideCookieBanner();
    }
  }, [isAuthenticated]);

  // Call encryption is only enabled for a room when both participants reported support ( both browsers need to support it at the same time )
  // Report once per app load, never per call, so both peers read the same flags, so capbility locked in on first load, can clealy display state in UI
  useEffect(() => {
    if (!isAuthenticated) return;
    reportE2EECapability(isE2EEAvailable()).catch(() => {
      // TODO: Report error UI pop-up cability support issues warning
	console.error("Unecrypted session!")
    });
  }, [isAuthenticated]);

  return isAuthenticated ? children : null;
}

export default AuthGuard;
