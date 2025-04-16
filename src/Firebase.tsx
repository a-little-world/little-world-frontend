import { getApps } from 'firebase/app';
import React from 'react';
import {
  MessagePayload,
  Unsubscribe,
  isSupported,
  onMessage,
} from 'firebase/messaging';
import { useEffect, useRef } from 'react';
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

async function register() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    const supported = await isSupported();
    if (!supported) {
      // TOOD: some other error
    }
    // TODO: show some error
    return;
  }

  enableFirebase();
  const token = await getFirebaseToken();
  console.log(token);
  if (!token) {
    // TODO: token sollte immer gesetzt sein
    return;
  }

  const isRegistered = isFirebaseDeviceTokenRegistered(token);
  if (isRegistered) {
    return;
  }

  registerFirebaseDeviceToken()
    .then(() => {
      setFirebaseDeviceTokenRegistered(token, true);
    })
    .catch(e => {
      console.error(e);
    });
}

async function unregister() {
  if (getApps().length === 0) {
    return;
  }

  const token = await getFirebaseToken();
  // TODO: token sollte immer gesetzt sein
  if (!token) {
    return;
  }

  await unregisterFirebaseDeviceToken();
  setFirebaseDeviceTokenRegistered(token!, true);
  await disableFirebase();
}


function FireBase() {
  const push_notifications_enabled = useSelector(
    state =>
      state?.userData?.user?.profile?.push_notifications_enabled ?? false,
  );
  const unsubscribeRef = useRef<Unsubscribe>();

  useEffect(() => {
    console.log(
      'push notifications enabled userData',
      push_notifications_enabled,
    );

    if (push_notifications_enabled) {
      register().then(() => {
        const messaging = getFirebaseMessaging();
        if (messaging) {
          unsubscribeRef.current = onMessage(messaging, handleMessage);
        }
      });
    } else {
      unsubscribeRef.current?.();
      unsubscribeRef.current = undefined;

      unregister();
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

  return <FireBase />;
}

export default FireBaseBehindDevelopmentFlag;
