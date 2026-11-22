import { create } from 'zustand';

/*
 * Screen-reader announcements for events that happen without user action
 * (e.g. a new chat message arriving over the WebSocket). <LiveAnnouncer />
 * renders the text into an always-mounted aria-live region.
 *
 * `id` changes on every call so repeating the same text is still announced.
 */
interface AnnouncerState {
  message: string;
  id: number;
  announce: (message: string) => void;
}

const useAnnouncerStore = create<AnnouncerState>(set => ({
  message: '',
  id: 0,
  announce: (message: string) => set(state => ({ message, id: state.id + 1 })),
}));

export default useAnnouncerStore;
