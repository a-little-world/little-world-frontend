export const USER_ENDPOINT = '/api/user';
export const apiOptions = '#api_options';
export const API_OPTIONS_ENDPOINT = '/api/user_data/api_options';
export const FIREBASE_ENDPOINT = '/api/firebase';

export const defaultPreFetchedOptions = {
  revalidateOnMount: false,
  revalidateOnFocus: true,
};

export const useDispatch = () => {
  console.log('TODO don\'t use me');
};

export function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}
