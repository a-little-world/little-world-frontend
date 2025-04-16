import {
  FirebaseApp,
  FirebaseAppSettings,
  FirebaseOptions,
  deleteApp,
  getApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import { useSelector } from 'react-redux';
import {
  Messaging,
  deleteToken,
  getMessaging,
  getToken,
} from 'firebase/messaging';

import { apiFetch } from './api/helpers.ts';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyAn8iTK0Bgyy5s7_XBwiGNsxKEBRdTb3uM',
  authDomain: 'little-world-5f895.firebaseapp.com',
  projectId: 'little-world-5f895',
  storageBucket: 'little-world-5f895.firebasestorage.app',
  messagingSenderId: '728125212622',
  appId: '1:728125212622:web:f8f85bd492db7331aa8d9f',
  measurementId: 'G-Z4TJ6GLH47',
};

export function useArePushNotificationsEnabled() {
  return useSelector(state => state?.userData?.developmentFeaturesEnabled);
}

const firebaseAppSettings: FirebaseAppSettings = {
  automaticDataCollectionEnabled: false,
};

const vapidKey =
  'BIyKSRNovx_7E0ZwAyAPs1GoZVJ2aAvcevD9Un2Ii6bTG3y12MFwI5Hk4DmaMYUlav_bxm8PLED--iCsPr98OHI';

export function getFirebaseApp(): FirebaseApp {
  return getApp();
}

export function getFirebaseMessaging(): Messaging {
  const app = getFirebaseApp();
  return getMessaging(app);
}

export async function getFirebaseToken(): Promise<string | undefined> {
  const messaging = getMessaging();
  const token = await getToken(messaging, { vapidKey });
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

export async function registerFirebaseDeviceToken(): Promise<void> {
  const token = await getFirebaseToken();

  return apiFetch('/api/push_notifications/register', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function unregisterFirebaseDeviceToken(): Promise<void> {
  const token = await getFirebaseToken();

  return apiFetch('/api/push_notifications/unregister', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function sendFirebaseTestNotification(): Promise<void> {
  const token = await getFirebaseToken();

  return apiFetch('/api/push_notifications/send', {
    method: 'POST',
    body: {
      token,
    },
  });
}

export async function sendDelayedFirebaseTestNotification(): Promise<void> {
  const token = await getFirebaseToken();

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
