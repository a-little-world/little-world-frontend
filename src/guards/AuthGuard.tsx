import useSWR from 'swr';

import { ReactNode } from 'react';
import { IS_AUTHENTICATED_ENDPOINT } from '../features/swr/index';

function AuthGuard({ children }: { children: ReactNode }) {
  const { data, error, isLoading } = useSWR<boolean>(
    IS_AUTHENTICATED_ENDPOINT,
    {
      refreshInterval: isAuthenticated => {
        // keep polling every 3s until authenticated
        if (isAuthenticated !== true) {
          return 3000;
        }
        return 0;
      },
    },
  );
  // TODO: should also check 1. 'session_id' present
  // 2. if 'session_id' & user present, else fetch userData
  const isAuthenticated = data && !isLoading && !error;
  return isAuthenticated ? children : null;
}

export default AuthGuard;
