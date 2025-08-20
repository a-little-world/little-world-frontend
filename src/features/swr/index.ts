import type { SWRConfiguration } from 'swr';
import { mutate } from 'swr';
import { environment } from '../../environment';
import Cookies from 'js-cookie';
import useMobileAuthTokenStore from '../stores/mobileAuthToken';

export const USER_ENDPOINT = '/api/user';
export const COMMUNITY_EVENTS_ENDPOINT = '/api/community';
export const apiOptions = '#api_options';
export const API_OPTIONS_ENDPOINT = '/api/api_options';
export const FIREBASE_ENDPOINT = '/api/firebase';
export const MATCHES_ENDPOINT = '/api/matches';
export const ACTIVE_CALL_ROOMS_ENDPOINT = '/api/call_rooms';
export const NOTIFICATIONS_ENDPOINT = '/api/notifications';
export const UNREAD_NOTIFICATIONS_ENDPOINT = '/api/notifications?filter=unread';
export const CHATS_ENDPOINT = '/api/chats/?page_size=20';
export const CHATS_ENDPOINT_SEPERATE =
  '/api/chats/?page_size=20&pagination=true';
export const API_TRANSLATIONS_ENDPOINT = '/api/translations';

export const getChatEndpoint = (chatId: string) => `/api/chats/${chatId}/`;
export const getChatMessagesEndpoint = (chatId: string, page: number) =>
  `/api/messages/${chatId}/?page=${page}&page_size=20`;
export const getMatchEndpoint = (page: number) =>
  `/api/matches?page=${page}&page_size=10`;
export const getQuestionsEndpoint = (archived: boolean) =>
  `/api/user/question_cards/?archived=${archived}&category=all`;

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body ? JSON.stringify(body) : res.statusText);
  }
  return res.json();
}

export async function nativeFetcher<T>(url: string): Promise<T> {
  
  console.log('url', url);
  
  if (!url.startsWith(environment.backendUrl)) {
    return nativeFetcher(`${environment.backendUrl}${url}`);
  }
  
  const storeToken = useMobileAuthTokenStore.getState().token;
  const cookieToken = Cookies.get('auth_token');
  const effectiveToken = storeToken || cookieToken || null;

  let headers = {
    'X-CSRF-Bypass-Token': environment.csrfBypassToken,
  } as Record<string, string>;

  if (effectiveToken) {
    headers['Authorization'] = `Token ${effectiveToken}`;
  }
  
  console.log('headers', headers);
  
  const res = await fetch(url, {
    headers,
    credentials: 'include',
  });
  

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body ? JSON.stringify(body) : res.statusText);
  }
  return res.json();
}

export const revalidateMatches = () => {
  mutate(key => typeof key === 'string' && key.startsWith(MATCHES_ENDPOINT));
};

export const revalidateChats = () => {
  mutate(key => typeof key === 'string' && key.startsWith(CHATS_ENDPOINT));
};

export const resetUserQueries = () => {
  mutate(
    key =>
      typeof key === 'string' &&
      (key.includes(USER_ENDPOINT) ||
        key.includes(MATCHES_ENDPOINT) ||
        key.includes(NOTIFICATIONS_ENDPOINT)),
    undefined,
  );
};

export const nativeSwrConfig: SWRConfiguration = {
  fetcher: nativeFetcher,
};

export const swrConfig: SWRConfiguration = {
  fetcher,
};
