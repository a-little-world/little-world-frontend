import Cookies from 'js-cookie';

import { formatApiError } from '.';
import { BACKEND_URL } from '../ENVIRONMENT';

export const fetchMessage = async () => {
  const response = await fetch(`${BACKEND_URL}/api/chat/messages/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
    // body: JSON.stringify({
    //   email,
    // }),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};
