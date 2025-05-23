export const USER_ENDPOINT = '/api/user';
export const apiOptions = '#api_options';
export const API_OPTIONS_ENDPOINT = '/api/user_data/api_options';

export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}
