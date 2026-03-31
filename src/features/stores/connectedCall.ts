import { create } from 'zustand';

// CallData instantiated by CallSetup but the uuid is unavailable at this stage
interface CallData {
  uuid?: string; // added only when call is active
  userId: string;
  chatId: string;
  randomMatchId?: string;
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
  disconnectedFromSession: string | null; // UUID of the session user disconnected from
  disconnectedFromUser: string | null;
  callRejected: boolean;
  connectToCall: (data: CallData) => void;
  initializeCallID: (uuid: string) => void;
  disconnectFromCall: ({
    sessionId,
    partnerId,
  }: {
    sessionId?: string;
    partnerId?: string;
  }) => void;
  resetDisconnectedFrom: () => void;
  setCallRejected: (callRejected: boolean) => void;
}

const useConnectedCallStore = create<ConnectedCallState>(set => ({
  callData: null,
  disconnectedFromSession: null,
  disconnectedFromUser: null,
  callRejected: false,
  connectToCall: data =>
    set({
      callData: data,
      disconnectedFromSession: null,
      disconnectedFromUser: null,
    }),
  initializeCallID: (uuid: string) =>
    set(({ callData }) => ({
      callData: callData ? { ...callData, uuid } : null,
    })),
  disconnectFromCall: ({
    sessionId,
    partnerId,
  }: {
    sessionId?: string;
    partnerId?: string;
  }) =>
    set({
      callData: null,
      disconnectedFromSession: sessionId ?? null,
      disconnectedFromUser: partnerId ?? null,
      callRejected: false,
    }),
  resetDisconnectedFrom: () =>
    set({ disconnectedFromSession: null, disconnectedFromUser: null }),
  setCallRejected: (callRejected: boolean) => set({ callRejected }),
}));

export default useConnectedCallStore;
