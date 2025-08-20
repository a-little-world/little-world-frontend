import Cookies from 'js-cookie';

import { environment } from '../environment';
import { apiFetch, formatApiError } from './helpers';
import useMobileAuthTokenStore from '../features/stores/mobileAuthToken';

export const fetchChatMessages = async ({ id, page }) => {

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
  };
  
  if(environment.isNative) {
    const auth_token = useMobileAuthTokenStore.getState().token;
    if(auth_token) {
      defaultHeaders['Authorization'] = `Token ${auth_token}`;
    } else {
      const cookie_token = Cookies.get('auth_token');
      if(cookie_token) {
        defaultHeaders['Authorization'] = `Token ${cookie_token}`;
      }
    }
  }

  const response = await fetch(
    `${environment.backendUrl}/api/messages/${id}/?page=${page}&page_size=20`,
    {
      headers: defaultHeaders,
      method: 'GET',
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const fetchChats = async ({ page }) => {

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
  };
  
  if(environment.isNative) {
    const auth_token = useMobileAuthTokenStore.getState().token;
    if(auth_token) {
      defaultHeaders['Authorization'] = `Token ${auth_token}`;
    } else {
      const cookie_token = Cookies.get('auth_token');
      if(cookie_token) {
        defaultHeaders['Authorization'] = `Token ${cookie_token}`;
      }
    }
  }

  const response = await fetch(
    `${environment.backendUrl}/api/chats/?page=${page}&page_size=20`,
    {
      headers: defaultHeaders,
      method: 'GET',
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const fetchChat = async ({ chatId }) => {

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
  };
  
  if(environment.isNative) {
    const auth_token = useMobileAuthTokenStore.getState().token;
    if(auth_token) {
      defaultHeaders['Authorization'] = `Token ${auth_token}`;
    } else {
      const cookie_token = Cookies.get('auth_token');
      if(cookie_token) {
        defaultHeaders['Authorization'] = `Token ${cookie_token}`;
      }
    }
  }
  const response = await fetch(
    `${environment.backendUrl}/api/chats/${chatId}/`,
    {
      headers: defaultHeaders,
      method: 'GET',
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const markChatMessagesReadApi = async ({ chatId }) => {

  const defaultHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken') || '',
  };
  
  if(environment.isNative) {
    const auth_token = useMobileAuthTokenStore.getState().token;
    if(auth_token) {
      defaultHeaders['Authorization'] = `Token ${auth_token}`;
    } else {
      const cookie_token = Cookies.get('auth_token');
      if(cookie_token) {
        defaultHeaders['Authorization'] = `Token ${cookie_token}`;
      }
    }
  }

  const response = await fetch(
    `${environment.backendUrl}/api/messages/${chatId}/chat_read/`,
    {
      headers: defaultHeaders,
      method: 'POST',
      body: JSON.stringify({}),
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const sendFileAttachmentMessage = async ({
  file,
  text,
  chatId,
  onSuccess,
  onError,
}) => {

  const data = new FormData();
  data.append('file', file);
  data.append('text', text);
  try {
    const result = await apiFetch(`/api/messages/${chatId}/send_attachment/`, {
      method: 'POST',
      useTagsOnly: true,
      body: data,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const sendMessage = async ({ chatId, text, onSuccess, onError }) => {
  try {
    const result = await apiFetch(`/api/messages/${chatId}/send/`, {
      method: 'POST',
      useTagsOnly: true,
      body: { text },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
