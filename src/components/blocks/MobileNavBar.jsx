import {
  Button,
  ButtonVariations,
  Gradients,
  MenuIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { reduce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { useDevelopmentFeaturesStore } from '../../features/stores/index';
import { CHATS_ENDPOINT } from '../../features/swr/index';
import { APP_ROUTE } from '../../router/routes';
import Logo from '../atoms/Logo';
import NotificationBell from '../atoms/NotificationBell';
import UnreadDot from '../atoms/UnreadDot';

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

const HIDE_TITLE_ON_PATHS = ['events', 'edit'];

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userId } = useParams();
  const paths = location.pathname.split('/');

  let key =
    !paths[2] || HIDE_TITLE_ON_PATHS.includes(paths[2]) ? APP_ROUTE : paths[2];

  const hideTitle = key === APP_ROUTE;
  if (key === 'profile' && userId) {
    key = 'user';
  }

  const { data: chats } = useSWR(CHATS_ENDPOINT);

  const unreadCount = reduce(
    chats?.results,
    (sum, chat) => sum + chat.unread_count,
    0,
  );

  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;

  return (
    <MobileHeader>
      <LogoContainer>
        <Logo stacked={false} displayText={hideTitle} asLink />
        {!hideTitle && (
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
