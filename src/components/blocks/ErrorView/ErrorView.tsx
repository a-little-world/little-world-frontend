import React from 'react';
import styled, { css } from 'styled-components';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { getAppRoute } from '../../../router/routes';
import MessageCard from '../Cards/MessageCard';
import AppLayout from '../Layout/AppLayout';

const ErrorWrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing.xxsmall};
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0px;
    }
  `}
`;

const createReportableRouteError = (routeError: unknown) => {
  if (routeError instanceof Error) {
    return routeError;
  }

  if (isRouteErrorResponse(routeError)) {
    const error = new Error(
      `Route error ${routeError.status}${routeError.statusText ? ` ${routeError.statusText}` : ''}`,
    );
    error.name = 'RouteErrorResponse';
    return error;
  }

  if (typeof routeError === 'string') {
    return new Error(routeError);
  }

  try {
    return new Error(`Route error: ${JSON.stringify(routeError)}`);
  } catch {
    return new Error('Unknown route error');
  }
};

const RouterError = ({ Layout = AppLayout }) => (
  <Layout>
    <ErrorWrapper>
      <MessageCard
        title="error_view.title"
        linkText="error_view.button"
        linkTo={getAppRoute('')}
      />
    </ErrorWrapper>
  </Layout>
);

const RouterErrorWithReporting = ({ Layout = AppLayout }) => {
  let routeError: unknown;
  try {
    routeError = useRouteError();
  } catch {
    routeError = undefined;
  }

  const reportedErrorRef = React.useRef<unknown>(null);
  React.useEffect(() => {
    if (!routeError || reportedErrorRef.current === routeError) {
      return;
    }

    reportedErrorRef.current = routeError;
    const reportableError = createReportableRouteError(routeError);

    const sentry = (window as any)?.Sentry;
    if (sentry?.captureException) {
      sentry.captureException(reportableError, {
        extra: {
          routeError,
        },
      });
      return;
    }

    // Fallback keeps visibility when Sentry is unavailable.
    console.error('Unhandled route error', routeError);
  }, [routeError]);

  return <RouterError Layout={Layout} />;
};

export default RouterErrorWithReporting;
