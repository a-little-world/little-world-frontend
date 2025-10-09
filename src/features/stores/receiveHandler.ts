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
      action: 'NATIVE_CHALLENGE_PROOF';
      requestId?: string;
      payload: {
        proof?: string;
        challenge: string;
        timestamp: string;
        email: string;
      };
    }
  | {
      action: 'NAVIGATE';
      requestId?: string;
      payload: {
        path: string;
      };
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
