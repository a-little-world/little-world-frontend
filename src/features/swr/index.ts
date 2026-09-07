import { mutate, SWRConfiguration } from 'swr';

import {
  CHATS_ENDPOINT,
  MATCHES_ENDPOINT,
  NOTIFICATIONS_ENDPOINT,
  USER_ENDPOINT,
} from '../../api/endpoints';
import { apiFetch } from '../../api/helpers';

export const revalidateMatches = () =>
  mutate(
    key => typeof key === 'string' && key.startsWith(MATCHES_ENDPOINT),
    undefined,
    { revalidate: true },
  );

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

export const swrConfig: SWRConfiguration = {
  fetcher: apiFetch,
};
