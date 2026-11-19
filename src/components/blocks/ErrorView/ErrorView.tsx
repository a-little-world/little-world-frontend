import { useEffect } from 'react';

import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import styled, { css } from 'styled-components';

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

export const ErrorView = () => (
  <ErrorWrapper data-testid="router-error">
    <MessageCard
      title="error_view.title"
      linkText="error_view.button"
      linkTo={getAppRoute('')}
    />
  </ErrorWrapper>
);

const toError = (error: unknown) => {
  if (error instanceof Error) return error;
  if (isRouteErrorResponse(error)) {
    return new Error(`Route error ${error.status}: ${error.statusText}`);
  }
  return new Error(String(error));
};

const RouterError = ({ Layout = AppLayout }) => {
  const error = useRouteError();

  // errors caught here never reach window.onerror otherwise
  useEffect(() => {
    if (!error) return;
    if (typeof window.reportError === 'function') {
      window.reportError(toError(error));
    } else {
      setTimeout(() => {
        throw toError(error);
      });
    }
  }, [error]);

  return (
    <Layout>
      <ErrorView />
    </Layout>
  );
};

export default RouterError;
