import {
  BellIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  NotificationState,
  useUnreadNotificationCount,
} from '../../api/notification.ts';
import { NOTIFICATIONS_ROUTE } from '../../routes.ts';
import UnreadDot from './UnreadDot.tsx';

const StyledNotificationBell = styled(Button)`
  outline: 2px solid ${({ theme }) => theme.color.surface.secondary};
  outline-offset: 4px;
  border-radius: 50%;
`;

const UNREAD_NOTIFICATIONS_LINK = `/app/${NOTIFICATIONS_ROUTE}?filter=${NotificationState.UNREAD}`;

function NotificationBell({ className }: { className?: string }) {
  const notifications = useUnreadNotificationCount();
  const count = notifications.data?.count ?? 0;
  const navigate = useNavigate();

  const onClick = () => {
    navigate(UNREAD_NOTIFICATIONS_LINK);
  };

  return (
    <StyledNotificationBell
      variation={ButtonVariations.Icon}
      size={ButtonSizes.Medium}
      className={className}
      onClick={onClick}
    >
      {count > 0 && <UnreadDot count={count} onIcon />}
      <BellIcon
        labelId="bell_icon"
        label=" all notifications"
        width="16px"
        height="16px"
      />
    </StyledNotificationBell>
  );
}

export default NotificationBell;
