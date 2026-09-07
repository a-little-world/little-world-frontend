import { useState } from 'react';

import useSWR, { mutate } from 'swr';

import { USER_ENDPOINT } from '../api/endpoints';
import { updateUserSearchState } from '../api/profile';
import { SEARCHING_STATES } from '../constants';

export interface SearchStateError {
  message?: string;
}

export interface SearchState {
  isSearching: boolean;
  pending: boolean;
  /** The raw failure, so each surface can pick its own fallback copy. */
  error: SearchStateError | null;
  ready: boolean;
  /** Writes the flag. Ignores a write that matches what is already stored. */
  setSearching: (next: boolean, onDone?: () => void) => void;
}

/**
 * Read and write "I am looking for a match".
 *
 * One place, because the flag is now offered from two very different surfaces — a
 * confirm modal (`UpdateSearchStateCard`) and an inline switch (`SearchToggle`) — and
 * the part that has to stay identical is which state each one writes and that the user
 * cache is revalidated afterwards. The UI is what differs; this is not.
 */
export default function useSearchState(): SearchState {
  const { data: user } = useSWR(USER_ENDPOINT);
  const [error, setError] = useState<SearchStateError | null>(null);
  const [pending, setPending] = useState(false);
  const isSearching = Boolean(user?.isSearching);

  const setSearching = (next: boolean, onDone?: () => void) => {
    if (pending || next === isSearching) return;

    setError(null);
    setPending(true);
    updateUserSearchState({
      updatedState: next ? SEARCHING_STATES.searching : SEARCHING_STATES.idle,
      onSuccess: () => {
        mutate(USER_ENDPOINT);
        setPending(false);
        onDone?.();
      },
      onError: (e: SearchStateError) => {
        setError(e ?? {});
        setPending(false);
      },
    });
  };

  return {
    isSearching,
    pending,
    error,
    ready: Boolean(user),
    setSearching,
  };
}
