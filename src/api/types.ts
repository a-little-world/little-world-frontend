export enum TokenStatus {
  VALID,
  EXPIRED,
  MISSING,
}

// Add DOM types for fetch API
export type RequestCredentials = 'omit' | 'same-origin' | 'include';
export type RequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
  credentials?: RequestCredentials;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

export interface ApiFetchOptions {
  method?: HttpMethod;
  body?: object | FormData;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  useTagsOnly?: boolean;
}

export type ApiFetchFn<T = any> = (
  endpoint: string,
  options?: ApiFetchOptions,
) => Promise<T>;

export default TokenStatus;
