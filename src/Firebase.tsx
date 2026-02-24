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
import { USER_ENDPOINT } from './features/swr/index';
import { disableFirebase, enableFirebase } from './firebase-util';
import useToast from './hooks/useToast';

interface FirebasePushNotificationData {
  headline: string;
  title: string;
  description: string;
  timestamp: string;
}

function handleMessage(payload: MessagePayload, toast: ToastContextType): void {
  const data = payload.data as unknown as FirebasePushNotificationData;
  toast.showToast({
    title: payload.notification?.title,
    description: payload.notification?.body,
  });
}

function FireBase() {
  const { data: userData } = useSWR(USER_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  // TODO: double check if this is correct ( frontend store refactored )
  const unsubscribeRef = useRef<Unsubscribe | undefined>(undefined);
  const push_notifications_enabled =
    userData?.profile?.push_notifications_enabled;

  const toast = useToast();

  useEffect(() => {
    isSupported().then(async notificationsSupported => {
      if (!notificationsSupported) {
        return;
      }
      if (push_notifications_enabled) {
        await enableFirebase();
        const messaging = getMessaging();

        unsubscribeRef.current = onMessage(messaging, payload =>
          handleMessage(payload, toast),
        );
      } else {
        unsubscribeRef.current?.();
        unsubscribeRef.current = undefined;
        // free up firebase resources
        await disableFirebase();
      }
    });

    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    return unsubscribe;
  }, [push_notifications_enabled]);

  return null;
}

export default FireBase;
