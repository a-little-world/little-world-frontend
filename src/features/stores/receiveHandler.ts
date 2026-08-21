import { NavigateOptions } from 'react-router-dom';
import { create } from 'zustand';

import { TokenStatus } from '../../api/types';

export type DomCommunicationResponse =
  | { ok: true; data?: any | undefined }
  | { ok: false; error: string };

export type DomCommunicationMessage =
  | {
      action: 'NAVIGATE';
      requestId?: string;
      payload: {
        path: string;
        options?: NavigateOptions;
      };
    }
  | {
      action: 'NAVIGATE_BACK';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'WEBVIEW_READY';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'NATIVE_READY';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'GET_WINDOW_ORIGIN';
      requestId?: string;
      payload: {
        origin: string;
      };
    }
  | {
      action: 'DISPLAY_NOTIFICATION';
      requestId?: string;
      payload: {
        title?: string;
        body?: string;
        path?: string;
      };
    }
  | {
      // The user answered or declined an incoming call on the native ring
      // screen; mirror what the INCOMING_CALL modal would have done.
      action: 'NATIVE_CALL_ACTION';
      requestId?: string;
      payload: {
        action: 'answer' | 'decline';
        partnerId: string;
        roomUuid: string;
        // Whether native already reached /api/call_rejected. When false the
        // web side retries it through the authenticated path.
        rejected?: boolean;
      };
    }
  | {
      action: 'GET_INTEGRITY_TOKEN';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'REGISTER_DEVICE_PUSH_TOKEN';
      requestId?: string;
      payload: {};
    }
  | {
      action: 'UNREGISTER_DEVICE_PUSH_TOKEN';
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
    }
  | {
      action: 'SET_DEBUG_CONFIG';
      requestId?: string;
      payload: {
        debugEnabled: boolean;
        backendUrlOverride: string | null;
      };
    }
  | {
      action: 'SET_THEME';
      requestId?: string;
      payload: {
        mode: 'light' | 'dark';
      };
    }
  | {
      action: 'NAVIGATE_TO_LOGIN';
      requestId?: string;
      payload: {
        sessionExpired: boolean;
      };
    }
  | {
      action: 'SET_TOKEN_STATE';
      requestId?: string;
      payload: {
        isRefreshing: boolean;
        status?: TokenStatus;
      };
    }
  | {
      action: 'LOG_ERROR';
      requestId?: string;
      payload:
        | {
            type: 'react';
            message: string;
            stack?: string;
          }
        | {
            type: 'fetch';
            method: string;
            endpoint: string;
            url: string;
            headers: Record<string, string>;
            requestBody: unknown;
            status?: number;
            error: unknown;
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
