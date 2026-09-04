import useSWR from 'swr';

import { UNREAD_NOTIFICATIONS_ENDPOINT } from '../api/endpoints';
import { fetchNotifications } from '../api/notification';

function useUnreadNotificationCount() {
  const response = useSWR(UNREAD_NOTIFICATIONS_ENDPOINT, fetchNotifications, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return response;
}

export default useUnreadNotificationCount;
