import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceiveHandlerStore } from '../../features/stores';

function NativeMessageHandler() {
  const { setHandler } = useReceiveHandlerStore();
  const navigate = useNavigate();

  // Listen for navigation events from the handler
  useEffect(() => {
    const handleNavigation = event => {
      const { path } = event.detail;
      console.log('Navigation event received, navigating to:', path);
      navigate(path);
    };

    window.addEventListener('native-navigate', handleNavigation);

    return () => {
      window.removeEventListener('native-navigate', handleNavigation);
    };
  }, [navigate]);

  useEffect(() => {
    const handler = event => {
      console.log('WebNative received auth token event', event);
    };

    window.addEventListener('set-auth-token', handler);

    return () => {
      window.removeEventListener('set-auth-token', handler);
    };
  }, []);

  useEffect(() => {
    console.log('Establishing handler');
    const handler = async (action, payload) => {
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
              detail: { token: payload?.token },
            }),
          );
          return { ok: true, data: 'Token stored in frontend' };
        default:
          return { ok: false, error: 'Unhandled in package' };
      }
    };

    // Set the handler; the store will auto-register with the native bridge if available
    setHandler(handler);
  }, [setHandler]);

  return null;
}

export default NativeMessageHandler;
