import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearSwrCache, navigateToLogin } from '../../api/helpers';
import {
  useDebugStore,
  useMobileAuthTokenStore,
  useNavigationStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import useNativeStore from '../../features/stores/nativeStore';
import {
  DomCommunicationMessage,
  DomCommunicationMessageFn,
  DomCommunicationResponse,
} from '../../features/stores/receiveHandler';

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
  const { setNavigate } = useNavigationStore();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  useEffect(() => {
    if (!sendMessageToReactNative) {
      return;
    }
    const handler: DomCommunicationMessageFn = async (
      message: DomCommunicationMessage,
    ) => {
      const { action, requestId, payload } = message;
      switch (action) {
        case 'SET_DEBUG_CONFIG': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const debugConfigState = useDebugStore.getState();
          const { debugEnabled, backendUrlOverride } = payload;
          const backendUrlChanged =
            backendUrlOverride !== debugConfigState.backendUrlOverride;

          debugConfigState.setDebugConfig({ debugEnabled, backendUrlOverride });

          if (backendUrlChanged) {
            clearSwrCache();
          }

          const response: DomCommunicationResponse = { ok: true };
          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });
          return response;
        }
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

          const { path, options } = payload;
          useNavigationStore.getState().navigate?.(path, options);

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
        case 'NAVIGATE_TO_LOGIN': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const { sessionExpired } = payload;
          await navigateToLogin(sessionExpired);

          const response: DomCommunicationResponse = {
            ok: true,
          };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'NATIVE_READY': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          useNativeStore.getState().setReady();

          const response: DomCommunicationResponse = {
            ok: true,
          };

          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'GET_WINDOW_ORIGIN': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const response: DomCommunicationResponse = {
            ok: true,
            data: {
              origin: window.location.origin,
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
