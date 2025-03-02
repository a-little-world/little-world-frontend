import { apiFetch } from './helpers.ts';

export enum NotificationState {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

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

export async function retrieveNotifications(
  state: NotificationState | 'all',
  page: number,
  onSuccess: (result: any) => void,
  onError: (result: any) => void,
) {
  try {
    const includeUnread = state === NotificationState.UNREAD || state === 'all';
    const includeRead = state === NotificationState.READ || state === 'all';
    const includeArchived =
      state === NotificationState.ARCHIVED || state === 'all';

    const result = await apiFetch(
      `/api/notifications?page=${page}&page_size=5&include_unread=${includeUnread}&include_read=${includeRead}&include_archived=${includeArchived}`,
      {
        method: 'GET',
        useTagsOnly: true,
      },
    );
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
}
