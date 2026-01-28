import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT } from '../features/swr/index';

function AuthGuard({ children }) {
  const { data, isLoading, error } = useSWR(IS_AUTHENTICATED_ENDPOINT);
  // TODO: should also check 1. 'session_id' present
  // 2. if 'session_id' & user present, else fetch userData
  const isAuthenticated = data && !isLoading && !error;
  return isAuthenticated ? children : null;
}

export default AuthGuard;
