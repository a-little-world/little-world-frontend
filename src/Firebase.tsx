import { useEffect, useRef } from 'react';

import {
  getMessaging,
  isSupported,
  MessagePayload,
  onMessage,
  Unsubscribe,
} from '@firebase/messaging';
import useSWR from 'swr';

import { ToastContextType } from './components/blocks/Toast';
import useNotificationStore from './features/stores/notification';
import { USER_ENDPOINT } from './features/swr/index';
import { disableFirebase, enableFirebase } from './firebase-util';
import useToast from './hooks/useToast';

function handleMessage(payload: MessagePayload, toast: ToastContextType): void {
  toast.showToast({
    title: payload.notification?.title,
    description: payload.notification?.body,
    duration: 3000,
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
      enableFirebase().then(() => {
        const messaging = getMessaging();
        unsubscribeRef.current = onMessage(messaging, payload =>
          handleMessage(payload, toast),
        );
      });
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
      disableFirebase();
    }
  }, [deviceSupported, notificationsEnabled, devicePermissionGranted, toast]);

  return null;
}

export default FireBase;
