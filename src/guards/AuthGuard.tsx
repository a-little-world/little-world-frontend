import { useSelector } from 'react-redux';

function AuthGuard({ children }) {
  const user = useSelector(state => state.userData.user);
  // TODO: should also check 1. 'session_id' present
  // 2. if 'session_id' & user present, else fetch userData
  return user ? children : null;
}

export default AuthGuard;
