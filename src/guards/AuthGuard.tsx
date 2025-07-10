import useSWR from 'swr';

import { USER_ENDPOINT } from '../features/swr/index.ts';

function AuthGuard({ children }) {
  const { data, isLoading, error } = useSWR(USER_ENDPOINT);
  // TODO: should also check 1. 'session_id' present
  // 2. if 'session_id' & user present, else fetch userData
  const isAuthenticated = data && !isLoading && !error;
  return isAuthenticated ? children : null;
}

export default AuthGuard;
