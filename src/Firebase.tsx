import { getApps } from 'firebase/app';
import {
  MessagePayload,
  Unsubscribe,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { ToastContextType } from './components/blocks/Toast.tsx';
import {
  disableFirebase,
  enableFirebase,
  getFirebaseMessaging,
  getFirebaseToken,
  isFirebaseDeviceTokenRegistered,
  registerFirebaseDeviceToken,
  setFirebaseDeviceTokenRegistered,
  unregisterFirebaseDeviceToken,
} from './firebase.ts';
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

function FireBase({}: {}) {
  const push_notifications_enabled = useSelector(
    state =>
      state?.userData?.user?.profile?.push_notifications_enabled ?? false,
  );
  const unsubscribeRef = useRef<Unsubscribe>();
  const firebaseClientConfig = useSelector(
    state => state?.userData?.firebaseClientConfig,
  );
  const firebasePublicVapidKey = useSelector(
    state => state?.userData?.firebasePublicVapidKey,
  );
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
