import Cookies from 'js-cookie';

import { formatApiError } from '.';
import { BACKEND_URL } from '../ENVIRONMENT';

export const fetchChatMessages = async ({ id, page }) => {
  const response = await fetch(
    `${BACKEND_URL}/api/messages/${id}/?page=${page}&page_size=20`,
    {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'True',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const fetchChats = async ({ page }) => {
  const response = await fetch(`${BACKEND_URL}/api/chats/?page=${page}`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};


export const markChatMessagesReadApi = async ({ chatId }) => {
  const response = await fetch(`${BACKEND_URL}/api/messages/${chatId}/chat_read/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({}),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const sendMessage = async ({ chatId, text }) => {
  const response = await fetch(`${BACKEND_URL}/api/messages/${chatId}/send/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ text }),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};
