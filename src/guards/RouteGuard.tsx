import { ComponentType } from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from '../api/endpoints';
import { TokenStatus } from '../api/types';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
import { environment } from '../environment';
// import LoadingScreen from '../components/atoms/LoadingScreen';
import useNativeStore from '../features/stores/nativeStore';
import {
  CHANGE_EMAIL_ROUTE,
  getAppRoute,
  LOGIN_ROUTE,
  USER_FORM_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from '../router/routes';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Layout?: ComponentType<any> | null;
  authRequired?: boolean;
}

function RouteGuard({ Layout = FullAppLayout, authRequired = true }: Props) {
  const { isReady, tokenState } = useNativeStore();
  const { pathname, search } = useLocation();
  // only internal absolute paths
  const rawNext = new URLSearchParams(search).get('next');
  const nextParam =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : null;
  const { data: isAuthenticated } = useSWR(IS_AUTHENTICATED_ENDPOINT);
  const { data: user } = useSWR(isAuthenticated ? USER_ENDPOINT : null);

  // Use "value not yet known" (=== undefined) rather than SWR's isLoading:
  // isLoading only clears when a fetch completes, so a fetch started while
  // paused stays "loading" forever even after an optimistic mutate sets the
  // value, which stranded post-login redirects.
  const authUndetermined = isAuthenticated === undefined;
  const userUndetermined = !!isAuthenticated && user === undefined;

  const nativeAuthUndetermined =
    environment.isNative &&
    (tokenState?.isRefreshing || tokenState?.status === undefined);
  const nativeTokenError =
    environment.isNative && tokenState?.status === TokenStatus.ERROR;

  const withNext = (route: string) =>
    nextParam ? `${route}?next=${encodeURIComponent(nextParam)}` : route;

  const pageContent = Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );

  if (
    !isReady ||
    authUndetermined ||
    userUndetermined ||
    nativeAuthUndetermined ||
    nativeTokenError
  ) {
    return pageContent;
  }

  if (authRequired && !user) {
    const sessionExpired = tokenState?.status === TokenStatus.EXPIRED;
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
