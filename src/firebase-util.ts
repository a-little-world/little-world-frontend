import {
  FirebaseAppSettings,
  FirebaseOptions,
  getApps,
  initializeApp,
} from '@firebase/app';
import { getMessaging, getToken } from '@firebase/messaging';

import { apiFetch } from './api/helpers';
import { FIREBASE_ENDPOINT } from './features/swr';

type FirebaseConfig = {
  firebaseClientConfig: FirebaseOptions;
  firebasePublicVapidKey: string;
};

const firebaseAppSettings: FirebaseAppSettings = {
  automaticDataCollectionEnabled: false,
};

let firebaseConfig: Promise<FirebaseConfig> | undefined;

function getFirebaseConfig(): Promise<FirebaseConfig> {
  if (!firebaseConfig) {
    firebaseConfig = apiFetch(FIREBASE_ENDPOINT);
  }
  return firebaseConfig;
}

export async function getFirebaseToken(): Promise<string | undefined> {
  if (getApps().length === 0) {
    return undefined;
  }

  const { firebasePublicVapidKey } = await getFirebaseConfig();

  const messaging = getMessaging();
  const token = await getToken(messaging, { vapidKey: firebasePublicVapidKey });
  return token;
}

function getInstallationId(): string {
  const key = 'install_id';

  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    // fallback for strict environments
    return crypto.randomUUID();
  }
}

export async function registerFirebaseDeviceToken(): Promise<void> {
  const token = await getFirebaseToken();
  if (!token) {
    return;
  }

  try {
    await apiFetch('/api/push_notifications/register', {
      method: 'POST',
      body: {
        install_id: getInstallationId(),
        token,
        platform: 'web',
        model_name: navigator.userAgent,
      },
    });
  } catch (_e) {
    // ignore
  }
}

export async function unregisterFirebaseDeviceToken(): Promise<void> {
  await apiFetch('/api/push_notifications/unregister', {
    method: 'POST',
    body: { install_id: getInstallationId() },
  });
}

export async function enableFirebase() {
  if (getApps().length >= 1) {
    return;
  }
  const { firebaseClientConfig } = await getFirebaseConfig();

  initializeApp(firebaseClientConfig, firebaseAppSettings);

  await registerFirebaseDeviceToken();
}

export async function disableFirebase() {
  if (getApps().length === 0) {
    return;
  }

  await unregisterFirebaseDeviceToken();
}

export async function sendFirebaseTestNotification(
  delay?: number,
): Promise<void> {
  const promise = new Promise<void>(resolve => {
    setTimeout(async () => {
      await apiFetch('/api/push_notifications/send_test', {
        method: 'POST',
      }).finally(() => resolve());
    }, delay ?? 0);
  });

  return promise;
}
