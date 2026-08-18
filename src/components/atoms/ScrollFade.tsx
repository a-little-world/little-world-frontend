import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type ReactElement,
  type Ref,
} from 'react';

import styled, { css } from 'styled-components';

import useScrollFade, { type ScrollFadeAxis } from '../../hooks/useScrollFade';

export type ScrollFadeSide = 'left' | 'right' | 'top' | 'bottom';

type OverlayProps = {
  $side: ScrollFadeSide;
  $visible: boolean;
};

export const ScrollFadeOverlay = styled.div<OverlayProps>`
  position: absolute;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};

  ${({ $side, theme }) => {
    const fade = theme.color.surface.primary;

    switch ($side) {
      case 'left':
        return css`
          top: 0;
          bottom: 0;
          left: 0;
          width: ${theme.spacing.xlarge};
          background: linear-gradient(to right, ${fade}, transparent);
        `;
      case 'right':
        return css`
          top: 0;
          bottom: 0;
          right: 0;
          /* Wider than the start fade — this is the edge that signals "more to see",
             and it is the width ContentSelector used before this was extracted. */
          width: ${theme.spacing.massive};
          background: linear-gradient(to left, ${fade}, transparent);
        `;
      case 'top':
        return css`
          top: 0;
          left: 0;
          right: 0;
          height: ${theme.spacing.medium};
          background: linear-gradient(to bottom, ${fade}, transparent);
        `;
      case 'bottom':
        return css`
          bottom: 0;
          left: 0;
          right: 0;
          height: ${theme.spacing.medium};
          background: linear-gradient(to top, ${fade}, transparent);
        `;
      default:
        return css``;
    }
  }}

  ${({ $side, theme }) => {
    const isHorizontal = $side === 'left' || $side === 'right';
    if (!isHorizontal) return css``;

    const borderRadius =
      $side === 'left'
        ? `${theme.radius.xlarge} 0 0 ${theme.radius.xlarge}`
        : `0 ${theme.radius.xlarge} ${theme.radius.xlarge} 0`;

    return css`
      @media (min-width: ${theme.breakpoints.medium}) {
        width: ${theme.spacing.xxlarge};
        border-radius: ${borderRadius};
      }
    `;
  }}
`;

const Wrap = styled.div<{ $fill?: boolean }>`
  position: relative;
  width: 100%;
  min-width: 0;

  ${({ $fill }) =>
    $fill &&
    css`
      flex: 1;
      min-height: 0;
      max-height: 100%;
    `};
`;

export interface ScrollFadeProps {
  axis?: ScrollFadeAxis;
  /** When this changes, the scroller jumps back to the start. */
  resetKey?: string | number;
  /** Stretch to fill a column flex parent (sidebar on viewport-height pages). */
  fill?: boolean;
  className?: string;
  children: ReactElement;
}

function ScrollFade({
  axis = 'horizontal',
  resetKey,
  fill = false,
  className,
  children,
}: ScrollFadeProps) {
  const { ref, showStart, showEnd } = useScrollFade(axis);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const childRef = useRef<Ref<HTMLElement> | null>(null);

  // Stable: React detaches and reattaches a ref whenever its identity changes, and
  // `useScrollFade`'s ref setter calls setState. An inline callback would therefore be
  // detached (setState null) and reattached (setState el) on every commit, and each of
  // those schedules the render that builds the next callback — a loop that never
  // settles. The hook keeps its own setter stable for the same reason.
  const setScrollerRef = useCallback(
    (el: HTMLElement | null) => {
      scrollerRef.current = el;
      ref(el);
      // Do not silently swallow a ref the child already had.
      const inherited = childRef.current;
      if (typeof inherited === 'function') {
        inherited(el);
      } else if (inherited && typeof inherited === 'object') {
        (inherited as MutableRefObject<HTMLElement | null>).current = el;
      }
    },
    [ref],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    if (axis === 'horizontal') {
      el.scrollLeft = 0;
    } else {
      el.scrollTop = 0;
    }
  }, [axis, resetKey]);

  const child = Children.only(children);
  if (!isValidElement(child)) {
    return null;
  }
  childRef.current =
    (child as ReactElement & { ref?: Ref<HTMLElement> }).ref ?? null;

  return (
    <Wrap className={className} $fill={fill}>
      {axis === 'horizontal' ? (
        <>
          <ScrollFadeOverlay $side="left" $visible={showStart} />
          <ScrollFadeOverlay $side="right" $visible={showEnd} />
        </>
      ) : (
        <>
          <ScrollFadeOverlay $side="top" $visible={showStart} />
          <ScrollFadeOverlay $side="bottom" $visible={showEnd} />
        </>
      )}
      {cloneElement(child, { ref: setScrollerRef } as {
        ref: (el: HTMLElement | null) => void;
      })}
    </Wrap>
  );
}

export default ScrollFade;
