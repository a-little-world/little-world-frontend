import { create } from 'zustand';

interface CallData {
  uuid: string;
  userId: string;
  chatId: string;
  tracks?: any;
  token?: string;
  audioOptions?: boolean | { deviceId: string };
  videoOptions?: boolean | { deviceId: string };
  livekitServerUrl?: string;
}

interface ConnectedCallState {
  callData: CallData | null;
  disconnectedFrom: string | null; // UUID of the session user disconnected from
  connectToCall: (data: CallData) => void;
  disconnectFromCall: (sessionUuid: string) => void;
}

const useConnectedCallStore = create<ConnectedCallState>(set => ({
  callData: null,
  disconnectedFrom: null,
  connectToCall: data => set({ callData: data, disconnectedFrom: null }),
  disconnectFromCall: sessionUuid =>
    set({ callData: null, disconnectedFrom: sessionUuid }),
}));

export default useConnectedCallStore;
