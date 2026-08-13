import { useEffect, useRef } from 'react';

import {
  getMessaging,
  isSupported,
  MessagePayload,
  onMessage,
  Unsubscribe,
} from '@firebase/messaging';
import { useTranslation } from 'react-i18next';
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
  const currentPath = window.location.pathname;
  if (path && path !== currentPath) {
    toast.showToast({
      title: payload.notification?.title,
      description: payload.notification?.body,
      duration: 3000,
      onClick: path?.startsWith('/') ? () => navigate(path) : undefined,
    });
  }
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
  const { t } = useTranslation();

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

  const {
    deviceSupported,
    notificationsEnabled,
    devicePermissionGranted,
    devicePermissionSet,
    setDevicePermissionSet,
    setDevicePermissionGranted,
  } = notificationStore;

  // Show one-time toast when browser has not granted notification
  // permission yet
  useEffect(() => {
    if (
      !deviceSupported ||
      !notificationsEnabled ||
      devicePermissionSet !== false
    ) {
      return;
    }

    toast.showToast({
      title: t('push_notifications.permission_missing'),
      description: t('push_notifications.permission_missing.description'),
      actionText: t('push_notifications.request_permission'),
      actionAltText: 'test',
      duration: Infinity, // show indefinitely
      showClose: true,
      // click is required for browser to show permission prompt
      onActionClick: () => {
        Notification.requestPermission().then(permission => {
          setDevicePermissionSet(permission !== 'default');
          setDevicePermissionGranted(permission === 'granted');
        });
      },
    });
  }, [deviceSupported, notificationsEnabled, devicePermissionSet, toast, t]);

  // prevent multiple (de-)activations
  const firebaseEnabledRef = useRef<boolean | undefined>(undefined);

  useEffect(() => () => unsubscribeRef.current?.(), []);

  useEffect(() => {
    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    if (!deviceSupported) {
      return unsubscribe;
    }

    const enabled = Boolean(notificationsEnabled && devicePermissionGranted);
    if (firebaseEnabledRef.current === enabled) {
      return unsubscribe;
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
