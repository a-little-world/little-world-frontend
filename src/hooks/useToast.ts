import { useContext } from 'react';

import { ToastContext, ToastContextType } from '../components/blocks/Toast.tsx';

function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default useToast;
