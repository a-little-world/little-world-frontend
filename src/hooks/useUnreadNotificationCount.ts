import useSWR from "swr";
import { fetchNotifications, UNREAD_NOTIFICATIONS_URL } from "../api/notification";

function useUnreadNotificationCount() {
    const response = useSWR(UNREAD_NOTIFICATIONS_URL, fetchNotifications, {
      revalidateOnFocus: false,
      keepPreviousData: true,
    });
  
    return response;
  }

  export default useUnreadNotificationCount;