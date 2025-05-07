import {
  FirebaseApp,
  FirebaseAppSettings,
  deleteApp,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
} from 'firebase/messaging';
import { useSelector } from 'react-redux';

import { apiFetch } from './api/helpers.ts';

export function useArePushNotificationsEnabled() {
  return useSelector(state => state?.userData?.developmentFeaturesEnabled);
}

const firebaseAppSettings: FirebaseAppSettings = {
  automaticDataCollectionEnabled: false,
};

export function getFirebaseApp(): FirebaseApp {
  return getApp();
}

export function getFirebaseMessaging(): Messaging {
  const app = getFirebaseApp();
  return getMessaging(app);
}

export async function getFirebaseToken(
  firebasePublicVapidKey: string,
): Promise<string | undefined> {
  const messaging = getMessaging();
  const token = await getToken(messaging, { vapidKey: firebasePublicVapidKey });
  return token;
}

export function enableFirebase(firebaseClientConfig: any) {
  initializeApp(firebaseClientConfig, firebaseAppSettings);
}

export async function disableFirebase() {
  if (getApps().length === 0) {
    return;
  }
  const app = getApp();
  const messaging = getMessaging(app);

  const tokenDeleted = await deleteToken(messaging);
  if (!tokenDeleted) {
    console.error('Error deleting firebase token');
  }
  deleteApp(app);
}

interface FirebaseRegistrationInfo {
  registeredTokens: string[];
  timestamp: Date;
}

const FIREBASE_DEIVCE_TOKEN_REGISTERED_KEY =
  'firebase-device-token-registration';

function getFirebaseDeviceTokenRegistrationInfo(): FirebaseRegistrationInfo {
  const savedInfo = window.localStorage.getItem(
    FIREBASE_DEIVCE_TOKEN_REGISTERED_KEY,
  );
  return savedInfo
    ? JSON.parse(savedInfo)
    : {
        registeredTokens: [],
        timestamp: new Date(),
      };
}

export function isFirebaseDeviceTokenRegistered(token: string): boolean {
  return getFirebaseDeviceTokenRegistrationInfo().registeredTokens.includes(
    token,
  );
}

export function setFirebaseDeviceTokenRegistered(
  token: string,
  registered: boolean,
): void {
  const registrationInfo = getFirebaseDeviceTokenRegistrationInfo();
  const isCurrentlyRegistered =
    registrationInfo.registeredTokens.includes(token);
  let changed = false;
  if (registered && !isCurrentlyRegistered) {
    registrationInfo.registeredTokens.push(token);
    changed = true;
  } else if (!registered && isCurrentlyRegistered) {
    registrationInfo.registeredTokens =
      registrationInfo.registeredTokens.filter(t => t !== token);
    changed = true;
  }

  if (!changed) {
    return;
  }

  if (registrationInfo.registeredTokens.length === 0) {
    window.localStorage.removeItem(FIREBASE_DEIVCE_TOKEN_REGISTERED_KEY);
  } else {
    registrationInfo.timestamp = new Date();
    window.localStorage.setItem(
      FIREBASE_DEIVCE_TOKEN_REGISTERED_KEY,
      JSON.stringify(registrationInfo),
    );
  }
}

export async function registerFirebaseDeviceToken(
  firebasePublicVapidKey: string,
): Promise<void> {
  const token = await getFirebaseToken(firebasePublicVapidKey);

  return apiFetch('/api/push_notifications/register', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function unregisterFirebaseDeviceToken(
  firebasePublicVapidKey: string,
): Promise<void> {
  const token = await getFirebaseToken(firebasePublicVapidKey);

  return apiFetch('/api/push_notifications/unregister', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function sendFirebaseTestNotification(
  firebasePublicVapidKey: string,
): Promise<void> {
  const token = await getFirebaseToken(firebasePublicVapidKey);

  return apiFetch('/api/push_notifications/send', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function sendDelayedFirebaseTestNotification(
  firebasePublicVapidKey: string,
): Promise<void> {
  const token = await getFirebaseToken(firebasePublicVapidKey);

  setTimeout(
    () =>
      apiFetch('/api/push_notifications/send', {
        method: 'POST',
        body: {
          token,
        },
      }),
    3000,
  );
}
