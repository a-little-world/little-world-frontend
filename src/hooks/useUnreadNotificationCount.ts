import useSWR from 'swr';

import { fetchNotifications } from '../api/notification';
import { UNREAD_NOTIFICATIONS_ENDPOINT } from '../features/swr/index';

function useUnreadNotificationCount() {
  const response = useSWR(UNREAD_NOTIFICATIONS_ENDPOINT, fetchNotifications, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return response;
}

export default useUnreadNotificationCount;
