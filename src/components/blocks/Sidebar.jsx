import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  DashboardIcon,
  Gradients,
  LogoutIcon,
  MessageIcon,
  ProfileIcon,
  QuestionIcon,
  SettingsIcon,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { BACKEND_URL } from '../../ENVIRONMENT';
import {
  APP_ROUTE,
  CHAT_ROUTE,
  HELP_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SETTINGS_ROUTE,
  getAppRoute,
} from '../../routes';
import Logo from '../atoms/Logo';
import MenuLink from '../atoms/MenuLink';

const Unread = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xxsmall};
  right: ${({ theme }) => theme.spacing.xxsmall};
  background: ${({ theme }) => theme.color.surface.highlight};
  color: ${({ theme }) => theme.color.text.button};
  height: 16px;
  aspect-ratio: 1;
  border-radius: 100%;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
`;

const StyledLogo = styled(Logo)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

function UnreadDot({ count }) {
  return <Unread>{count}</Unread>;
}

function Sidebar({ sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttonData = [
    { label: 'start', path: getAppRoute(), Icon: DashboardIcon },
    { label: 'messages', path: getAppRoute(CHAT_ROUTE), Icon: MessageIcon },
    {
      label: 'my_profile',
      path: getAppRoute(PROFILE_ROUTE),
      Icon: ProfileIcon,
    },
    { label: 'help', path: getAppRoute(HELP_ROUTE), Icon: QuestionIcon },
    {
      label: 'settings',
      path: getAppRoute(SETTINGS_ROUTE),
      Icon: SettingsIcon,
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

  const unread = {
    notifications: notifications.unread.items.filter(
      ({ status }) => status === 'unread',
    ),
    messages: [],
  };

  return (
    <>
      <div className={showSidebarMobile ? 'sidebar' : 'sidebar hidden'}>
        <StyledLogo />
        {buttonData.map(({ label, path, clickEvent, Icon }) => {
          const isActive = location.pathname === `/${APP_ROUTE}${path}`;
          return typeof clickEvent === typeof undefined ? (
            <MenuLink
              to={path}
              key={label}
              $appearance={
                isActive ? ButtonAppearance.Secondary : ButtonAppearance.Primary
              }
            >
              {['messages', 'notifications'].includes(label) &&
                Boolean(unread[label].length) && (
                  <UnreadDot count={unread[label].length} />
                )}
              <Icon
                label={label}
                labelId={label}
                {...(isActive
                  ? { color: 'white' }
                  : { gradient: Gradients.Blue })}
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
      </div>
      <div
        className="mobile-shade"
        onClick={() => setShowSidebarMobile(false)}
      />
    </>
  );
}

export default Sidebar;
