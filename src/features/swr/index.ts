export const USER_ENDPOINT = '/api/user';
export const apiOptions = '#api_options';
export const API_OPTIONS_ENDPOINT = '/api/user_data/api_options';
export const FIREBASE_ENDPOINT = '/api/firebase';
export const MATCHES_ENDPOINT = '/api/matches';
export const ACTIVE_CALL_ROOMS_ENDPOINT = '/api/call_rooms';
export const NOTIFICATIONS_ENDPOINT = '/api/notifications';
export const UNREAD_NOTIFICATIONS_ENDPOINT = '/api/notifications?filter=unread';
export const CHATS_ENDPOINT = '/api/chats';

export const defaultPreFetchedOptions = {
  revalidateOnMount: false,
  revalidateOnFocus: true,
};

export const useDispatch = () => {
  console.log("TODO don't use me");
};

export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}
