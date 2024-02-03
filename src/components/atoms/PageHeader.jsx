import {
  ArrowLeftIcon,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import styled, { css } from 'styled-components';

import { getAppRoute } from '../../routes';

const HeaderContainer = styled.div`
  display: none;
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 30px;
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: flex;
      align-items: center;
    }
  `}
`;

function PageHeader({ canGoBack, text }) {
  return (
    <HeaderContainer>
      {canGoBack && (
        <Link to={getAppRoute()}>
          <ArrowLeftIcon
            labelId="return to profile"
            label="return to profile"
            width="24"
            height="24"
          />
        </Link>
      )}
      <Text tag="h2" bold type={TextTypes.Body2}>
        {text}
      </Text>
    </HeaderContainer>
  );
}

export default PageHeader;
