import {
  CalendarIcon,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';
import useSWR from 'swr';

import { useDevelopmentFeaturesStore } from '../../features/stores/index.ts';
import {
  UNREAD_NOTIFICATIONS_ENDPOINT,
  USER_ENDPOINT,
} from '../../features/swr/index.ts';
import { formatTimeDistance } from '../../helpers/date.ts';
import { NOTIFICATIONS_ROUTE, getAppRoute } from '../../router/routes.ts';
import ProfileImage from '../atoms/ProfileImage';

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const Panel = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  margin-left: auto;
  margin-bottom: auto;
  flex: 0 1 350px;
  display: none;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => css`
    gap: ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.border.subtle};
`;

const NotificationList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const Notification = styled.li`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.color.border.minimal};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.radius.small};
  gap: ${({ theme }) => theme.spacing.small};
`;

const NotificationTitle = styled(Text)`
  max-width: 200px;
  text-wrap: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
`;

const Time = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

function NotificationPanel() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();

  const { data: user } = useSWR(USER_ENDPOINT);
  const usesAvatar = (user as any)?.profile.image_type === 'avatar';
  const { data: unreadNotifications } = useSWR(UNREAD_NOTIFICATIONS_ENDPOINT);
  const areDevFeaturesEnabled = useDevelopmentFeaturesStore().enabled;

  return (
    <Panel>
      <ProfileInfo>
        <ProfileImage
          circle
          image={usesAvatar ? user?.profile.avatar_config : user?.profile.image}
          imageType={user?.profile.image_type}
        />
        <Text tag="h3" type={TextTypes.Body3} bold>
          {`${user?.profile.first_name} ${user?.profile.second_name}`}
        </Text>
      </ProfileInfo>
      <Divider />
      {areDevFeaturesEnabled ? (
        <Link bold to={getAppRoute(NOTIFICATIONS_ROUTE)}>
          {t('notifications.title')}
        </Link>
      ) : (
        <Text tag="h3" type={TextTypes.Body4}>
          {t('notifications.title')}
        </Text>
      )}
      <NotificationList>
        {isEmpty(unreadNotifications?.results) ? (
          <Text center>{t('notifications.none')}</Text>
        ) : (
          unreadNotifications?.results.map(({ hash, title, created_at }) => (
            <Notification key={hash} className="notification-item">
              <CalendarIcon
                circular
                label="appointment notification icon"
                backgroundColor={theme.color.surface.message}
                borderColor={theme.color.surface.message}
                color={theme.color.text.highlight}
                width="24"
                height="24"
              />
              <Info>
                <NotificationTitle type={TextTypes.Body5}>
                  {title}
                </NotificationTitle>
                <Time type={TextTypes.Body6}>
                  {formatTimeDistance(
                    new Date(created_at),
                    new Date(),
                    language,
                  )}
                </Time>
              </Info>
            </Notification>
          ))
        )}
      </NotificationList>
    </Panel>
  );
}

export default NotificationPanel;
