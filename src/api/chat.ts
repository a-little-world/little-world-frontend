import { apiFetch } from './helpers';

export const fetchChatMessages = async ({ id, page }) =>
  apiFetch(
    `/api/messages/${id}/?page=${page}&page_size=20`,
  );

export const fetchChats = async ({ page }) =>
  apiFetch(`/api/chats/?page=${page}&page_size=20`);

export const fetchChat = async ({ chatId }) =>
  apiFetch(`/api/chats/${chatId}/`);

export const markChatMessagesReadApi = async ({ chatId }) =>
  apiFetch(`/api/messages/${chatId}/chat_read/`, {
    method: 'POST',
    body: {},
  });

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
