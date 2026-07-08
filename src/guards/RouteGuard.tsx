import { ComponentType } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSWR from 'swr';

import { TokenStatus } from '../api/types';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
// import { environment } from '../environment';
// import LoadingScreen from '../components/atoms/LoadingScreen';
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
  const { pathname, search } = useLocation();
  // only internal absolute paths
  const rawNext = new URLSearchParams(search).get('next');
  const nextParam =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : null;
  const { data: isAuthenticated, isLoading: isAuthenticatedLoading } = useSWR(
    IS_AUTHENTICATED_ENDPOINT,
  );
  const { data: user, isLoading: userLoading } = useSWR(
    isAuthenticated ? USER_ENDPOINT : null,
  );

  const withNext = (route: string) =>
    nextParam ? `${route}?next=${encodeURIComponent(nextParam)}` : route;

  const pageContent = Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );

  // TODO: enable if the optimistic app shell looks broken before user data loads on native.
  // Keeps mid-session token refresh flicker-free (return current page), but shows the
  // loading logo during the initial auth determination instead of a half-rendered shell.
  // Web is unchanged. Requires the commented imports (environment, LoadingScreen) above.
  // if (isTokenRefreshing) {
  //   return pageContent;
  // }
  // if (environment.isNative && (!isReady || isAuthenticatedLoading || userLoading)) {
  //   return <LoadingScreen />;
  // }

  if (!isReady || isTokenRefreshing || isAuthenticatedLoading || userLoading) {
    return pageContent;
  }

  if (authRequired && !user) {
    const sessionExpired = tokenStatus === TokenStatus.EXPIRED;
    const params = new URLSearchParams();
    if (sessionExpired) {
      params.set('sessionExpired', 'true');
      params.set('next', `${pathname}${search}`);
    }
    const query = params.toString();

    return (
      <Navigate to={`/${LOGIN_ROUTE}${query ? `?${query}` : ''}`} replace />
    );
  }

  // Unverified email -> verify-email (change-email is also allowed)
  if (
    authRequired &&
    user &&
    !user.emailVerified &&
    pathname !== getAppRoute(VERIFY_EMAIL_ROUTE) &&
    pathname !== getAppRoute(CHANGE_EMAIL_ROUTE)
  ) {
    return <Navigate to={withNext(getAppRoute(VERIFY_EMAIL_ROUTE))} replace />;
  }

  // Verified email but user form not completed -> user-form
  if (
    authRequired &&
    user &&
    user.emailVerified &&
    !user.userFormCompleted &&
    !pathname.startsWith(getAppRoute(USER_FORM_ROUTE))
  ) {
    return <Navigate to={withNext(getAppRoute(USER_FORM_ROUTE))} replace />;
  }

  if (!authRequired && user) {
    return <Navigate to={nextParam || getAppRoute()} replace />;
  }

  return pageContent;
}

export default RouteGuard;
