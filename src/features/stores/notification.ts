import { create } from 'zustand';

interface NotificationState {
  notificationsEnabled: boolean | undefined;
  deviceSupported: boolean | undefined;
  devicePermissionSet: boolean | undefined;
  devicePermissionGranted: boolean | undefined;
  setNotificationsEnabled: (notificationsEnabled: boolean | undefined) => void;
  setDeviceSupported: (deviceSupported: boolean | undefined) => void;
  setDevicePermissionSet: (devicePermissionSet: boolean | undefined) => void;
  setDevicePermissionGranted: (
    devicePermissionGranted: boolean | undefined,
  ) => void;
}

const useNotificationStore = create<NotificationState>(set => ({
  notificationsEnabled: undefined,
  deviceSupported: undefined,
  devicePermissionSet: undefined,
  devicePermissionGranted: undefined,
  setNotificationsEnabled: notificationsEnabled =>
    set({ notificationsEnabled }),
  setDeviceSupported: deviceSupported => set({ deviceSupported }),
  setDevicePermissionSet: devicePermissionSet => set({ devicePermissionSet }),
  setDevicePermissionGranted: devicePermissionGranted =>
    set({ devicePermissionGranted }),
}));

export default useNotificationStore;
