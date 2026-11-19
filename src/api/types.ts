export enum TokenStatus {
  VALID,
  EXPIRED,
  MISSING,
  ERROR,
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

export type SerializedFormDataEntry = [
  string,
  string | { base64: string; name: string; type: string },
];

export interface ApiFetchOptions {
  method?: HttpMethod;
  body?: object | FormData;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  useTagsOnly?: boolean;
  // FormData can't cross native bridge
  formData?: SerializedFormDataEntry[];
}

export type ApiFetchFn<T = any> = (
  endpoint: string,
  options?: ApiFetchOptions,
) => Promise<T>;
