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

import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from './api/endpoints';
import { ToastContextType } from './components/blocks/Toast';
import useNotificationStore from './features/stores/notification';
import { enableFirebase } from './firebase-util';
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

  const { data: isAuthenticated } = useSWR<boolean>(IS_AUTHENTICATED_ENDPOINT);

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

  const deviceSupported = useNotificationStore(s => s.deviceSupported);
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

  // prevent multiple activations
  const firebaseEnabledRef = useRef<boolean | undefined>(undefined);

  useEffect(() => () => unsubscribeRef.current?.(), []);

  useEffect(() => {
    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    const enabled = Boolean(isAuthenticated && devicePermissionGranted);
    if (!deviceSupported || !enabled || firebaseEnabledRef.current) {
      return unsubscribe;
    }

    firebaseEnabledRef.current = true;

    enableFirebase().then(() => {
      const messaging = getMessaging();
      unsubscribeRef.current = onMessage(messaging, payload =>
        handleMessage(payload, toast, navigate),
      );
    });

    return unsubscribe;
  }, [
    deviceSupported,
    isAuthenticated,
    devicePermissionGranted,
    toast,
    navigate,
  ]);

  return null;
}

export default FireBase;
