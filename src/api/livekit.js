import Cookies from 'js-cookie';

import { BACKEND_URL } from '../ENVIRONMENT';
import { formatApiError } from './index';

// eslint-disable-next-line import/prefer-default-export
export const requestVideoAccessToken = async ({ partnerId }) => {
  const response = await fetch(`${BACKEND_URL}/api/livekit/authenticate`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ partner_id: partnerId }),
    method: 'POST',
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};
