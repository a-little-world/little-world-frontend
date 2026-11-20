import { useEffect, useLayoutEffect, useRef } from 'react';

import { useLocation, useNavigationType } from 'react-router-dom';

export const SCROLL_ROOT_ID = 'router-outlet-wrapper';

/** How long a Back/Forward restore waits for the page to grow tall enough. */
const RESTORE_TIMEOUT_MS = 2000;
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

const getScroller = () => document.getElementById(SCROLL_ROOT_ID);

/**
 * Body is overflow:hidden and this wrapper is the page scroller, so React
 * Router's window ScrollRestoration never sees the position.
 *
 * - A new pathname (link, push, replace) starts at the top.
 * - Back and forward to another pathname restore that history entry's
 *   position. Positions are keyed by history entry, so two visits to the same
 *   path keep their own positions.
 * - A change to only the search or hash never scrolls, whatever the
 *   navigation type, so filters and in-page links do not jump.
 *
 * Content often loads after the route renders, so a restore keeps applying the
 * target until the page is tall enough, the user scrolls, or a timeout passes.
 * Scroll events during that time are not saved, so a clamped value never
 * replaces the real one.
 */
const OutletScroll = () => {
  const { key, pathname } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef(key);
  const lastPathname = useRef(pathname);
  const cancelRestore = useRef<(() => void) | null>(null);

  // One listener for the life of the scroller. It writes to whichever history
  // entry is current, so it never re-subscribes on navigation.
  useEffect(() => {
    const scroller = getScroller();
    if (!scroller) return undefined;
    const remember = () => {
      if (cancelRestore.current) return;
      positions.current.set(currentKey.current, scroller.scrollTop);
    };
    scroller.addEventListener('scroll', remember, { passive: true });
    return () => scroller.removeEventListener('scroll', remember);
  }, []);

  useLayoutEffect(() => {
    const scroller = getScroller();
    const pathChanged = lastPathname.current !== pathname;
    lastPathname.current = pathname;
    currentKey.current = key;
    if (!scroller) return;

    if (!pathChanged) {
      // Same page, new entry: it starts where the page already is.
      positions.current.set(key, scroller.scrollTop);
      return;
    }

    cancelRestore.current?.();
    const target =
      navigationType === 'POP' ? (positions.current.get(key) ?? 0) : 0;
    scroller.scrollTop = target;
    if (scroller.scrollTop === target) return;

    let frame = 0;
    const deadline = performance.now() + RESTORE_TIMEOUT_MS;
    const stop = () => {
      window.cancelAnimationFrame(frame);
      USER_SCROLL_EVENTS.forEach(type =>
        scroller.removeEventListener(type, stop),
      );
      cancelRestore.current = null;
    };
    const apply = () => {
      scroller.scrollTop = target;
      if (scroller.scrollTop === target || performance.now() > deadline) {
        // On timeout the saved target is kept for a later Back.
        stop();
        return;
      }
      frame = window.requestAnimationFrame(apply);
    };
    USER_SCROLL_EVENTS.forEach(type =>
      scroller.addEventListener(type, stop, { passive: true }),
    );
    cancelRestore.current = stop;
    frame = window.requestAnimationFrame(apply);
  }, [key, pathname, navigationType]);

  useEffect(() => () => cancelRestore.current?.(), []);

  return null;
};

export default OutletScroll;
