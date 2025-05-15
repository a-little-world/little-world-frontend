import {
  BellIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Gradients,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { NotificationState } from '../../api/notification.ts';
import useUnreadNotificationCount from '../../hooks/useUnreadNotificationCount.ts';
import { NOTIFICATIONS_ROUTE } from '../../router/routes.ts';
import UnreadDot from './UnreadDot.tsx';

const UNREAD_NOTIFICATIONS_LINK = `/app/${NOTIFICATIONS_ROUTE}?filter=${NotificationState.UNREAD}`;

function NotificationBell({ className }: { className?: string }) {
  const notifications = useUnreadNotificationCount();
  const count = notifications.data?.count ?? 0;
  const navigate = useNavigate();

  const onClick = () => {
    navigate(UNREAD_NOTIFICATIONS_LINK);
  };

  return (
    <Button
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
        gradient={Gradients.Blue}
      />
    </Button>
  );
}

export default NotificationBell;
