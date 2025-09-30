import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useMobileAuthTokenStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import {
  DomCommunicationMessage,
  DomCommunicationMessageFn,
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
  const { setHandler } = useReceiveHandlerStore();
  const navigate = useNavigate();
  const [_state, dispatch] = useReducer(eventHandlerReducer, initialState);

  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { path } = customEvent.detail;
      console.log('Navigation event received, navigating to:', path);
      navigate(path);
    };

    dispatch({ type: 'SET_NAVIGATION_HANDLER', payload: handleNavigation });
    window.addEventListener('native-navigate', handleNavigation);

    return () => {
      window.removeEventListener('native-navigate', handleNavigation);
      dispatch({ type: 'SET_NAVIGATION_HANDLER', payload: null });
    };
  }, [navigate]);

  useEffect(() => {
    const handler = (event: Event) => {
      console.log('WebNative received auth token event', event);
    };

    dispatch({ type: 'SET_AUTH_TOKEN_HANDLER', payload: handler });
    window.addEventListener('set-auth-token', handler);

    return () => {
      window.removeEventListener('set-auth-token', handler);
      dispatch({ type: 'SET_AUTH_TOKEN_HANDLER', payload: null });
    };
  }, []);

  useEffect(() => {
    const handler: DomCommunicationMessageFn = async (
      message: DomCommunicationMessage,
    ) => {
      const { action, payload } = message;
      switch (action) {
        case 'SET_AUTH_TOKENS': {
          const { accessToken, refreshToken } = payload;
          useMobileAuthTokenStore.setState({
            accessToken,
            refreshToken,
          });
          return { ok: true };
        }
        // case 'NATIVE_CHALLENGE_PROOF': {
        //   // Native returns the computed HMAC proof for the given challenge
        //   const { proof, challenge, timestamp, email } = payload;

        //   if (proof) {
        //     window.dispatchEvent(
        //       new CustomEvent<NativeChallengeProofEvent>(
        //         'native-challenge-proof',
        //         {
        //           detail: {
        //             proof,
        //             challenge,
        //             timestamp,
        //             email,
        //           },
        //         },
        //       ),
        //     );
        //     return { proof: 'Challenge proof forwarded to frontend' };
        //   }
        //   console.error('Native did not solve the challenge');
        //   // return { ok: false, error: 'Native did not solve the challenge' };
        //   throw new Error('');
        // }
        case 'NAVIGATE': {
          const { path } = payload;
          navigate(path);
          return { ok: true, data: 'Navigation event dispatched' };
          // return undefined;
        }
        case 'TEST': {
          return {
            ok: true,
            data: {
              response: `Response from frontend: ${new Date().toISOString()}`,
            },
          };
        }
        case 'PING': {
          return {
            ok: true,
            data: {
              message: `Received message ${
                message.payload.message
              } at ${new Date().toISOString()} from native`,
            },
          };
        }
        case 'TEST': {
          const { initial } = payload;
          payload.result = `Initial: ${initial}. Answered from Frontend.`;
          return { ok: true, data: 'uninteresting' };
        }
        default:
          return { ok: false, error: 'Unhandled in package' };
      }
      // return { ok: false, error: 'Unhandled in package' };
    };

    dispatch({ type: 'SET_MESSAGE_HANDLER', payload: handler });
    // Set the handler; the store will auto-register with the native bridge if available
    setHandler(handler);

    return () => {
      dispatch({ type: 'SET_MESSAGE_HANDLER', payload: null });
    };
    // }, [setHandler, navigate]);
  }, [setHandler]);

  return null;
}

export default NativeMessageHandler;
