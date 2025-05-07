import useSWR from 'swr';

import {
  UNREAD_NOTIFICATIONS_URL,
  fetchNotifications,
} from '../api/notification.ts';

function useUnreadNotificationCount() {
  const response = useSWR(UNREAD_NOTIFICATIONS_URL, fetchNotifications, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return response;
}

export default useUnreadNotificationCount;
