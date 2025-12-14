import { create } from 'zustand';

// CallData instantiated by CallSetup but the uuid is unavailable at this stage
interface CallData {
  uuid?: string; // added only when call is active
  userId: string;
  chatId: string;
  tracks?: any;
  callType?: 'direct' | 'random';
  postDisconnectRedirect?: string;
  token?: string;
  audioOptions?: boolean | { deviceId: string };
  videoOptions?: boolean | { deviceId: string };
  livekitServerUrl?: string;
  audioPermissionDenied?: boolean;
  videoPermissionDenied?: boolean;
}

interface ConnectedCallState {
  callData: CallData | null;
  disconnectedFrom: string | null; // UUID of the session user disconnected from
  callRejected: boolean;
  connectToCall: (data: CallData) => void;
  initializeCallID: (uuid: string) => void;
  disconnectFromCall: (sessionUuid?: string) => void;
  resetDisconnectedFrom: () => void;
  setCallRejected: (callRejected: boolean) => void;
}

const useConnectedCallStore = create<ConnectedCallState>(set => ({
  callData: null,
  disconnectedFrom: null,
  callRejected: false,
  connectToCall: data => set({ callData: data, disconnectedFrom: null }),
  initializeCallID: (uuid: string) =>
    set(({ callData }) => ({
      callData: callData ? { ...callData, uuid } : null,
    })),
  disconnectFromCall: sessionUuid =>
    set({
      callData: null,
      disconnectedFrom: sessionUuid ?? null,
      callRejected: false,
    }),
  resetDisconnectedFrom: () => set({ disconnectedFrom: null }),
  setCallRejected: (callRejected: boolean) => set({ callRejected }),
}));

export default useConnectedCallStore;
