import {
  FirebaseAppSettings,
  FirebaseOptions,
  getApps,
  initializeApp,
} from '@firebase/app';
import { getMessaging, getToken } from '@firebase/messaging';

import { mutateUserData } from './api';
import { apiFetch } from './api/helpers';
import { environment } from './environment';
import { useReceiveHandlerStore } from './features/stores';
import useNativeStore from './features/stores/nativeStore';
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
    return undefined;
  }

  const { firebasePublicVapidKey } = await getFirebaseConfig();
  const serviceWorkerRegistration = await registerServiceWorker();
  const messaging = getMessaging();
  const token = await Promise.race([
    getToken(messaging, {
      vapidKey: firebasePublicVapidKey,
      serviceWorkerRegistration,
    }),
    // prevent forever hanging when push server is not reachable
    new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error('timed out waiting for a firebase token')),
        20000,
      );
    }),
  ]);
  return token;
}

export async function getInstallationId(): Promise<string> {
  if (environment.isNative) {
    return useNativeStore.getState().getInstallId();
  }

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
  if (environment.isNative) {
    await useReceiveHandlerStore.getState().sendMessageToReactNative?.({
      action: 'REGISTER_DEVICE_PUSH_TOKEN',
      payload: {},
    });
    return;
  }

  const token = await getFirebaseToken();
  if (!token) {
    return;
  }

  try {
    await apiFetch('/api/push_notifications/register', {
      method: 'POST',
      body: {
        install_id: await getInstallationId(),
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
  if (environment.isNative) {
    await useReceiveHandlerStore.getState().sendMessageToReactNative?.({
      action: 'UNREGISTER_DEVICE_PUSH_TOKEN',
      payload: {},
    });
    return;
  }

  await apiFetch('/api/push_notifications/unregister', {
    method: 'POST',
    body: { install_id: await getInstallationId() },
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

export async function enableNotificationsInProfile(
  onSuccess: () => void = () => {},
  onFailure: () => void = () => {},
) {
  await mutateUserData(
    { push_notifications_enabled: true },
    onSuccess,
    onFailure,
  );
  // TODO: mutate user profile
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
