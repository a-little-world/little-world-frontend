import { useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceiveHandlerStore } from '../../features/stores';

type EventHandlerState = {
  navigationHandler: ((event: Event) => void) | null;
  authTokenHandler: ((event: Event) => void) | null;
  messageHandler: ((action: string, payload: Record<string, any>) => Promise<any>) | null;
};

type EventHandlerAction =
  | { type: 'SET_NAVIGATION_HANDLER'; payload: ((event: Event) => void) | null }
  | { type: 'SET_AUTH_TOKEN_HANDLER'; payload: ((event: Event) => void) | null }
  | { type: 'SET_MESSAGE_HANDLER'; payload: ((action: string, payload: Record<string, any>) => Promise<any>) | null }
  | { type: 'CLEANUP' };

const initialState: EventHandlerState = {
  navigationHandler: null,
  authTokenHandler: null,
  messageHandler: null,
};

function eventHandlerReducer(state: EventHandlerState, action: EventHandlerAction): EventHandlerState {
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

function NativeMessageHandler() {
  const { setHandler } = useReceiveHandlerStore();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(eventHandlerReducer, initialState);

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
    console.log('Establishing handler');
    const handler = async (action: string, payload: Record<string, any>) => {
      console.log('action', action, 'TBS');
      console.log('payload', payload);

      switch (action) {
        case 'PING':
          return {
            ok: true,
            data: `Handled in package: ${new Date().toISOString()} payload: ${JSON.stringify(
              payload,
            )}, window-location: ${window.location.href}`,
          };
        case 'console.log':
          console.log('Console from native package:', payload);
          return { ok: true, data: 'Logged' };
        case 'navigate':
          // Dispatch a custom event for navigation instead of calling navigate directly
          window.dispatchEvent(
            new CustomEvent('native-navigate', {
              detail: { path: payload?.path },
            }),
          );
          console.log('Navigation event dispatched for:', payload?.path);
          return { ok: true, data: 'Navigation event dispatched' };
        case 'setAuthToken':
          console.log('Frontend received token', payload);
          window.dispatchEvent(
            new CustomEvent('set-auth-token', {
              detail: {
                token: payload?.token, // legacy single token
                accessToken: payload?.accessToken ?? payload?.token_access ?? payload?.token,
                refreshToken: payload?.refreshToken ?? payload?.token_refresh ?? null,
              },
            }),
          );
          return { ok: true, data: 'Token stored in frontend' };
        case 'nativeChallengeProof':
          // Native returns the computed HMAC proof for the given challenge
          window.dispatchEvent(
            new CustomEvent('native-challenge-proof', {
              detail: {
                proof: payload?.proof ?? null,
                challenge: payload?.challenge ?? null,
                timestamp: payload?.timestamp ?? null,
                email: payload?.email ?? null,
              },
            }),
          );
          return { ok: true, data: 'Challenge proof forwarded to frontend' };
        default:
          return { ok: false, error: 'Unhandled in package' };
      }
    };

    dispatch({ type: 'SET_MESSAGE_HANDLER', payload: handler });
    // Set the handler; the store will auto-register with the native bridge if available
    setHandler(handler);

    return () => {
      dispatch({ type: 'SET_MESSAGE_HANDLER', payload: null });
    };
  }, [setHandler]);

  return null;
}

export default NativeMessageHandler;
