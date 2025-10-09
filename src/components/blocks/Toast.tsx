import {
  ToastProvider as SimpleToastProvider,
  Toast,
  ToastBaseProps,
  ToastViewport,
} from '@a-little-world/little-world-design-system';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ToastContextType {
  showToast: (props: ToastBaseProps) => void;
}

interface ToastPropsWithId extends ToastBaseProps {
  id: string;
}

export const ToastContext = React.createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastPropsWithId[]>([]);

  const onClose = (toastId: string, callBack?: () => void): void => {
    // call the original onClose method
    callBack?.();
    setTimeout(() => {
      // cleanup memory with a delay to allow for close animations to finish
      setToasts(toastProps => toastProps.filter(prop => prop.id !== toastId));
    }, 1000);
  };

  const toastContext = React.useMemo<ToastContextType>(
    () => ({
      showToast: (props: ToastBaseProps) => {
        const id = uuidv4();
        const newToastProps: ToastPropsWithId = {
          ...props,
          id,
          onClose: () => onClose(String(id), props.onClose), // pass original onClose method to call later
        };
        setToasts(prevToastProps => [...prevToastProps, newToastProps]);
      },
    }),
    [setToasts],
  );

  return (
    <ToastContext.Provider value={toastContext}>
      <SimpleToastProvider swipeDirection="right">
        <ToastViewport />
        {toasts.map(props => (
          <Toast {...props} key={props.id} />
        ))}
      </SimpleToastProvider>
      {children}
    </ToastContext.Provider>
  );
}
