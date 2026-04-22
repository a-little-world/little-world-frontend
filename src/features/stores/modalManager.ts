import { create } from 'zustand';

import { warnInDev } from '../../helpers/dev';

type ModalTypeKey =
  | 'NONE'
  | 'INCOMING_CALL'
  | 'CALL_SETUP'
  | 'MATCH'
  | 'POST_CALL_SURVEY';

interface ModalConfig {
  id: ModalTypeKey;
  priority: number; // higher number = higher priority
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

interface ModalManagerActions {
  openModal: (modalType: ModalTypeKey) => void;
  closeModal: () => void;
  dismissModal: (modalType: ModalTypeKey) => void;
  isModalOpen: (modalType: ModalTypeKey) => boolean;
  blockSystemModals: (source: string) => void;
  unblockSystemModals: (source: string) => void;
  areSystemModalsBlocked: () => boolean;
}

interface ModalManagerState extends ModalManagerActions {
  activeModal: ModalTypeKey;
  modalQueue: ModalTypeKey[];
  blockingSource: string | null;
}

const getModalPriority = (modalType: ModalTypeKey): number =>
  ModalTypes[modalType]?.priority ?? 0;

const withCloseOnOpenApplied = (
  queue: ModalTypeKey[],
  modalsToClose: ModalTypeKey[],
): ModalTypeKey[] =>
  modalsToClose.length
    ? queue.filter(modal => !modalsToClose.includes(modal))
    : queue;

const pushToQueueIfMissing = (
  queue: ModalTypeKey[],
  modalType: ModalTypeKey,
): ModalTypeKey[] =>
  queue.includes(modalType) ? queue : [...queue, modalType];

const useModalManagerStore = create<ModalManagerState>((set, get) => ({
  activeModal: ModalTypes.NONE.id,
  modalQueue: [],
  blockingSource: null,

  openModal: (modalType: ModalTypeKey) => {
    set(state => {
      if (modalType === ModalTypes.NONE.id || state.activeModal === modalType) {
        return state;
      }

      const modalsToClose = ModalTypes[modalType].closeOnOpen ?? [];
      const newModalPriority = getModalPriority(modalType);
      const currentModalPriority = getModalPriority(state.activeModal);
      const queueWithCloseOnOpenApplied = withCloseOnOpenApplied(
        state.modalQueue,
        modalsToClose,
      );

      if (state.blockingSource) {
        return {
          ...state,
          modalQueue: pushToQueueIfMissing(
            queueWithCloseOnOpenApplied,
            modalType,
          ),
        };
      }

      if (newModalPriority > currentModalPriority) {
        if (state.activeModal === ModalTypes.NONE.id) {
          return {
            ...state,
            activeModal: modalType,
            modalQueue: queueWithCloseOnOpenApplied,
          };
        }

        return {
          ...state,
          activeModal: modalType,
          modalQueue: pushToQueueIfMissing(
            queueWithCloseOnOpenApplied,
            state.activeModal,
          ),
        };
      }

      return {
        ...state,
        modalQueue: pushToQueueIfMissing(
          queueWithCloseOnOpenApplied,
          modalType,
        ),
      };
    });
  },

  closeModal: () => {
    set(state => {
      if (state.blockingSource) {
        if (state.activeModal === ModalTypes.NONE.id) return state;

        return {
          ...state,
          activeModal: ModalTypes.NONE.id,
          modalQueue: pushToQueueIfMissing(state.modalQueue, state.activeModal),
        };
      }

      if (state.modalQueue.length > 0) {
        const sortedQueue = [...state.modalQueue].sort(
          (a, b) => getModalPriority(b) - getModalPriority(a),
        );

        return {
          ...state,
          activeModal: sortedQueue[0],
          modalQueue: sortedQueue.slice(1),
        };
      }

      return { ...state, activeModal: ModalTypes.NONE.id };
    });
  },

  dismissModal: (modalType: ModalTypeKey) => {
    if (modalType === ModalTypes.NONE.id) return;

    set(state => {
      const queueWithoutModal = state.modalQueue.filter(
        item => item !== modalType,
      );
      const isActiveModal = state.activeModal === modalType;

      if (!isActiveModal) {
        return {
          ...state,
          modalQueue: queueWithoutModal,
        };
      }

      if (state.blockingSource || queueWithoutModal.length === 0) {
        return {
          ...state,
          activeModal: ModalTypes.NONE.id,
          modalQueue: queueWithoutModal,
        };
      }

      const sortedQueue = [...queueWithoutModal].sort(
        (a, b) => getModalPriority(b) - getModalPriority(a),
      );

      return {
        ...state,
        activeModal: sortedQueue[0],
        modalQueue: sortedQueue.slice(1),
      };
    });
  },

  isModalOpen: (modalType: ModalTypeKey): boolean =>
    get().activeModal === modalType,

  blockSystemModals: (source: string) => {
    if (!source) return;

    set(state => {
      if (state.blockingSource === source) return state;
      if (state.blockingSource && state.blockingSource !== source) {
        warnInDev(
          `[modalManager] blocking source "${source}" ignored; "${state.blockingSource}" already holds the block.`,
        );
        return state;
      }

      const shouldMoveActiveToQueue = state.activeModal !== ModalTypes.NONE.id;

      return {
        ...state,
        activeModal: shouldMoveActiveToQueue
          ? ModalTypes.NONE.id
          : state.activeModal,
        modalQueue: shouldMoveActiveToQueue
          ? pushToQueueIfMissing(state.modalQueue, state.activeModal)
          : state.modalQueue,
        blockingSource: source,
      };
    });
  },

  unblockSystemModals: (source: string) => {
    if (!source) return;

    set(state => {
      if (!state.blockingSource) return state;
      if (state.blockingSource !== source) {
        warnInDev(
          `[modalManager] unblock source "${source}" ignored; "${state.blockingSource}" currently holds the block.`,
        );
        return {
          ...state,
        };
      }

      if (
        state.activeModal !== ModalTypes.NONE.id ||
        state.modalQueue.length === 0
      ) {
        return {
          ...state,
          blockingSource: null,
        };
      }

      const sortedQueue = [...state.modalQueue].sort(
        (a, b) => getModalPriority(b) - getModalPriority(a),
      );

      return {
        ...state,
        blockingSource: null,
        activeModal: sortedQueue[0],
        modalQueue: sortedQueue.slice(1),
      };
    });
  },

  areSystemModalsBlocked: () => Boolean(get().blockingSource),
}));

export default useModalManagerStore;
