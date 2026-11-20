import { environment } from './environment';
import useNativeStore from './features/stores/nativeStore';

export type DeviceInfo = Record<string, string | undefined>;

// camera/microphone queries are unsupported in some browsers
const getPermissionState = (name: 'camera' | 'microphone') =>
  navigator.permissions
    ?.query({ name })
    .then(status => status.state)
    .catch(() => undefined);

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const [cameraPermission, microphonePermission] = await Promise.all([
    getPermissionState('camera'),
    getPermissionState('microphone'),
  ]);
  const browserInfo: DeviceInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    notificationPermission:
      'Notification' in window ? Notification.permission : undefined,
    cameraPermission,
    microphonePermission,
  };

  if (!environment.isNative) return browserInfo;
  return {
    ...browserInfo,
    ...(await useNativeStore.getState().getDeviceInfo()),
  };
}
