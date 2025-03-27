import React from 'react';
import styled, { css } from 'styled-components';

import { getAppRoute } from '../../../router/routes.ts';
import MessageCard from '../Cards/MessageCard.jsx';
import AppLayout from '../Layout/AppLayout.tsx';

const ErrorWrapper = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing.xxsmall};
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0px;
    }
  `}
`;

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

export default RouterError;
