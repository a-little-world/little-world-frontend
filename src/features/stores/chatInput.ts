import { create } from 'zustand';

interface ChatInputState {
  textToAdd: string | null;
  onTextAdded: (() => void) | null;
  addTextToChat: (text: string) => void;
  setOnTextAdded: (callback: (() => void) | null) => void;
  clearText: () => void;
}

const useChatInputStore = create<ChatInputState>((set, get) => ({
  textToAdd: null,
  onTextAdded: null,
  addTextToChat: (text: string) => {
    set({ textToAdd: text });
    // Call the callback if it exists
    const { onTextAdded } = get();
    if (onTextAdded) {
      onTextAdded();
    }
  },
  setOnTextAdded: (callback: (() => void) | null) => set({ onTextAdded: callback }),
  clearText: () => set({ textToAdd: null }),
}));

export default useChatInputStore;

