import {
  deleteApp,
  FirebaseAppSettings,
  FirebaseOptions,
  getApp,
  getApps,
  initializeApp,
} from '@firebase/app';
import { getMessaging, getToken } from '@firebase/messaging';

import { apiFetch } from './api/helpers';
import { FIREBASE_ENDPOINT } from './features/swr';

type FirebaseConfig = {
  clientConfig: FirebaseOptions;
  publicVapidKey: string;
};

const firebaseAppSettings: FirebaseAppSettings = {
  automaticDataCollectionEnabled: false,
};

async function getFirebaseConfig(): Promise<FirebaseConfig> {
  return apiFetch(FIREBASE_ENDPOINT);
}

export async function getFirebaseToken(): Promise<string | undefined> {
  if (getApps().length === 0) {
    return undefined;
  }

  const vapidKey = await getFirebaseConfig().then(
    config => config.publicVapidKey,
  );

  const messaging = getMessaging();
  const token = await getToken(messaging, { vapidKey });
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
  return apiFetch('/api/push_notifications/register', {
    method: 'POST',
    body: {
      install_id: getInstallationId(),
      token,
      platform: 'web',
      model_name: navigator.userAgent,
    },
  });
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

  const firebaseClientConfig = await apiFetch(FIREBASE_ENDPOINT).then(
    firebaseConfig => firebaseConfig.firebaseClientConfig,
  );

  initializeApp(firebaseClientConfig, firebaseAppSettings);

  await registerFirebaseDeviceToken();
}

export async function disableFirebase() {
  if (getApps().length === 0) {
    return;
  }
  const app = getApp();

  await unregisterFirebaseDeviceToken();

  await deleteApp(app);
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
