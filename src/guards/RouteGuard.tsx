import { ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useSWR from 'swr';

import { TokenStatus } from '../api/types';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
import useNativeStore from '../features/stores/nativeStore';
import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from '../features/swr';
import {
  APP_ROUTE,
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
      return <Navigate to={getAppRoute(VERIFY_EMAIL_ROUTE)} replace />;
    }
    if (!user.userFormCompleted) {
      return <Navigate to={getAppRoute(USER_FORM_ROUTE)} replace />;
    }
  }

  if (!authRequired) {
    if (user) {
      return <Navigate to={`/${APP_ROUTE}`} replace />;
    }
  }

  return pageContent;
}

export default RouteGuard;
