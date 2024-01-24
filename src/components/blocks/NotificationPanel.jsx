import {
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { NOTIFICATIONS_ROUTE, getAppRoute } from '../../routes';
import ProfileImage from '../atoms/ProfileImage';

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

function NotificationPanel() {
  const { t } = useTranslation();

  const user = useSelector(state => state.userData.user);
  const usesAvatar = user.profile.image_type === 'avatar';
  const matches = useSelector(state => state.userData.matches);
  const usersDisplay = [...matches.confirmed.items, ...matches.proposed.items];
  const notifications = useSelector(state => state.userData.notifications);

  return (
    <div className="notification-panel">
      <ProfileInfo className="active-user">
        <ProfileImage
          circle
          image={usesAvatar ? user.profile.avatar_config : user.profile.image}
          imageType={user.profile.image_type}
        />
        <Text tag="h3" type={TextTypes.Body3} bold>
          {`${user.profile.first_name} ${user.profile.second_name}`}
        </Text>
      </ProfileInfo>
      <hr />
      <div className="notifications-header">{t('nbr_notifications')}</div>
      <div className="notifications-content">
        {notifications.unread.items.map(({ hash, type, title, created_at }) => (
          <div key={hash} className="notification-item">
            <img className="appointment" alt={type} />
            <div className="info">
              <div className="notification-headline">{title}</div>
              <div className="notification-time">{created_at}</div>
            </div>
          </div>
        ))}
      </div>
      {/* <Link bold to={getAppRoute(NOTIFICATIONS_ROUTE)}>
        {t('nbr_show_all')}
      </Link> */}
    </div>
  );
}

export default NotificationPanel;
