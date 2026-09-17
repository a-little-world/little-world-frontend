import { apiFetch } from './helpers';

export const COOKIE_SETTINGS_ENDPOINT = '/api/cookies/';

export type CookieInfo = {
  name: string;
  description: string;
  domain: string;
  path: string;
};

export type CookieState = 'accepted' | 'declined' | 'unset';

export type CookieGroupInfo = {
  varname: string;
  name: string;
  description: string;
  is_required: boolean;
  state: CookieState;
  cookies: CookieInfo[];
};

export type CookieSettingsResponse = {
  groups: CookieGroupInfo[];
};

export type CookiePreferences = Record<string, boolean>;

export const fetchCookieSettings = () =>
  apiFetch<CookieSettingsResponse>(COOKIE_SETTINGS_ENDPOINT);

export const updateCookieSettings = (preferences: CookiePreferences) =>
  apiFetch<CookieSettingsResponse>(COOKIE_SETTINGS_ENDPOINT, {
    method: 'POST',
    body: { preferences },
  });
