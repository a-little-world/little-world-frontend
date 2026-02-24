import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  DashboardIcon,
  HeartIcon,
  LogoutIcon,
  MessageIcon,
  ProfileIcon,
  QuestionIcon,
  SettingsIcon,
  StackIcon,
} from '@a-little-world/little-world-design-system';
import { reduce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';
import useSWR from 'swr';

import { apiFetch } from '../../api/helpers';
import { environment } from '../../environment';
import {
  useMobileAuthTokenStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import {
  CHATS_ENDPOINT,
  NOTIFICATIONS_ENDPOINT,
  resetUserQueries,
} from '../../features/swr/index';
import { unregisterFirebaseDeviceToken } from '../../firebase-util';
import {
  COMMUNITY_EVENTS_ROUTE,
  HELP_ROUTE,
  LOGIN_ROUTE,
  MESSAGES_ROUTE,
  OUR_WORLD_ROUTE,
  PROFILE_ROUTE,
  RESOURCES_ROUTE,
  SETTINGS_ROUTE,
  getAppRoute,
  isActiveRoute,
} from '../../router/routes';
import Logo from '../atoms/Logo';
import MenuLink, { MenuLinkText } from '../atoms/MenuLink';

const SIDEBAR_WIDTH_MOBILE = '192px';
const SIDEBAR_WIDTH_DESKTOP = '174px';

const SidebarContainer = styled.nav`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  width: ${SIDEBAR_WIDTH_MOBILE};
  height: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 3;
  margin: 0;
  left: ${({ $visibleOnMobile }) => ($visibleOnMobile ? '0' : '-100%')};
  transition: left 0.4s;
  padding: ${({ theme }) => `${theme.spacing.medium} 0 0 0`};

  ${({ theme, $isVH }) => css`
    /* Add fade-out effect */
    &::after {
      content: '';
      position: absolute;
      width: 80%;
      margin: 0 auto;
      bottom: 0;
      left: 0;
      right: 0;
      height: ${theme.spacing.medium};
      background: linear-gradient(
        to bottom,
        transparent 0%,
        ${theme.color.surface.primary} 100%
      );
      pointer-events: none;
      z-index: 1;
      border-radius: 0 0 ${theme.radius.xlarge} ${theme.radius.xlarge};
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      position: relative;
      margin-bottom: auto;
      width: ${SIDEBAR_WIDTH_DESKTOP};
      border-radius: ${theme.radius.xlarge};
      overflow-y: visible;
      left: 0;

      ${$isVH &&
      css`
        flex-shrink: 0;
        min-height: 0;
        max-height: 100%;
        overflow: hidden;
      `}
    }
  `};
`;

const StyledLogo = styled(Logo)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  padding: 0 ${({ theme }) => theme.spacing.medium};
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: auto;
  position: relative;
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.spacing.xxsmall} ${theme.spacing.medium} ${theme.spacing.medium}`};

  ${({ $isScrollable, theme }) =>
    $isScrollable &&
    css`
      @media (min-width: ${theme.breakpoints.medium}) {
        flex: 1;
        min-height: 0;
        max-height: 100%;
      }
    `}
`;

const LogoutButton = styled(Button)`
  flex-shrink: 0;
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

function Sidebar({ isVH, sidebarMobile }) {
  const location = useLocation();
  const { sendMessageToReactNative } = useReceiveHandlerStore();
  const { setTokens } = useMobileAuthTokenStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const startPath =
    getAppRoute(COMMUNITY_EVENTS_ROUTE) === location.pathname
      ? getAppRoute(COMMUNITY_EVENTS_ROUTE)
      : getAppRoute('');

  const buttonData = [
    { label: 'start', path: startPath, Icon: DashboardIcon },
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
      clickEvent: async () => {
        try {
          if (environment.isNative) {
            await sendMessageToReactNative({
              action: 'UNREGISTER_DEVICE_PUSH_TOKEN',
            });
          } else {
            await unregisterFirebaseDeviceToken();
          }
        } catch (_e) {}

        apiFetch(`/api/user/logout/`, {
          method: 'GET',
        })
          .then(() => {
            resetUserQueries();
            if (!environment.isNative) {
              navigate(`/${LOGIN_ROUTE}/`);
            } else {
              setTokens(null, null);
              resetUserQueries();
              navigate(`/${LOGIN_ROUTE}/`);
              setTimeout(() => {
                sendMessageToReactNative({
                  action: 'CLEAR_AUTH_TOKENS',
                  payload: {},
                });
              }, 400);
            }
          })
          .catch(error => {
            // Cannot call logout if isNative manually log-out
            if (environment.isNative) {
              resetUserQueries();
              setTokens(null, null);
              navigate(`/${LOGIN_ROUTE}/`);
              sendMessageToReactNative({
                action: 'CLEAR_AUTH_TOKENS',
                payload: {},
              });
            }
            console.error(error);
          });
      },
    },
  ];

  const [showSidebarMobile, setShowSidebarMobile] = [
    sidebarMobile?.get,
    sidebarMobile?.set,
  ];

  const { data: notifications } = useSWR(NOTIFICATIONS_ENDPOINT);
  const { data: chats } = useSWR(CHATS_ENDPOINT);

  const unread = {
    notifications: notifications?.unread?.results.filter(
      ({ status }) => status === 'unread',
    ),
    messages: reduce(chats?.results, (sum, chat) => sum + chat.unread_count, 0),
  };

  return (
    <>
      <SidebarContainer
        $visibleOnMobile={showSidebarMobile}
        $isVH={isVH && !showSidebarMobile}
      >
        <StyledLogo asLink />
        <SidebarContent $isScrollable={isVH}>
          {buttonData.map(({ label, path, clickEvent, Icon }) => {
            const isActive = isActiveRoute(location.pathname, path);
            const unreadCount = unread[label] ?? 0;

            return typeof clickEvent === typeof undefined ? (
              <MenuLink
                to={path}
                key={label}
                active={isActive}
                Icon={Icon}
                iconLabel={label}
                text={t(`nbs_${label}`)}
                unreadCount={unreadCount}
              />
            ) : (
              <LogoutButton
                key={label}
                type="button"
                variation={ButtonVariations.Option}
                appearance={
                  isActive
                    ? ButtonAppearance.Secondary
                    : ButtonAppearance.Primary
                }
                onClick={clickEvent}
              >
                <LogoutIcon
                  color={theme.color.text.tertiary}
                  label={label}
                  width={32}
                  height={32}
                />
                <MenuLinkText>{t(`nbs_${label}`)}</MenuLinkText>
              </LogoutButton>
            );
          })}
        </SidebarContent>
      </SidebarContainer>
      <MobileOverlay
        onClick={() => setShowSidebarMobile(false)}
        $visibleOnMobile={showSidebarMobile}
      />
    </>
  );
}

export default Sidebar;
