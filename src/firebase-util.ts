import {
  FirebaseAppSettings,
  FirebaseOptions,
  deleteApp,
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

export async function enableFirebase() {
  let permissionStatus = Notification.permission;
  if (permissionStatus === 'default') {
    permissionStatus = await Notification?.requestPermission();
  }
  if (permissionStatus !== 'granted') {
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

  deleteApp(app);
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
  const installId = getInstallationId();
  const token = await getFirebaseToken();
  const platform = 'web';
  const modelName = navigator.userAgent;

  return apiFetch('/api/push_notifications/register', {
    method: 'POST',
    body: {
      install_id: installId,
      token,
      platform,
      model_name: modelName,
    },
  });
}

export async function unregisterFirebaseDeviceToken(): Promise<void> {
  const installId = getInstallationId();
  const token = await getFirebaseToken();

  return apiFetch('/api/push_notifications/unregister', {
    method: 'POST',
    body: {
      install_id: installId,
      token,
    },
  });
}

export async function sendFirebaseTestNotification(
  delay?: number,
): Promise<void> {
  if (delay) {
    const delayTimeout = new Promise<void>(resolve => {
      setTimeout(() => resolve(), delay);
    });
    await delayTimeout;
  }

  const token = await getFirebaseToken();

  return apiFetch('/api/push_notifications/send_test', {
    method: 'POST',
    body: {
      token,
    },
  });
}
