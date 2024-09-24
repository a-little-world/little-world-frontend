import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  DashboardIcon,
  Gradients,
  HeartIcon,
  LogoutIcon,
  MessageIcon,
  ProfileIcon,
  QuestionIcon,
  SettingsIcon,
  StackIcon,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import { reduce } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';

import { BACKEND_URL } from '../../ENVIRONMENT';
import {
  HELP_ROUTE,
  LOGIN_ROUTE,
  MESSAGES_ROUTE,
  OUR_WORLD_ROUTE,
  PROFILE_ROUTE,
  RESOURCES_ROUTE,
  SETTINGS_ROUTE,
  getAppRoute,
  isActiveRoute,
} from '../../routes.ts';
import Logo from '../atoms/Logo.tsx';
import MenuLink from '../atoms/MenuLink.tsx';
import UnreadDot from '../atoms/UnreadDot.tsx';

const SidebarContainer = styled.nav`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};

  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 3;
  margin: 0;
  left: 0;
  transition: left 0.4s;
  overflow-y: scroll;
  width: fit-content;
  left: ${({ $visibleOnMobile }) => ($visibleOnMobile ? '0' : '-100%')};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      position: relative;
      margin-bottom: auto;
      width: unset;
      border-radius: 30px;
      overflow-y: visible;
      left: 0;
    }
  `};
`;

const StyledLogo = styled(Logo)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const MobileOverlay = styled.div`
  opacity: ${({ $visibleOnMobile }) => ($visibleOnMobile ? 1 : 0)};
  pointer-events: none;
  display: ${({ $visibleOnMobile }) => ($visibleOnMobile ? 'block' : 'none')};
  background: rgb(0 0 0 / 30%);
  z-index: 2;
  position: fixed;
  height: 100vh;
  width: 100vw;
  pointer-events: all;
  transition: opacity 0.5s;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `};
`;

function Sidebar({ sidebarMobile }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const buttonData = [
    { label: 'start', path: getAppRoute(), Icon: DashboardIcon },
    { label: 'messages', path: getAppRoute(MESSAGES_ROUTE), Icon: MessageIcon },
    {
      label: 'my_profile',
      path: getAppRoute(PROFILE_ROUTE),
      Icon: ProfileIcon,
    },
    {
      label: 'resources',
      path: getAppRoute(RESOURCES_ROUTE),
      Icon: StackIcon,
    },
    { label: 'help', path: getAppRoute(HELP_ROUTE), Icon: QuestionIcon },
    {
      label: 'settings',
      path: getAppRoute(SETTINGS_ROUTE),
      Icon: SettingsIcon,
    },
    {
      label: 'about_us',
      path: getAppRoute(OUR_WORLD_ROUTE),
      Icon: HeartIcon,
    },
    {
      label: 'log_out',
      clickEvent: () => {
        fetch(`${BACKEND_URL}/api/user/logout/`, {
          method: 'GET',
          headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        })
          .then(response => {
            if (response.status === 200) {
              dispatch({ type: 'userData/reset', payload: {} }); // clears all existing user data
              navigate(`/${LOGIN_ROUTE}/`); // Redirect only valid in production
            } else {
              console.error(
                'server error',
                response.status,
                response.statusText,
              );
            }
          })
          .catch(error => console.error(error));
      },
    },
  ];

  const [showSidebarMobile, setShowSidebarMobile] = [
    sidebarMobile?.get,
    sidebarMobile?.set,
  ];

  const notifications = useSelector(state => state.userData.notifications);
  const chats = useSelector(state => state.userData.chats);

  const unread = {
    notifications: notifications?.unread?.items.filter(
      ({ status }) => status === 'unread',
    ),
    messages: reduce(chats.results, (sum, chat) => sum + chat.unread_count, 0),
  };

  return (
    <>
      <SidebarContainer $visibleOnMobile={showSidebarMobile}>
        <StyledLogo asLink />
        {buttonData.map(({ label, path, clickEvent, Icon, iconProps }) => {
          const isActive = isActiveRoute(location.pathname, path);
          const unreadCount = unread[label] ?? 0;

          return typeof clickEvent === typeof undefined ? (
            <MenuLink
              to={path}
              key={label}
              $appearance={
                isActive ? ButtonAppearance.Secondary : ButtonAppearance.Primary
              }
            >
              {!!unreadCount && <UnreadDot count={unreadCount} />}
              <Icon
                label={label}
                labelId={label}
                {...(isActive ?
                  { color: theme.color.surface.primary } :
                  { gradient: Gradients.Blue })}
                {...iconProps}
              />
              {t(`nbs_${label}`)}
            </MenuLink>
          ) : (
            <Button
              key={label}
              type="button"
              variation={ButtonVariations.Option}
              appearance={
                isActive ? ButtonAppearance.Secondary : ButtonAppearance.Primary
              }
              onClick={clickEvent}
            >
              <LogoutIcon color="#5f5f5f" label={label} labelId={label} />
              {t(`nbs_${label}`)}
            </Button>
          );
        })}
      </SidebarContainer>
      <MobileOverlay
        onClick={() => setShowSidebarMobile(false)}
        $visibleOnMobile={showSidebarMobile}
      />
    </>
  );
}

export default Sidebar;
