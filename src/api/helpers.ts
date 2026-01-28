import Cookies from 'js-cookie';

import { API_FIELDS } from '../constants/index';
import { environment } from '../environment';
import {
  IntegrityCheck,
  getIntegrityCheckRequestData,
} from '../features/integrityCheck';
import useMobileAuthTokenStore from '../features/stores/mobileAuthToken';
import useReceiveHandlerStore from '../features/stores/receiveHandler';
import { LOGIN_ROUTE } from '../router/routes';

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

function updateTokens(
  accessToken: string | undefined,
  refreshToken: string | undefined,
) {
  const { setTokens } = useMobileAuthTokenStore.getState();
  const { sendMessageToReactNative } = useReceiveHandlerStore.getState();

  setTokens(accessToken, refreshToken);
  sendMessageToReactNative?.({
    action: 'SET_AUTH_TOKENS',
    payload: {
      accessToken,
      refreshToken,
    },
  });
}

let tokenRefreshRequest: Promise<boolean> | null = null;
export async function nativeRefreshAccessToken(): Promise<boolean> {
  if (!environment.isNative) return false;

  if (tokenRefreshRequest) {
    return tokenRefreshRequest;
  }

  tokenRefreshRequest = (async () => {
    try {
      const { refreshToken } = useMobileAuthTokenStore.getState();
      if (!refreshToken) return false;

      const { sendMessageToReactNative } = useReceiveHandlerStore.getState();
      if (!sendMessageToReactNative) {
        return false;
      }

      const challengeData: IntegrityCheck = await sendMessageToReactNative({
        action: 'GET_INTEGRITY_TOKEN',
        payload: {},
      }).then(res => {
        if (!res.ok) {
          throw new Error(res.error);
        }
        return res.data;
      });

      const response = await fetch(
        `${environment.backendUrl}/api/token/refresh/${challengeData.platform}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
            ...getIntegrityCheckRequestData(challengeData),
          }),
          credentials: 'same-origin',
        } as RequestInit,
      );

      if (!response.ok) {
        updateTokens(undefined, undefined);
        return false;
      }
      const { access, refresh } = await response.json().catch(() => {});
      if (access && refresh) {
        updateTokens(access, refresh);
        return true;
      }
      updateTokens(undefined, undefined);
      return false;
    } catch (_e) {
      return false;
    } finally {
      tokenRefreshRequest = null;
    }
  })();

  return tokenRefreshRequest;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  if (tokenRefreshRequest) {
    // in case we are already loading a new token, wait before sending any new requests. They would fail anyway due to the
    // invalid access  token
    await tokenRefreshRequest;
  }

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
  };
  if (environment.allowNgrokRequests) {
    defaultHeaders['ngrok-skip-browser-warning'] = '69420';
  }

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
      if (errorData?.code === 'token_not_valid') {
        throw errorData;
      }
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
    // If access token expired, try to refresh and retry once
    const tokenExpired = error?.code === 'token_not_valid';
    const noTokenPresent =
      error?.status === 403 &&
      useMobileAuthTokenStore.getState().accessToken === undefined;
    if (environment.isNative && (tokenExpired || noTokenPresent)) {
      const refreshed = await nativeRefreshAccessToken();
      const { sendMessageToReactNative } = useReceiveHandlerStore.getState();
      if (refreshed) {
        // update Authorization header with new access token
        const { accessToken, refreshToken } =
          useMobileAuthTokenStore.getState();
        sendMessageToReactNative?.({
          action: 'SET_AUTH_TOKENS',
          payload: { accessToken, refreshToken },
        });
        if (accessToken) {
          fetchOptions.headers!.Authorization = `Bearer ${accessToken}`;
        } else {
          throw new Error('Token refresh successful but returned no tokens');
        }
        return doFetch();
      }

      sendMessageToReactNative?.({
        action: 'NAVIGATE',
        payload: { path: `/${LOGIN_ROUTE}?sessionExpired=true` },
      });
    }

    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error;
  }
}
