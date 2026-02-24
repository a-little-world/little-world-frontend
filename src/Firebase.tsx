import {
  MessagePayload,
  Unsubscribe,
  getMessaging,
  isSupported,
  onMessage,
} from '@firebase/messaging';
import { useEffect, useRef } from 'react';
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

  // TODO: double check if this is correct ( frontend store refactored )
  const unsubscribeRef = useRef<Unsubscribe | undefined>(undefined);
  const userNotificationsEnabled =
    userData?.profile?.push_notifications_enabled;

  const toast = useToast();

  const notificationStore = useNotificationStore();

  const permissionStatus = Notification.permission;
  useEffect(() => {
    notificationStore.setDevicePermissionSet(permissionStatus !== 'default');
    notificationStore.setDevicePermissionGranted(
      permissionStatus === 'granted',
    );
    isSupported().then(isSupported =>
      notificationStore.setDeviceSupported(isSupported),
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

  useEffect(() => {
    if (!deviceSupported) {
      return;
    }

    if (notificationsEnabled && devicePermissionGranted) {
      enableFirebase().then(() => {
        const messaging = getMessaging();
        unsubscribeRef.current = onMessage(messaging, payload =>
          handleMessage(payload, toast),
        );
      });
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;
      // free up firebase resources
      disableFirebase();
    }

    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    return unsubscribe;
  }, [deviceSupported, notificationsEnabled, devicePermissionGranted]);

  return null;
}

export default FireBase;
