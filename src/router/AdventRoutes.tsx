import { Navigate, useLocation, useParams } from 'react-router-dom';

import ExternalRandomCallsPortal from '../components/views/ExternalRandomCalls/ExternalRandomCallsPortal';
import PartnerLanding from '../components/views/PartnerLanding/PartnerLanding';
import { ADVENT_LANDING_ROUTE } from './routes';

const LOBBY_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * `/advents-gespraeche/<segment>` is either a session's partner page (the segment is its lobby
 * uuid) or a landing (a company slug or lobby name, never uuid-shaped).
 */
export const PartnerSlugOrSession = () => {
  const { partnerSlug = '' } = useParams();
  return LOBBY_ID.test(partnerSlug) ? (
    <ExternalRandomCallsPortal />
  ) : (
    <PartnerLanding />
  );
};

/** Partner pages used to live under `/advents-gespraeche/gast/`. Old links keep working. */
export const LegacyGuestRedirect = () => {
  const { '*': rest = '' } = useParams();
  const { search } = useLocation();
  return (
    <Navigate
      to={`/${ADVENT_LANDING_ROUTE}${rest ? `/${rest}` : ''}${search}`}
      replace
    />
  );
};
