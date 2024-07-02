import { useCallback } from 'react';

const useScrollToTop = (): (() => void) => {
  const scrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return scrollToTop;
};

export default useScrollToTop;
