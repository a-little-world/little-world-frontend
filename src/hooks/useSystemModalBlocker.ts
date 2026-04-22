import { useEffect } from 'react';

import useModalManagerStore from '../features/stores/modalManager';

const useSystemModalBlocker = (isOpen: boolean, source: string) => {
  const { blockSystemModals, unblockSystemModals } = useModalManagerStore();
  const blockingSource = useModalManagerStore(state => state.blockingSource);

  useEffect(() => {
    if (!source) return;

    const isBlockedBySource = blockingSource === source;

    if (isOpen && (!blockingSource || isBlockedBySource)) {
      blockSystemModals(source);
    } else if (!isOpen && isBlockedBySource) {
      unblockSystemModals(source);
    }

    return () => {
      if (blockingSource === source) {
        unblockSystemModals(source);
      }
    };
  }, [
    blockSystemModals,
    blockingSource,
    isOpen,
    source,
    unblockSystemModals,
  ]);
};

export default useSystemModalBlocker;
