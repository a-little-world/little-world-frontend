import Cookies from 'js-cookie';
import { mutate } from 'swr';

import { API_FIELDS } from '../constants/index';
import { environment } from '../environment';
import {
  debugStore,
  useDebugStore,
  useNavigationStore,
} from '../features/stores';
import useNativeStore from '../features/stores/nativeStore';
import { LOGIN_ROUTE } from '../router/routes';
import { ApiError, ApiFetchOptions, RequestInit } from './types';

export function getEffectiveBackendUrl(): string {
  return debugStore.getState().backendUrlOverride ?? environment.backendUrl;
}

export function useEffectiveBackendUrl(): string {
  const { backendUrlOverride } = useDebugStore();
  return (
    backendUrlOverride ??
    (environment.backendUrl ||
      (typeof window !== 'undefined' ? window.location.origin : ''))
  );
}

function getCoreWsScheme(backendUrl: string): string {
  return `ws${backendUrl.startsWith('https') ? 's' : ''}://`;
}

export function getEffectiveCoreWsScheme(): string {
  const effectiveBackendUrl = getEffectiveBackendUrl();
  return getCoreWsScheme(effectiveBackendUrl);
}

export function useEffectiveCoreWsScheme(): string {
  const effectiveBackendUrl = useEffectiveBackendUrl();
  return getCoreWsScheme(effectiveBackendUrl);
}

export async function clearSwrCache(revalidate = true) {
  await mutate(
    () => true, // Match all cache keys
    undefined, // Set data to undefined
    { revalidate },
  );
}

export async function navigateToLogin(expired: boolean = false): Promise<void> {
  const currentPath = (window?.location?.hash ?? '').replaceAll('#', '');
  if (
    currentPath.startsWith(`/${LOGIN_ROUTE}`) &&
    (!expired || currentPath.includes('?sessionExpired=true'))
  ) {
    // prevent subsequent navigations from overriding expiration status
    return;
  }

  if (environment.isNative) {
    await clearSwrCache(false);
  }

  const path = `/${LOGIN_ROUTE}${expired ? '?sessionExpired=true' : ''}`;
  const { navigate } = useNavigationStore.getState();
  navigate?.(path);
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

async function apiFetchWeb<T = any>(
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
  };
  if (environment.allowNgrokRequests) {
    defaultHeaders['ngrok-skip-browser-warning'] = '69420';
  }

  if (useTagsOnly) {
    defaultHeaders['X-UseTagsOnly'] = 'true';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: { ...defaultHeaders, ...headers },
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
      `${getEffectiveBackendUrl()}${endpoint}`,
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
    console.error(`API Fetch Error (${endpoint}):`, error);
    throw error;
  }
}

export const apiFetch: typeof apiFetchWeb = environment.isNative
  ? useNativeStore.getState().apiFetchNative
  : apiFetchWeb;
