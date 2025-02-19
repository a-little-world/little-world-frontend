import {
  CalendarIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import { formatTimeDistance } from '../../helpers/date.ts';
import { useSelector } from '../../hooks/index.ts';
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

  img.new-friend {
    content: url('../../images/notifications/new-friend.svg');
  }

  .img.missed-call {
    content: url('../../images/notifications/missed-call.svg');
  }
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

  const user = useSelector(state => state.userData.user);
  const usesAvatar = user.profile.image_type === 'avatar';
  const notifications = useSelector(state => state.userData.notifications);

  return (
    <Panel>
      <ProfileInfo>
        <ProfileImage
          circle
          image={usesAvatar ? user.profile.avatar_config : user.profile.image}
          imageType={user?.profile.image_type}
        />
        <Text tag="h3" type={TextTypes.Body3} bold>
          {`${user.profile.first_name} ${user.profile.second_name}`}
        </Text>
      </ProfileInfo>
      <Divider />
      <Text tag="h3" type={TextTypes.Body4}>
        {t('notifications.title')}
      </Text>
      <NotificationList>
        {isEmpty(notifications?.unread?.items) ? (
          <Text center>{t('notifications.none')}</Text>
        ) : (
          notifications?.unread?.items.map(({ hash, title, created_at }) => (
            <Notification key={hash} className="notification-item">
              <CalendarIcon
                circular
                label="appointment notification icon"
                labelId={`${hash}appointment_notification`}
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
      {/* <Link bold to={getAppRoute(NOTIFICATIONS_ROUTE)}>
        {t('notifications.display_all')}
      </Link> */}
    </Panel>
  );
}

export default NotificationPanel;
