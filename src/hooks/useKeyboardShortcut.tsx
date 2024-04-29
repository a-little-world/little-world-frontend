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
    console.log({ condition });
    if (!condition) return;
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      console.log({ condition, key });
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
