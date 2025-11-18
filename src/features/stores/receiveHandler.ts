import { create } from 'zustand';

export type DomCommunicationResponse =
  | { ok: true; data?: any | undefined }
  | { ok: false; error: string };

export type DomCommunicationMessage =
  | {
      action: 'SET_AUTH_TOKENS';
      requestId?: string;
      payload: { accessToken: string | null; refreshToken: string | null };
    }
  | {
      action: 'NAVIGATE';
      requestId?: string;
      payload: {
        path: string;
      };
    }
  | {
      action: 'CLEAR_AUTH_TOKENS';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'WEBVIEW_READY';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'GET_WINDOW_ORIGIN';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'GET_INTEGRITY_TOKEN';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'PING';
      requestId?: string;
      payload: {
        message: string;
      };
    }
  | {
      action: 'RESPONSE';
      requestId: string;
      payload: DomCommunicationResponse;
    }
  | {
      action: 'CONSOLE_LOG';
      requestId?: string;
      payload: {
        message?: any;
        params?: any[];
      };
    };

export type DomCommunicationMessageFn = (
  message: DomCommunicationMessage,
) => Promise<DomCommunicationResponse>;

interface ReceiveHandlerState {
  handler: DomCommunicationMessageFn | null;
  sendMessageToReactNative: DomCommunicationMessageFn | null;
  setHandler: (handler: DomCommunicationMessageFn | null) => void;
  setSendMessageToReactNative: (
    sendMessage: DomCommunicationMessageFn | null,
  ) => void;
  clearHandler: () => void;
}

const useReceiveHandlerStore = create<ReceiveHandlerState>(set => ({
  handler: null,
  sendMessageToReactNative: null,
  setHandler: handler => set({ handler }),
  setSendMessageToReactNative: sendMessage =>
    set({ sendMessageToReactNative: sendMessage }),
  clearHandler: () => set({ handler: null }),
}));

export default useReceiveHandlerStore;
