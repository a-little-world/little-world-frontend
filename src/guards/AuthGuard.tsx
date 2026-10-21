import { ReactNode, useEffect, useMemo, useRef } from 'react';

import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT } from '../api/endpoints';
import E2EEWarningModal from '../components/blocks/Calls/E2EEWarningModal';
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

  // Calls are only offered with end-to-end encryption. A client that cannot encrypt is
  // blocked by a modal instead of silently continuing in plaintext.
  const e2eeUnsupported = isAuthenticated && !isE2EEAvailable();

  return (
    <>
      {isAuthenticated ? children : null}
      <E2EEWarningModal open={e2eeUnsupported} />
    </>
  );
}

export default AuthGuard;
