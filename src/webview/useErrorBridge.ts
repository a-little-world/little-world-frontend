import { useEffect } from 'react';
import useReceiveHandlerStore from '../features/stores/receiveHandler';

function useErrorBridge() {
  useEffect(() => {
    const send = (message: string, stack?: string, source?: string) => {
      const { sendMessageToReactNative } = useReceiveHandlerStore.getState();
      sendMessageToReactNative?.({
        action: 'LOG_ERROR',
        payload: { type: 'react', message, stack, source },
      })?.catch?.(() => {});
    };

    const handleError = (event: ErrorEvent) => {
      send(event.message, event.error?.stack, 'uncaught');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      send(
        error?.message ?? String(error),
        error?.stack,
        'unhandledrejection',
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

export default useErrorBridge;
