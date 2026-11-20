import { Navigate } from 'react-router-dom';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../api/endpoints';
import { USER_TYPES } from '../../constants/index';
import { getAppRoute } from '../../router/routes';
import AdventDoorPanel from '../blocks/AdventDoors/AdventDoorPanel';

/**
 * The Advent doors for learners. Nothing links here yet: the page is reached
 * only by opening /app/advent directly. Other users go back to Home.
 */
const AdventDoors = () => {
  const { data: user } = useSWR(USER_ENDPOINT);
  if (!user) return null;
  if (user.profile?.user_type !== USER_TYPES.learner) {
    return <Navigate to={getAppRoute()} replace />;
  }
  return <AdventDoorPanel />;
};

export default AdventDoors;
