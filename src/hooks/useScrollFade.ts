import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefCallback } from 'react';

export type ScrollFadeAxis = 'horizontal' | 'vertical';

export interface ScrollFadeState {
  ref: RefCallback<HTMLElement | null>;
  showStart: boolean;
  showEnd: boolean;
}

/**
 * Tracks whether a scroll container can move from the start / toward the end,
 * so fade overlays can hint that there is more to see.
 */
function useScrollFade(axis: ScrollFadeAxis = 'horizontal'): ScrollFadeState {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const rafIdRef = useRef<number | null>(null);

  const setRef = useCallback<RefCallback<HTMLElement | null>>(el => {
    nodeRef.current = el;
    setNode(el);
  }, []);

  const checkScrollPosition = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return;

    if (axis === 'horizontal') {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const isScrollable = scrollWidth > clientWidth + 1;
      setShowStart(isScrollable && scrollLeft > 0);
      setShowEnd(isScrollable && scrollLeft + clientWidth < scrollWidth - 1);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = el;
    const isScrollable = scrollHeight > clientHeight + 1;
    setShowStart(isScrollable && scrollTop > 0);
    setShowEnd(isScrollable && scrollTop + clientHeight < scrollHeight - 1);
  }, [axis]);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      checkScrollPosition();
      rafIdRef.current = null;
    });
  }, [checkScrollPosition]);

  useEffect(() => {
    if (!node) {
      return undefined;
    }

    const initialCheckId = requestAnimationFrame(checkScrollPosition);
    node.addEventListener('scroll', handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(node);
    }

    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(checkScrollPosition);
      mutationObserver.observe(node, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      cancelAnimationFrame(initialCheckId);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      node.removeEventListener('scroll', handleScroll);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [checkScrollPosition, handleScroll, node]);

  return { ref: setRef, showStart, showEnd };
}

export default useScrollFade;
