import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../atoms/Logo';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const Title = styled(Text)``;

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userPk } = location.state || {};
  const key =
    location.pathname.split('/').slice(-1)[0] || (userPk ? 'user' : 'home');
  const isHome = key === 'home';

  return (
    <div className="mobile-header">
      <button
        type="button"
        className="menu"
        onClick={() => setShowSidebarMobile(true)}
      >
        <img alt="open menu" />
      </button>
      <LogoContainer>
        <Logo stacked={false} displayText={isHome} />
        {!isHome && (
          <Title tag="h1" type={TextTypes.Heading2} color="black">
            {t(`headers::${key}`)}
          </Title>
        )}
      </LogoContainer>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

export default MobileNavBar;
