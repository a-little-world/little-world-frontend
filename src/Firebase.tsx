import { useEffect, useRef } from 'react';

import {
  getMessaging,
  isSupported,
  MessagePayload,
  onMessage,
  Unsubscribe,
} from '@firebase/messaging';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

import { ToastContextType } from './components/blocks/Toast';
import useNotificationStore from './features/stores/notification';
import { USER_ENDPOINT } from './features/swr/index';
import { disableFirebase, enableFirebase } from './firebase-util';
import useToast from './hooks/useToast';

// show foreground messages as in-app toast
function handleMessage(
  payload: MessagePayload,
  toast: ToastContextType,
  navigate: NavigateFunction,
): void {
  const path = payload.data?.path;
  toast.showToast({
    title: payload.notification?.title,
    description: payload.notification?.body,
    duration: 3000,
    onClick: path?.startsWith('/') ? () => navigate(path) : undefined,
  });
}

function FireBase() {
  const { data: userData } = useSWR(USER_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  const unsubscribeRef = useRef<Unsubscribe | undefined>(undefined);
  const userNotificationsEnabled =
    userData?.profile?.push_notifications_enabled;

  const toast = useToast();
  const navigate = useNavigate();

  // handle desktop notification navigation in-app to prevent reloads
  useEffect(() => {
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      const { type, path } = event.data ?? {};
      if (type !== 'NAVIGATE' || path === window.location.pathname) {
        return;
      }
      navigate(path);
    };

    navigator.serviceWorker?.addEventListener(
      'message',
      handleServiceWorkerMessage,
    );
    return () =>
      navigator.serviceWorker?.removeEventListener(
        'message',
        handleServiceWorkerMessage,
      );
  }, [navigate]);

  const notificationStore = useNotificationStore();

  const permissionStatus = globalThis.Notification?.permission;
  useEffect(() => {
    notificationStore.setDevicePermissionSet(
      permissionStatus !== undefined && permissionStatus !== 'default',
    );
    notificationStore.setDevicePermissionGranted(
      permissionStatus === 'granted',
    );
    isSupported().then(supported =>
      notificationStore.setDeviceSupported(supported),
    );
  }, []);

  useEffect(() => {
    if (
      userNotificationsEnabled !== undefined &&
      userNotificationsEnabled !== null
    ) {
      notificationStore.setNotificationsEnabled(userNotificationsEnabled);
    }
  }, [userNotificationsEnabled]);

  const { deviceSupported, notificationsEnabled, devicePermissionGranted } =
    notificationStore;

  // prevent multiple (de-)activations
  const firebaseEnabledRef = useRef<boolean | undefined>(undefined);

  useEffect(() => () => unsubscribeRef.current?.(), []);

  useEffect(() => {
    if (!deviceSupported) {
      return;
    }

    const enabled = Boolean(notificationsEnabled && devicePermissionGranted);
    if (firebaseEnabledRef.current === enabled) {
      return;
    }
    firebaseEnabledRef.current = enabled;

    if (enabled) {
      enableFirebase()
        .then(() => {
          const messaging = getMessaging();
          unsubscribeRef.current = onMessage(messaging, payload =>
            handleMessage(payload, toast, navigate),
          );
        })
        .catch(error => console.error('[push] setup failed', error));
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
      disableFirebase();
    }

    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    return unsubscribe;
  }, [
    deviceSupported,
    notificationsEnabled,
    devicePermissionGranted,
    toast,
    navigate,
  ]);

  return null;
}

export default FireBase;
