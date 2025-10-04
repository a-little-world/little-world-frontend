import { useEffect, useRef } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import {
  useMobileAuthTokenStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import {
  DomCommunicationMessage,
  DomCommunicationMessageFn,
  DomCommunicationResponse,
} from '../../features/stores/receiveHandler';

type EventHandlerState = {
  navigationHandler: ((event: Event) => void) | null;
  authTokenHandler: ((event: Event) => void) | null;
  messageHandler: ((message: DomCommunicationMessage) => Promise<any>) | null;
};

type EventHandlerAction =
  | { type: 'SET_NAVIGATION_HANDLER'; payload: ((event: Event) => void) | null }
  | { type: 'SET_AUTH_TOKEN_HANDLER'; payload: ((event: Event) => void) | null }
  | {
      type: 'SET_MESSAGE_HANDLER';
      payload: ((mesage: DomCommunicationMessage) => Promise<any>) | null;
    }
  | { type: 'CLEANUP' };

const initialState: EventHandlerState = {
  navigationHandler: null,
  authTokenHandler: null,
  messageHandler: null,
};

function eventHandlerReducer(
  state: EventHandlerState,
  action: EventHandlerAction,
): EventHandlerState {
  switch (action.type) {
    case 'SET_NAVIGATION_HANDLER':
      return { ...state, navigationHandler: action.payload };
    case 'SET_AUTH_TOKEN_HANDLER':
      return { ...state, authTokenHandler: action.payload };
    case 'SET_MESSAGE_HANDLER':
      return { ...state, messageHandler: action.payload };
    case 'CLEANUP':
      return initialState;
    default:
      return state;
  }
}

export interface NativeChallengeProofEvent {
  proof: string;
  challenge: string;
  timestamp: string;
  email: string;
}

function NativeMessageHandler() {
  const { setHandler, sendMessageToReactNative } = useReceiveHandlerStore();
  const navigate = useNavigate();
  const mobileAuthStore = useMobileAuthTokenStore();

  const navigateRef = useRef<NavigateFunction | null>(null);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const { accessToken, refreshToken } = mobileAuthStore;
    sendMessageToReactNative?.({
      action: 'SET_AUTH_TOKENS',
      payload: {
        accessToken,
        refreshToken,
      },
    });
  }, [mobileAuthStore]);

  useEffect(() => {
    const handler: DomCommunicationMessageFn = async (
      message: DomCommunicationMessage,
    ) => {
      const { action, requestId, payload } = message;
      switch (action) {
        case 'SET_AUTH_TOKENS': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const { accessToken, refreshToken } = payload;
          mobileAuthStore.setTokens(accessToken, refreshToken);

          const response: DomCommunicationResponse = { ok: true };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'NAVIGATE': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const { path } = payload;
          // circumvent infinite loop when using navigate inside dependencies
          navigateRef.current?.(path);

          const response: DomCommunicationResponse = {
            ok: true,
            data: {
              response: `Navigation event dispatched`,
            },
          };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'PING': {
          console.log(
            'received ping, sending response',
            message,
            sendMessageToReactNative,
          );

          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const response: DomCommunicationResponse = {
            ok: true,
            data: {
              message: `Received message ${message.payload.message} from native`,
            },
          };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'TEST': {
          const { initial } = payload;
          payload.result = `Initial: ${initial}. Answered from Frontend.`;
          return { ok: true, data: 'uninteresting' };
        }
        default:
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const response = { ok: false, error: 'Unhandled in package' };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
      }
    };

    // Set the handler; the store will auto-register with the native bridge if available
    setHandler(handler);
  }, [setHandler, sendMessageToReactNative, mobileAuthStore]);
}

export default NativeMessageHandler;
