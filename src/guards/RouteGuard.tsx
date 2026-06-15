import { ComponentType } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSWR from 'swr';

import { TokenStatus } from '../api/types';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
import useNativeStore from '../features/stores/nativeStore';
import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from '../features/swr';
import {
  CHANGE_EMAIL_ROUTE,
  LOGIN_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
  getAppRoute,
} from '../router/routes';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layout?: ComponentType<any> | null;
  authRequired?: boolean;
}

function RouteGuard({ Layout = FullAppLayout, authRequired = true }: Props) {
  const { isTokenRefreshing, tokenStatus, isReady } = useNativeStore();
  const { pathname } = useLocation();
  const { data: isAuthenticated, isLoading: isAuthenticatedLoading } = useSWR(
    IS_AUTHENTICATED_ENDPOINT,
  );
  const { data: user, isLoading: userLoading } = useSWR(
    isAuthenticated ? USER_ENDPOINT : null,
  );

  const pageContent = Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );

  if (!isReady || isTokenRefreshing || isAuthenticatedLoading || userLoading) {
    return pageContent;
  }

  if (authRequired) {
    if (!user) {
      const sessionExpired = tokenStatus === TokenStatus.EXPIRED;
      const sessionExpiredString = sessionExpired ? '?sessionExpired=true' : '';

      return <Navigate to={`/${LOGIN_ROUTE}${sessionExpiredString}`} replace />;
    }

    if (!user.emailVerified) {
      // use nested if-cases to prevent looping navigation between email verification and user form
      if (
        pathname !== getAppRoute(VERIFY_EMAIL_ROUTE) &&
        pathname !== getAppRoute(CHANGE_EMAIL_ROUTE)
      ) {
        // change email is allowed
        return <Navigate to={getAppRoute(VERIFY_EMAIL_ROUTE)} replace />;
      }
    } else if (!user.userFormCompleted) {
      if (!pathname.startsWith(getAppRoute(USER_FORM_ROUTE))) {
        return <Navigate to={getAppRoute(USER_FORM_ROUTE)} replace />;
      }
    }
  }

  if (!authRequired) {
    if (user) {
      return <Navigate to={getAppRoute()} replace />;
    }
  }

  return pageContent;
}

export default RouteGuard;
