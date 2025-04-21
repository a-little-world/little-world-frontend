import { getApps } from 'firebase/app';
import React, { useEffect, useRef } from 'react';
import {
  MessagePayload,
  Unsubscribe,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { useSelector } from 'react-redux';

import {
  disableFirebase,
  enableFirebase,
  getFirebaseMessaging,
  getFirebaseToken,
  isFirebaseDeviceTokenRegistered,
  registerFirebaseDeviceToken,
  setFirebaseDeviceTokenRegistered,
  unregisterFirebaseDeviceToken,
  useArePushNotificationsEnabled,
} from './firebase.ts';


function handleMessage(payload: MessagePayload): void {
  console.log('focused tab message', payload);
}

async function register(firebaseClientConfig: any, firebasePublicVapidKey: string) {
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


function FireBase({ firebasePublicVapidKey }: { firebasePublicVapidKey: string }) {
  const push_notifications_enabled = useSelector(
    state =>
      state?.userData?.user?.profile?.push_notifications_enabled ?? false,
  );
  const unsubscribeRef = useRef<Unsubscribe>();
  const firebaseClientConfig = useSelector(
    state => state?.userData?.firebaseClientConfig,
  );

  useEffect(() => {
    console.log(
      'push notifications enabled userData',
      push_notifications_enabled,
    );

    if (push_notifications_enabled) {
      register(firebaseClientConfig, firebasePublicVapidKey).then(() => {
        const messaging = getFirebaseMessaging();
        if (messaging) {
          unsubscribeRef.current = onMessage(messaging, handleMessage);
        }
      });
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;

      unregister(firebasePublicVapidKey);
    }

    return () => unsubscribeRef.current?.();
  }, [push_notifications_enabled]);
  
  return null;
}

function FireBaseBehindDevelopmentFlag() {
  const arePushNotificationsEnabled = useArePushNotificationsEnabled();
  if (!arePushNotificationsEnabled) {
    return null;
  }
  
  const firebasePublicVapidKey = useSelector(
    state => state?.userData?.firebasePublicVapidKey,
  );

  return <FireBase firebasePublicVapidKey={firebasePublicVapidKey} />;
}

export default FireBaseBehindDevelopmentFlag;
