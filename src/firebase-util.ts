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

// Registered ourselves instead of letting FCM do it: FCM's default scope
// (/firebase-cloud-messaging-push-scope) does not control the app's pages, and an
// uncontrolled client cannot be navigated on notification click.
async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/',
  });
  // resolves once the worker is activated, getToken needs an active one
  return navigator.serviceWorker.ready;
}

export async function getFirebaseToken(): Promise<string | undefined> {
  if (getApps().length === 0) {
    console.log('now app found while getting firebase token');
    return undefined;
  }

  const { firebasePublicVapidKey } = await getFirebaseConfig();
  console.log('firebasePublicVapidKey', firebasePublicVapidKey);

  const serviceWorkerRegistration = await registerServiceWorker();
  console.log('service worker', serviceWorkerRegistration.active?.state);

  const messaging = getMessaging();
  console.log('messaging', messaging);
  // pushManager.subscribe() hangs forever instead of rejecting when the browser
  // cannot reach its push service, so getToken needs a deadline of its own
  const token = await Promise.race([
    getToken(messaging, {
      vapidKey: firebasePublicVapidKey,
      serviceWorkerRegistration,
    }),
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error('timed out waiting for a firebase token')),
        20000,
      ),
    ),
  ]);
  console.log('token', token);
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
  console.log('registering firebase device token');
  const token = await getFirebaseToken();
  console.log('firebase device token', token);
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
  console.log('enabling firebase');
  if (getApps().length >= 1) {
    console.log('firebase already enabled');
    return;
  }
  console.log('loading firebase config');
  const { firebaseClientConfig } = await getFirebaseConfig();
  console.log('got firebase config', firebaseClientConfig);

  console.log('initializing app');
  initializeApp(firebaseClientConfig, firebaseAppSettings);
  console.log('app initialized');

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
