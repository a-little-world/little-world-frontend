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
  const [toastProps, setToastProps] = React.useState<ToastPropsWithId[]>([]);
  const [id, setId] = React.useState(1);

  const onClose = (id: string, callBack?: () => void): void => {
    // call the original onClose method
    callBack?.();
    setTimeout(() => {
      // cleanup memory with a delay to allow for close animations to finish
      setToastProps(toastProps => toastProps.filter(prop => prop.id !== id));
    }, 1000);
  };

  const showToast = (props: ToastProps) => {
    const newToastProps: ToastPropsWithId = {
      ...props,
      id: String(id),
      onClose: () => onClose(String(id), props.onClose), // pass original onClose method to call later
    };
    setToastProps(prevToastProps => [...prevToastProps, newToastProps]);
    setId(prevId => prevId + 1);
  };

  return (
    <ToastContext.Provider value={{ showToast: showToast }}>
      <SimpleToastProvider swipeDirection="right">
        <ToastViewport />
        {toastProps.map(props => (
          <Toast {...props} key={props.id}></Toast>
        ))}
      </SimpleToastProvider>
      {children}
    </ToastContext.Provider>
  );
}
