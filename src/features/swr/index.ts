import type { SWRConfiguration } from 'swr';
import { mutate } from 'swr';
import { apiFetch } from '../../../src/api/helpers.ts';
export const USER_ENDPOINT = '/api/user';
export const COMMUNITY_EVENTS_ENDPOINT = "/api/community";
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
export const API_TRANSLATIONS_ENDPOINT = '/api/api_translations';
export const RANDOM_CALL_LOBBY_ENDPOINT = '/api/random_calls/get_all_lobby';

export const getChatEndpoint = (chatId: string) => `/api/chats/${chatId}/`;
export const getChatMessagesEndpoint = (chatId: string, page: number) =>
  `/api/messages/${chatId}/?page=${page}&page_size=20`;
export const getMatchEndpoint = (page: number) =>
  `/api/matches?page=${page}&page_size=10`;
export const getQuestionsEndpoint = (archived: boolean) =>
  `/api/user/question_cards/?archived=${archived}&category=all`;
  
export const getRandomCallStatusEndpoint = (matchId: string) => `/api/random_calls/status/${matchId}`;

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body ? JSON.stringify(body) : res.statusText);
  }
  return res.json();
}

type PostResponse = {
  updatedAt: number;
  res: {
    token: string;
    server_url: string;
    chat: JSON;
    room: string;
  };
};

export async function postFetcher(userId: string): Promise<PostResponse> {
  const res = await apiFetch(`/api/random_calls/get_token_random_call`, {
    method: 'POST',
    useTagsOnly: true,
    body: { userId },
  });

  const resJson = await res.json();
  console.log(resJson)

  if (!res.ok) {
    throw new Error(resJson ? JSON.stringify(resJson) : res.statusText);
  }

  return {
    updatedAt: Date.now(),
    res: resJson,
  };
}

export const revalidateMatches = () => {
  mutate(key => typeof key === 'string' && key.startsWith(MATCHES_ENDPOINT));
};

export const swrConfig: SWRConfiguration = {
  fetcher,
};
