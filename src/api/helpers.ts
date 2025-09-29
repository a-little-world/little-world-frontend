import Cookies from 'js-cookie';

import { API_FIELDS } from '../constants/index';
import { environment } from '../environment';
import useMobileAuthTokenStore from '../features/stores/mobileAuthToken';

// Add DOM types for fetch API
type RequestCredentials = 'omit' | 'same-origin' | 'include';
type RequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  credentials?: RequestCredentials;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiFetchOptions {
  method?: HttpMethod;
  body?: object | FormData;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  useTagsOnly?: boolean;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

export const formatApiError = (responseBody: any, response: any) => {
  const apiError: ApiError = new Error('API request failed');
  apiError.status = response.status;
  apiError.statusText = response.statusText;
  apiError.data = responseBody;
  if (typeof responseBody === 'string') {
    apiError.message = responseBody;
  } else {
    const responseObj: Record<string, any> = responseBody || {};
    const errorTypeApi = Object.keys(responseObj)?.[0];
    const errorType =
      API_FIELDS[errorTypeApi as keyof typeof API_FIELDS] ?? errorTypeApi;
    const errorTags = Object.values(responseObj)?.[0] as any;
    const errorTag = Array.isArray(errorTags) ? errorTags[0] : errorTags;

    apiError.cause = errorType ?? null;
    apiError.message =
      apiError.data?.message || errorTag || apiError.statusText;
  }

  return apiError;
};

function getNativeHeaders(): Record<string, string> {
  const { accessToken } = useMobileAuthTokenStore.getState();

  const headers = {
    'X-CSRF-Bypass-Token': environment.csrfBypassToken,
  } as Record<string, string>;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export async function nativeRefreshAccessToken(): Promise<boolean> {
  if (!environment.isNative) return false;
  const { refreshToken, setTokens } = useMobileAuthTokenStore.getState();
  if (!refreshToken) return false;

  try {
    const response = await fetch(
      `${environment.backendUrl}/api/token/refresh`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'same-origin',
      } as RequestInit,
    );

    if (!response.ok) {
      return false;
    }
    const { access, refresh } = await response.json().catch(() => {});
    setTokens(access ?? null, refresh ?? null);
    if (access && refresh) {
      return true;
    }
    return false;
  } catch (_e) {
    return false;
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    credentials = 'same-origin',
    useTagsOnly = true,
  } = options;

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
    // 'ngrok-skip-browser-warning': '69420', use for development only!
  };

  if (useTagsOnly) {
    defaultHeaders['X-UseTagsOnly'] = 'true';
  }

  const nativeHeaders = environment.isNative ? getNativeHeaders() : {};

  const fetchOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers, ...nativeHeaders },
    credentials,
  };

  if (body) {
    if (body instanceof FormData) {
      fetchOptions.body = body;
      // Remove Content-Type header when sending FormData
      delete (fetchOptions.headers as Record<string, string>)['Content-Type'];
    } else {
      fetchOptions.body = JSON.stringify(body);
    }
  }

  const doFetch = async (): Promise<T> => {
    const response = await fetch(
      `${environment.backendUrl}${endpoint}`,
      fetchOptions,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw formatApiError(errorData, response);
    }

    try {
      return (await response.json()) as T;
    } catch (_e) {
      return null as T;
    }
  };

  try {
    return await doFetch();
  } catch (error: any) {
    // If 401 on native, try to refresh and retry once
    const status = error?.status;
    if (environment.isNative && status === 401) {
      const refreshed = await nativeRefreshAccessToken();
      if (refreshed) {
        // update Authorization header with new access token
        const { accessToken } = useMobileAuthTokenStore.getState();
        if (accessToken) {
          fetchOptions.headers!.Authorization = `Bearer ${accessToken}`;
        } else {
          delete fetchOptions.headers!.Authorization;
        }
        return doFetch();
      }
    }
    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error;
  }
}
