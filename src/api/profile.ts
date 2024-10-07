import Cookies from 'js-cookie';

import { BACKEND_URL } from '../ENVIRONMENT.js';
import { formatApiError } from './helpers.ts';

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = async ({ userId }: { userId: string }) => {
  const response = await fetch(`${BACKEND_URL}/api/profile/${userId}/match`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const responseBody = await response?.json();

  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};
