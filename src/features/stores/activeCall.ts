import { create } from 'zustand';

interface ActiveCallData {
  userId: string;
  chatId: string;
  tracks?: any;
  token?: string;
  audioOptions?: boolean | { deviceId: string };
  videoOptions?: boolean | { deviceId: string };
  livekitServerUrl?: string;
  randomCallMatchId?: string;
}

interface ActiveCallState {
  activeCall: ActiveCallData | null;
  initActiveCall: (data: ActiveCallData) => void;
  stopActiveCall: () => void;
}

const useActiveCallStore = create<ActiveCallState>((set) => ({
  activeCall: null,
  initActiveCall: (data) => set({ activeCall: data }),
  stopActiveCall: () => set({ activeCall: null }),
}));

export default useActiveCallStore; 