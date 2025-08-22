import { create } from 'zustand';

type ReceiveHandler = (action: string, payload: any) => Promise<any> | any;
type SendMessageFn = (action: string, payload: any) => void;

interface ReceiveHandlerState {
  handler: ReceiveHandler | null;
  sendMessageToReactNative: SendMessageFn | null;
  setHandler: (handler: ReceiveHandler | null) => void;
  setSendMessageToReactNative: (sendMessage: SendMessageFn | null) => void;
  clearHandler: () => void;
}

const useReceiveHandlerStore = create<ReceiveHandlerState>(set => ({
  handler: null,
  sendMessageToReactNative: null,
  setHandler: handler => set({ handler }),
  setSendMessageToReactNative: sendMessage => set({ sendMessageToReactNative: sendMessage }),
  clearHandler: () => set({ handler: null }),
}));

export default useReceiveHandlerStore; 