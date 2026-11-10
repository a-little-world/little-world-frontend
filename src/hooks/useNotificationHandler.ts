import { useEffect, useRef } from 'react';

import type { ToastContextType } from '../components/blocks/Toast';
import type { NotificationPayload } from '../features/stores/receiveHandler';

type NotificationHandler = (
  payload: NotificationPayload,
) => 'pass' | 'drop' | (() => void);
type NavigateFn = (path: string) => void;

const handlers: NotificationHandler[] = [];

function registerNotificationHandler(handler: NotificationHandler) {
  handlers.push(handler);
  return () => {
    const index = handlers.indexOf(handler);
    if (index >= 0) handlers.splice(index, 1);
  };
}

function getNotificationAction(
  payload: NotificationPayload,
  navigate: NavigateFn,
): ReturnType<NotificationHandler> {
  for (let i = handlers.length - 1; i >= 0; i -= 1) {
    const action = handlers[i](payload);
    if (action !== 'pass') return action;
  }
  const path = payload.data?.path;
  return path?.startsWith('/') ? () => navigate(path) : 'pass';
}

export function showNotificationToast(
  payload: NotificationPayload,
  currentPath: string,
  toast: ToastContextType,
  navigate: NavigateFn,
) {
  if (payload.data?.path === currentPath) return;

  const action = getNotificationAction(payload, navigate);
  if (action === 'drop') return;

  toast.showToast({
    title: payload.notification?.title,
    description: payload.notification?.body,
    duration: 3000,
    onClick: typeof action === 'function' ? action : undefined,
  });
}

export function handleNotificationClicked(
  payload: NotificationPayload,
  navigate: NavigateFn,
) {
  const action = getNotificationAction(payload, navigate);
  if (typeof action === 'function') action();
}

const useNotificationHandler = (handler: NotificationHandler) => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(
    () => registerNotificationHandler(payload => handlerRef.current(payload)),
    [],
  );
};

export default useNotificationHandler;
