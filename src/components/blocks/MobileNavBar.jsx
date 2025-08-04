import {
  Button,
  ButtonVariations,
  Gradients,
  MenuIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { reduce } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { useDevelopmentFeaturesStore } from '../../features/stores/index.ts';
import { CHATS_ENDPOINT } from '../../features/swr/index.ts';
import { APP_ROUTE } from '../../router/routes.ts';
import Logo from '../atoms/Logo.tsx';
import NotificationBell from '../atoms/NotificationBell.tsx';
import UnreadDot from '../atoms/UnreadDot.tsx';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const Title = styled(Text)``;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: unset;
  margin: unset;
  position: sticky;
  top: 0;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `};
`;

const StyledNotificationBell = styled(NotificationBell)`
  margin-left: auto;
`;

const specialPaths = ['chat', 'profile'];

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userId } = useParams();
  const paths = location.pathname.split('/');
  // routes use different parts of the path to determine the header
  let key =
    (specialPaths.includes(paths[2]) ? paths[2] : paths.slice(-1)[0]) ||
    APP_ROUTE;

  const isHome = key === APP_ROUTE;
  if (key === 'profile' && userId) {
    key = 'user';
  } else if (paths.includes('trainings')) key = 'trainings';
  else if (paths.includes('partners')) key = 'partners';

  const { data: chats } = useSWR(CHATS_ENDPOINT);

  const unreadCount = reduce(
    chats?.results,
    (sum, chat) => sum + chat.unread_count,
    0,
  );

  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;

  return (
    <MobileHeader className="mobile-header">
      <LogoContainer>
        <Logo stacked={false} displayText={isHome} asLink />
        {!isHome && (
          <Title tag="h1" type={TextTypes.Body1} bold>
            {t(`headers::${key}`)}
          </Title>
        )}
      </LogoContainer>
      {areDevFeaturesEnabled && <StyledNotificationBell />}
      <Button
        type="button"
        variation={ButtonVariations.Icon}
        onClick={() => setShowSidebarMobile(true)}
      >
        <MenuIcon
          label="open menu"
          labelId="open-menu"
          width={24}
          height={24}
          gradient={Gradients.Blue}
        />
        {!!unreadCount && <UnreadDot count={unreadCount} onIcon />}
      </Button>
    </MobileHeader>
  );
}

export default MobileNavBar;
