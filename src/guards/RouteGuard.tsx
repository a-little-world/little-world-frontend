import { ComponentType } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSWR from 'swr';

import { TokenStatus } from '../api/types';
import { FullAppLayout } from '../components/blocks/Layout/AppLayout';
import { useReceiveHandlerStore } from '../features/stores';
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
  const { sendMessageToReactNative } = useReceiveHandlerStore();
  const location = useLocation();

  const pageContent = Layout ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Outlet />
  );

  sendMessageToReactNative?.({
    action: 'CONSOLE_LOG',
    payload: {
      message: `current location: ${location.pathname},
      )}`,
    },
  });

  sendMessageToReactNative?.({
    action: 'CONSOLE_LOG',
    payload: {
      message: `authRequired: ${authRequired}, isReady: ${isReady}; isTokenRefreshing: ${isTokenRefreshing}; isAuthenticatedLoading: ${isAuthenticatedLoading} userLoading: ${userLoading}; user !== null: ${Boolean(
        user,
      )}`,
    },
  });
  if (!isReady || isTokenRefreshing || isAuthenticatedLoading || userLoading) {
    sendMessageToReactNative?.({
      action: 'CONSOLE_LOG',
      payload: {
        message: `return pageContent`,
      },
    });
    return pageContent;
  }

  if (authRequired) {
    if (!user) {
      const sessionExpired = tokenStatus === TokenStatus.EXPIRED;
      const sessionExpiredString = sessionExpired ? '?sessionExpired=true' : '';

      sendMessageToReactNative?.({
        action: 'CONSOLE_LOG',
        payload: {
          message: `navigate to login: /${LOGIN_ROUTE}${sessionExpiredString}`,
        },
      });
      return <Navigate to={`/${LOGIN_ROUTE}${sessionExpiredString}`} replace />;
    }

    if (!user.emailVerified) {
      sendMessageToReactNative?.({
        action: 'CONSOLE_LOG',
        payload: {
          message: `navigate to email verification: ${getAppRoute(
            VERIFY_EMAIL_ROUTE,
          )}}`,
        },
      });
      return <Navigate to={getAppRoute(VERIFY_EMAIL_ROUTE)} replace />;
    }
    if (!user.userFormCompleted) {
      sendMessageToReactNative?.({
        action: 'CONSOLE_LOG',
        payload: {
          message: `navigate to user form: ${getAppRoute(USER_FORM_ROUTE)}}`,
        },
      });
      return <Navigate to={getAppRoute(USER_FORM_ROUTE)} replace />;
    }
  }

  if (!authRequired) {
    if (user) {
      sendMessageToReactNative?.({
        action: 'CONSOLE_LOG',
        payload: {
          message: `!authRequired && user: navigate to" /${APP_ROUTE}`,
        },
      });
      return <Navigate to={`/${APP_ROUTE}`} replace />;
    }
  }

  sendMessageToReactNative?.({
    action: 'CONSOLE_LOG',
    payload: {
      message: `final return pageContent`,
    },
  });
  return pageContent;
}

export default RouteGuard;
