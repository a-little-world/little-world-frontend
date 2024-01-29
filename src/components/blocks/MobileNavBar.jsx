import { Button, ButtonVariations, Gradients, MenuIcon, Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Logo from '../atoms/Logo';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const Title = styled(Text)``;

const MobileHeader = styled.div`
  display: flex;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: unset;
  margin: unset;
  position: sticky;
  top: 0;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `};
`;

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userPk } = location.state || {};
  const key =
    location.pathname.split('/').slice(-1)[0] || (userPk ? 'user' : 'home');
  const isHome = key === 'home';

  return (
    <MobileHeader className="mobile-header">
      <Button
        type="button"
        variation={ButtonVariations.Icon}
        onClick={() => setShowSidebarMobile(true)}
      >
        <MenuIcon label="open menu" labelId='open-menu' circular width={24} height={24} gradient={Gradients.Blue} />
      </Button>
      <LogoContainer>
        <Logo stacked={false} displayText={isHome} />
        {!isHome && (
          <Title tag="h1" type={TextTypes.Heading4}>
            {t(`headers::${key}`)}
          </Title>
        )}
      </LogoContainer>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </MobileHeader>
  );
}

export default MobileNavBar;
