import { useState } from 'react';

type ModalTypeKey =
  | 'NONE'
  | 'INCOMING_CALL'
  | 'CALL_SETUP'
  | 'MATCH'
  | 'POST_CALL_SURVEY';

interface ModalConfig {
  id: ModalTypeKey;
  priority: number;
  closeOnOpen?: ModalTypeKey[]; // modal types that should be closed when modal opens
}

export const ModalTypes: Record<ModalTypeKey, ModalConfig> = {
  NONE: {
    id: 'NONE',
    priority: 0,
  },
  INCOMING_CALL: {
    id: 'INCOMING_CALL',
    priority: 4,
    closeOnOpen: ['CALL_SETUP'],
  },
  CALL_SETUP: {
    id: 'CALL_SETUP',
    priority: 3,
  },
  MATCH: {
    id: 'MATCH',
    priority: 2,
  },
  POST_CALL_SURVEY: {
    id: 'POST_CALL_SURVEY',
    priority: 1,
  },
} as const;

interface UseModalManagerReturn {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  openModal: (modalType: ModalTypeKey) => void;
  closeModal: () => void;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  isModalOpen: (modalType: ModalTypeKey) => boolean;
}

const useModalManager = (): UseModalManagerReturn => {
  const [activeModal, setActiveModal] = useState<ModalTypeKey>(
    ModalTypes.NONE.id,
  );
  const [modalQueue, setModalQueue] = useState<ModalTypeKey[]>([]);

  const getModalPriority = (modalType: ModalTypeKey): number =>
    ModalTypes[modalType]?.priority ?? 0;

  const openModal = (modalType: ModalTypeKey) => {
    const newModalPriority = getModalPriority(modalType);
    const currentModalPriority = getModalPriority(activeModal);
    const modalsToClose = ModalTypes[modalType].closeOnOpen ?? [];

    // If new modal has higher priority, add current to queue and show new
    if (newModalPriority > currentModalPriority) {
      if (activeModal !== ModalTypes.NONE.id) {
        setModalQueue(prev => {
          const newQueue = [...prev, activeModal];
          return modalsToClose.length
            ? newQueue.filter(modal => !modalsToClose.includes(modal))
            : newQueue;
        });
      }
      setActiveModal(modalType);
      // If new modal has lower priority, add to queue
    } else if (newModalPriority < currentModalPriority) {
      setModalQueue(prev => [
        ...(modalsToClose.length
          ? prev.filter(modal => !modalsToClose.includes(modal))
          : prev),
        modalType,
      ]);
    } else {
      setActiveModal(modalType);
    }
  };

  const closeModal = () => {
    // When closing, check queue for next highest priority modal
    if (modalQueue.length > 0) {
      const sortedQueue = [...modalQueue].sort(
        (a, b) => getModalPriority(b) - getModalPriority(a),
      );
      setActiveModal(sortedQueue[0]);
      setModalQueue(sortedQueue.slice(1));
    } else {
      setActiveModal(ModalTypes.NONE.id);
    }
  };

  const isModalOpen = (modalType: ModalTypeKey): boolean =>
    activeModal === modalType;

  return { openModal, closeModal, isModalOpen };
};
export default useModalManager;
