import Cookies from 'js-cookie';

import { BACKEND_URL } from '../ENVIRONMENT';
import { formatApiError } from './helpers.ts';

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
  throw formatApiError(responseBody, response);
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
  throw formatApiError(responseBody, response);
};

export const fetchChat = async ({ chatId }) => {
  const response = await fetch(`${BACKEND_URL}/api/chats/${chatId}/`, {
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
  throw formatApiError(responseBody, response);
};

export const markChatMessagesReadApi = async ({ chatId }) => {
  const response = await fetch(
    `${BACKEND_URL}/api/messages/${chatId}/chat_read/`,
    {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'True',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({}),
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
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
  throw formatApiError(responseBody, response);
};
