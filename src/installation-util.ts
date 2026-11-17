import { apiFetch } from './api/helpers';
import { environment } from './environment';
import useNativeStore from './features/stores/nativeStore';

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

export async function registerInstallation(): Promise<void> {
  await apiFetch('/api/installations/register', {
    method: 'POST',
    body: {
      install_id: await getInstallationId(),
      platform: 'web',
      model_name: navigator.userAgent,
    },
  });
}
