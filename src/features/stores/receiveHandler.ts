import { create } from 'zustand';

type ReceiveHandler = (action: string, payload: any) => Promise<any> | any;

interface ReceiveHandlerState {
  handler: ReceiveHandler | null;
  setHandler: (handler: ReceiveHandler | null) => void;
  clearHandler: () => void;
}

const useReceiveHandlerStore = create<ReceiveHandlerState>(set => ({
  handler: null,
  setHandler: handler => set({ handler }),
  clearHandler: () => set({ handler: null }),
}));

export default useReceiveHandlerStore; 