import { useEffect } from 'react';

interface UseKeyboardShortcutArgs {
  key: string;
  onKeyPressed: () => void;
  condition?: boolean;
}

function useKeyboardShortcut({
  condition = true,
  key,
  onKeyPressed,
}: UseKeyboardShortcutArgs) {
  useEffect(() => {
    if (!condition) return;
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    }

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [condition]);
}

export default useKeyboardShortcut;
