import { useCallback, useState } from 'react';

type ModalTypes = {
  NONE: { id: 'NONE'; priority: 0 };
  INCOMING_CALL: { id: 'INCOMING_CALL'; priority: 4 };
  CALL_SETUP: { id: 'CALL_SETUP'; priority: 3 };
  MATCH: { id: 'MATCH'; priority: 2 };
  POST_CALL_SURVEY: { id: 'POST_CALL_SURVEY'; priority: 1 };
};

export const ModalType: ModalTypes = {
  NONE: { id: 'NONE', priority: 0 },
  INCOMING_CALL: { id: 'INCOMING_CALL', priority: 4 },
  CALL_SETUP: { id: 'CALL_SETUP', priority: 3 },
  MATCH: { id: 'MATCH', priority: 2 },
  POST_CALL_SURVEY: { id: 'POST_CALL_SURVEY', priority: 1 },
} as const;

type ModalId = (typeof ModalType)[keyof typeof ModalType]['id'];

const useModalManager = () => {
  const [activeModal, setActiveModal] = useState<ModalId>(ModalType.NONE.id);
  const [modalQueue, setModalQueue] = useState<ModalId[]>([]);

  const getModalPriority = (modalType: ModalId): number => {
    const modal = Object.values(ModalType).find(m => m.id === modalType);
    return modal?.priority || 0;
  };

  const openModal = useCallback(
    (modalType: ModalId) => {
      const newModalPriority = getModalPriority(modalType);
      const currentModalPriority = getModalPriority(activeModal);

      if (newModalPriority > currentModalPriority) {
        // If new modal has higher priority, add current to queue and show new
        if (activeModal !== ModalType.NONE.id) {
          setModalQueue(prev => [...prev, activeModal]);
        }
        setActiveModal(modalType);
      } else if (newModalPriority < currentModalPriority) {
        // If new modal has lower priority, add to queue
        setModalQueue(prev => [...prev, modalType]);
      }
      // If same priority, new modal replaces current one
      else {
        setActiveModal(modalType);
      }
    },
    [activeModal],
  );

  const closeModal = useCallback(() => {
    // When closing, check queue for next highest priority modal
    if (modalQueue.length > 0) {
      const sortedQueue = [...modalQueue].sort(
        (a, b) => getModalPriority(b) - getModalPriority(a),
      );
      setActiveModal(sortedQueue[0]);
      setModalQueue(sortedQueue.slice(1));
    } else {
      setActiveModal(ModalType.NONE.id);
    }
  }, [modalQueue]);

  const isModalOpen = useCallback(
    (modalType: ModalId) => activeModal === modalType,
    [activeModal],
  );

  return { openModal, closeModal, isModalOpen };
};

export default useModalManager;
