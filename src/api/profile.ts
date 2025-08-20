import Cookies from 'js-cookie';

import { environment } from '../environment';
import { apiFetch, formatApiError } from './helpers';

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = async ({ userId }: { userId: string }) => {
  const response = await fetch(
    `${environment.backendUrl}/api/profile/${userId}/match`,
    {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'True',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  );

  const responseBody = await response?.json();

  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const updateUserSearchState = async ({
  updatedState,
  onSuccess,
  onError,
}) => {
  try {
    const result = await apiFetch(`/api/user/search_state/${updatedState}`, {
      method: 'POST',
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const deleteAccount = async ({ onSuccess, onError }) => {
  try {
    const result = await apiFetch(`/api/user/delete_account/`, {
      method: 'POST',
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
