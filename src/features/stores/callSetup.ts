import { create } from 'zustand';

interface CallSetupData {
  userId: string;
  /** Answered from the native ring screen: join immediately with default devices
   * instead of showing the prejoin device picker (the native side already got
   * an explicit Accept tap). */
  skipPrejoin?: boolean;
}

interface CallSetupState {
  callSetup: CallSetupData | null;
  initCallSetup: (data: CallSetupData) => void;
  cancelCallSetup: () => void;
}

const useCallSetupStore = create<CallSetupState>(set => ({
  callSetup: null,
  initCallSetup: data => set({ callSetup: data }),
  cancelCallSetup: () => set({ callSetup: null }),
}));

export default useCallSetupStore;
