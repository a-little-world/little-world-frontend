import {
  ArrowLeftIcon,
  Button,
  ButtonVariations,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { getAppRoute } from '../../routes.ts';

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

const BackButton = styled(Button)`
  color: ${({ theme }) => theme.color.text.link};
`;

function PageHeader({
  canGoBack,
  text,
}: {
  canGoBack?: boolean;
  text: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <HeaderContainer>
      {canGoBack && (
        <BackButton
          variation={ButtonVariations.Icon}
          onClick={() =>
            navigate(location.key === 'default' ? getAppRoute() : -1)
          }
        >
          <ArrowLeftIcon
            labelId="return to profile"
            label="return to profile"
            width="24"
            height="24"
          />
        </BackButton>
      )}
      <Text tag="h2" bold type={TextTypes.Body2}>
        {text}
      </Text>
    </HeaderContainer>
  );
}

export default PageHeader;
