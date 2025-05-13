import { mutate } from 'swr';

import { apiFetch } from './helpers.ts';

export const UNREAD_NOTIFICATIONS_URL = '/api/notifications/unread';

export enum NotificationState {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

export type NotificationStateFilter = NotificationState | 'all';

export async function updateNotification(
  id: number,
  state: NotificationState,
  onSuccess: (result: any) => void,
  onError: (result: any) => void,
) {
  try {
    const result = await apiFetch(`/api/notifications/${id}/update`, {
      method: 'PATCH',
      useTagsOnly: true,
      body: { state },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
}

export async function deleteNotification(
  id: number,
  onSuccess: (result: any) => void,
  onError: (result: any) => void,
) {
  try {
    const result = await apiFetch(`/api/notifications/${id}/delete`, {
      method: 'DELETE',
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
}

export async function fetchNotifications(url: string) {
  return apiFetch(url, {
    method: 'GET',
    useTagsOnly: true,
  });
}

export function updateUnreadNotificationCount() {
  mutate(UNREAD_NOTIFICATIONS_URL);
}
