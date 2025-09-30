import { create } from 'zustand';

export type DomCommunicationMessage =
  | {
      action: 'SET_AUTH_TOKENS';
      payload: { accessToken: string | null; refreshToken: string | null };
    }
  | {
      action: 'NATIVE_CHALLENGE_PROOF';
      payload: {
        proof?: string;
        challenge: string;
        timestamp: string;
        email: string;
      };
    }
  | {
      action: 'NAVIGATE';
      payload: {
        path: string;
      };
    }
  | {
      action: 'TEST';
      payload: {
        initial: string;
      };
    }
  | {
      action: 'PING';
      payload: {
        message: string;
      };
    };

// export type DomCommunicationResponseMap = {
//   SET_AUTH_TOKENS: {
//     ok: true;
//     data?: any;
//   };
//   NATIVE_CHALLENGE_PROOF: { ok: true; proof: string };
//   NAVIGATE: { ok: true; data?: any };
//   TEST: { ok: true; data?: any };
// };

export type DomCommunicationResponse =
  | { ok: true; data?: any | undefined }
  | { ok: false; error: string };
// export type DomCommunicationErrorResponse = { ok: false; error: string };
// export type MessageReturnType<T extends DomCommunicationMessage['action']> =
// DomCommunicationResponseMap[T];

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
