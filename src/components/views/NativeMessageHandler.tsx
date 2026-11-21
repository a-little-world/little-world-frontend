import { useContext, useEffect } from 'react';

import {
  themeContext,
  ThemeVariants,
} from '@a-little-world/little-world-design-system';
import { useNavigate } from 'react-router-dom';

import { clearSwrCache, navigateToLogin } from '../../api/helpers';
import {
  useDebugStore,
  useNavigationStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import useNativeStore from '../../features/stores/nativeStore';
import {
  DomCommunicationMessage,
  DomCommunicationMessageFn,
  DomCommunicationResponse,
} from '../../features/stores/receiveHandler';
import {
  handleNotificationClicked,
  showNotificationToast,
} from '../../hooks/useNotificationHandler';
import useToast from '../../hooks/useToast';

export interface NativeChallengeProofEvent {
  proof: string;
  challenge: string;
  timestamp: string;
  email: string;
}

const navigateTo = (path: string) =>
  useNavigationStore.getState().navigate?.(path);

// true if the back press was consumed
function handleNativeBack(): boolean {
  // radix drawers/dialogs/selects close on Escape keydown, design-system modals on keyup;
  // a locked modal ignores it but still swallows the back press
  if (
    document.querySelector(
      '[role="dialog"][data-state="open"], [role="listbox"][data-state="open"]',
    )
  ) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    return true;
  }
  if (document.querySelector('dialog[aria-modal]')) {
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    return true;
  }

  const { onBack, navigate } = useNavigationStore.getState();
  if (onBack?.()) return true;

  // React Router keeps `idx` in history state; 0 = first entry this session
  const canGoBack = (window.history.state?.idx ?? 0) > 0;
  if (canGoBack) navigate?.(-1);
  return canGoBack;
}

function NativeMessageHandler() {
  const { setHandler, sendMessageToReactNative } = useReceiveHandlerStore();
  const navigate = useNavigate();
  const { setNavigate } = useNavigationStore();
  const { currentMode } = useContext(themeContext);
  const isReady = useNativeStore(state => state.isReady);
  const toast = useToast();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  useEffect(() => {
    if (!isReady || !sendMessageToReactNative) return;
    sendMessageToReactNative({
      action: 'SET_THEME',
      payload: { mode: currentMode === ThemeVariants.dark ? 'dark' : 'light' },
    });
  }, [isReady, currentMode, sendMessageToReactNative]);

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

          // Only clear on actual runtime backend switch
          if (backendUrlChanged && useNativeStore.getState().isReady) {
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
        case 'NAVIGATE_BACK': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const response: DomCommunicationResponse = {
            ok: true,
            data: { handled: handleNativeBack() },
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
        case 'SET_TOKEN_STATE': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          const { isRefreshing, status } = message.payload;

          useNativeStore.getState().setTokenState({ isRefreshing, status });

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
        case 'NOTIFICATION_RECEIVED': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          showNotificationToast(
            payload,
            window.location.hash.replace(/^#/, '') || '/',
            toast,
            navigateTo,
          );

          const response: DomCommunicationResponse = { ok: true };
          sendMessageToReactNative!({
            action: 'RESPONSE',
            requestId,
            payload: response,
          });

          return response;
        }
        case 'NOTIFICATION_CLICKED': {
          if (!requestId) {
            throw new Error('Received native message without request id');
          }

          handleNotificationClicked(payload, navigateTo);

          const response: DomCommunicationResponse = { ok: true };
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
  }, [setHandler, sendMessageToReactNative, toast]);
}

export default NativeMessageHandler;
