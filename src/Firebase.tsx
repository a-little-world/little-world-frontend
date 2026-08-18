import { useEffect, useMemo, useRef } from 'react';

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

const SHOW_NOTIFICATION_PERMISSION_TOAST_KEY =
  'notification-permission-show-toast';

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

  const deviceSupported = useNotificationStore(s => s.deviceSupported);
  const notificationsEnabled = useNotificationStore(
    s => s.notificationsEnabled,
  );
  const devicePermissionSet = useNotificationStore(s => s.devicePermissionSet);
  const devicePermissionGranted = useNotificationStore(
    s => s.devicePermissionGranted,
  );
  const setDeviceSupported = useNotificationStore(s => s.setDeviceSupported);
  const setNotificationsEnabled = useNotificationStore(
    s => s.setNotificationsEnabled,
  );
  const setDevicePermissionSet = useNotificationStore(
    s => s.setDevicePermissionSet,
  );
  const setDevicePermissionGranted = useNotificationStore(
    s => s.setDevicePermissionGranted,
  );

  const permissionStatus = globalThis.Notification?.permission;
  useEffect(() => {
    setDevicePermissionSet(
      permissionStatus !== undefined && permissionStatus !== 'default',
    );
    setDevicePermissionGranted(permissionStatus === 'granted');
    isSupported().then(setDeviceSupported);
  }, [
    permissionStatus,
    setDevicePermissionSet,
    setDevicePermissionGranted,
    setDeviceSupported,
  ]);

  useEffect(() => {
    if (
      userNotificationsEnabled !== undefined &&
      userNotificationsEnabled !== null
    ) {
      setNotificationsEnabled(userNotificationsEnabled);
    }
  }, [userNotificationsEnabled, setNotificationsEnabled]);

  const showNotificationPermissionToast = useMemo(
    () => localStorage.getItem(SHOW_NOTIFICATION_PERMISSION_TOAST_KEY) === null,
    [],
  );

  // Show one-time toast when browser has not granted notification
  // permission yet
  useEffect(() => {
    if (
      !deviceSupported ||
      !notificationsEnabled ||
      devicePermissionSet !== false ||
      !showNotificationPermissionToast
    ) {
      return;
    }

    toast.showToast({
      title: t('push_notifications.permission_missing'),
      description: t('push_notifications.permission_missing.description'),
      actionText: t('push_notifications.request_permission'),
      actionAltText: 'request notification permission',
      duration: Infinity, // show indefinitely
      width: '600px',
      showClose: true,
      closeOnClick: false,
      // click is required for browser to show permission prompt
      onActionClick: () => {
        Notification.requestPermission().then(permission => {
          setDevicePermissionSet(permission !== 'default');
          setDevicePermissionGranted(permission === 'granted');
        });
      },
      onClose: () => {
        localStorage.setItem(SHOW_NOTIFICATION_PERMISSION_TOAST_KEY, 'false');
      },
    });
  }, [
    deviceSupported,
    notificationsEnabled,
    devicePermissionSet,
    showNotificationPermissionToast,
    setDevicePermissionGranted,
    setDevicePermissionSet,
    toast,
    t,
  ]);

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
      enableFirebase().then(() => {
        const messaging = getMessaging();
        unsubscribeRef.current = onMessage(messaging, payload =>
          handleMessage(payload, toast, navigate),
        );
      });
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
