export const USER_ENDPOINT = '/api/user';
export const COMMUNITY_EVENTS_ENDPOINT = "/api/community"
export const apiOptions = '#api_options';
export const API_OPTIONS_ENDPOINT = '/api/api_options';
export const FIREBASE_ENDPOINT = '/api/firebase';
export const MATCHES_ENDPOINT = '/api/matches';
export const ACTIVE_CALL_ROOMS_ENDPOINT = '/api/call_rooms';
export const NOTIFICATIONS_ENDPOINT = '/api/notifications';
export const UNREAD_NOTIFICATIONS_ENDPOINT = '/api/notifications?filter=unread';
export const CHATS_ENDPOINT = '/api/chats';
export const API_TRANSLATIONS_ENDPOINT = '/api/api_translations';

export const getChatEndpoint = (chatId: string) => `/api/chats/${chatId}/`;
export const getQuestionsEndpoint = (archived: boolean) => `/api/user/question_cards/?archived=${archived}&category=all`;

export const useDispatch = () => {
  console.log("TODO don't use me");
};

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body ? JSON.stringify(body) : res.statusText);
  }
  return res.json();
}
