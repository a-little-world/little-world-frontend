import {
  ToastProvider as SimpleToastProvider,
  Toast,
  ToastProps,
  ToastViewport,
} from '@a-little-world/little-world-design-system';
import * as React from 'react';

export interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

interface ToastPropsWithId extends ToastProps {
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
      showToast: (props: ToastProps) => {
        const id = crypto.randomUUID();
        const newToastProps: ToastPropsWithId = {
          ...props,
          id: crypto.randomUUID(),
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
