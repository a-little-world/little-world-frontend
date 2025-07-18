import { getApps } from 'firebase/app';
import {
  MessagePayload,
  Unsubscribe,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

import { ToastContextType } from './components/blocks/Toast.tsx';
import { FIREBASE_ENDPOINT, USER_ENDPOINT } from './features/swr/index.ts';
import {
  disableFirebase,
  enableFirebase,
  getFirebaseMessaging,
  getFirebaseToken,
  isFirebaseDeviceTokenRegistered,
  registerFirebaseDeviceToken,
  setFirebaseDeviceTokenRegistered,
  unregisterFirebaseDeviceToken,
} from './firebase-util.ts';
import useToast from './hooks/useToast.ts';

interface FirebasePushNotificationData {
  headline: string;
  title: string;
  description: string;
  timestamp: string;
}

function handleMessage(payload: MessagePayload, toast: ToastContextType): void {
  const data = payload.data as unknown as FirebasePushNotificationData;
  toast.showToast({
    headline: data.headline,
    title: data.title,
    description: data.description,
    timestamp: new Date(data.timestamp).toLocaleTimeString(),
  });
}

async function register(
  firebaseClientConfig: any,
  firebasePublicVapidKey: string,
) {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    const supported = await isSupported();
    if (!supported) {
      // TOOD: some other error
    }
    // TODO: show some error
    return;
  }

  enableFirebase(firebaseClientConfig);
  const token = await getFirebaseToken(firebasePublicVapidKey);
  console.log(token);
  if (!token) {
    // TODO: token sollte immer gesetzt sein
    return;
  }

  const isRegistered = isFirebaseDeviceTokenRegistered(token);
  if (isRegistered) {
    return;
  }

  registerFirebaseDeviceToken(firebasePublicVapidKey)
    .then(() => {
      setFirebaseDeviceTokenRegistered(token, true);
    })
    .catch(e => {
      console.error(e);
    });
}

async function unregister(firebasePublicVapidKey: string) {
  if (getApps().length === 0) {
    return;
  }

  const token = await getFirebaseToken(firebasePublicVapidKey);
  // TODO: token sollte immer gesetzt sein
  if (!token) {
    return;
  }

  await unregisterFirebaseDeviceToken(firebasePublicVapidKey);
  setFirebaseDeviceTokenRegistered(token!, true);
  await disableFirebase();
}

function FireBase() {
  const { data: firebaseConfig } = useSWR(FIREBASE_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: true,
  });

  const { data: userData } = useSWR(USER_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: true,
  });

  // TODO: double check if this is correct ( frontend store refactored )
  const unsubscribeRef = useRef<Unsubscribe>();
  const push_notifications_enabled =
    userData?.profile?.push_notifications_enabled;

  const firebaseClientConfig = firebaseConfig?.firebaseClientConfig;
  const firebasePublicVapidKey = firebaseConfig?.firebasePublicVapidKey;
  const toast = useToast();

  useEffect(() => {
    console.log(
      'push notifications enabled userData',
      push_notifications_enabled,
    );

    const unsubscribe = () => {
      unsubscribeRef.current?.();
    };

    if (push_notifications_enabled) {
      if (
        firebaseClientConfig === undefined ||
        firebasePublicVapidKey === undefined
      ) {
        return unsubscribe;
      }
      register(firebaseClientConfig, firebasePublicVapidKey).then(() => {
        const messaging = getFirebaseMessaging();
        if (messaging) {
          unsubscribeRef.current = onMessage(messaging, payload =>
            handleMessage(payload, toast),
          );
        }
      });
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;

      unregister(firebasePublicVapidKey);
    }

    return unsubscribe;
  }, [
    push_notifications_enabled,
    firebaseClientConfig,
    firebasePublicVapidKey,
  ]);

  return null;
}

export default FireBase;
