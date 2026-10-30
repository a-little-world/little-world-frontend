import { CSSProperties, useEffect, useState } from 'react';

import styled, { css } from 'styled-components';
import { Drawer as VaulDrawer } from 'vaul';

const DrawerContainer = styled.div`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: none;
    }
  `}
`;

// firefox (macOS) can stop painting the drawer after vaul's slide-in;
// !important beats vaul's attribute selectors
const NO_ANIMATION_IN_FIREFOX = css`
  @supports (-moz-appearance: none) {
    animation: none !important;
    transition: none !important;
  }
`;

const StyledContent = styled(VaulDrawer.Content)`
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.color.surface.primary};
  /* top edge stays put while the keyboard pushes the bottom up */
  height: calc(80% - var(--keyboard-inset));
  padding: ${({ theme }) => theme.spacing.small};
  padding-top: 0;
  border-radius: ${({ theme }) =>
    `${theme.radius.small} ${theme.radius.small} 0 0`};
  position: fixed;
  /* Portaled to document.body (not a #root descendant), so it anchors to the
     viewport and ignores body's safe-area padding — inset each edge directly. */
  bottom: max(var(--safe-bottom), var(--keyboard-inset));
  left: var(--safe-left);
  right: var(--safe-right);
  outline: none;
  z-index: 100;
  ${NO_ANIMATION_IN_FIREFOX}
`;

const StyledOverlay = styled(VaulDrawer.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
  ${NO_ANIMATION_IN_FIREFOX}
`;

const DragHandle = styled(VaulDrawer.Handle)`
  background-color: ${({ theme }) => theme.color.surface.tertiary};
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
  flex-shrink: 0;
  min-height: 5px;
`;

const VisuallyHiddenTitle = styled(VaulDrawer.Title)`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

type DrawerProps = {
  children: any;
  handleOnly?: boolean;
  onClose: () => void;
  open: boolean;
  title: string;
};

// layout viewport height the on-screen keyboard covers; 0 when the webview shrinks instead
// (ios app). vaul's own tracking drifts out of sync
const useKeyboardInset = (active: boolean) => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) return undefined;
    // layout viewport, not innerHeight: ios safari shrinks innerHeight with the keyboard
    const update = () =>
      setInset(
        Math.max(
          0,
          document.documentElement.clientHeight -
            viewport.height -
            viewport.offsetTop,
        ),
      );
    // ios scrolls the page to the focused input on top of the lift
    const undoPageScroll = () => {
      if (viewport.offsetTop > 0) window.scrollTo(0, 0);
      update();
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', undoPageScroll);
    window.addEventListener('resize', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', undoPageScroll);
      window.removeEventListener('resize', update);
    };
  }, [active]);

  return inset;
};

const Drawer = ({
  children,
  handleOnly,
  open,
  onClose,
  title,
}: DrawerProps) => {
  const keyboardInset = useKeyboardInset(open);

  return (
    <DrawerContainer>
      <VaulDrawer.Root
        dismissible
        handleOnly={handleOnly}
        open={open}
        onOpenChange={isOpen => !isOpen && onClose()}
        repositionInputs={false}
      >
        <VaulDrawer.Portal>
          <VisuallyHiddenTitle>{title}</VisuallyHiddenTitle>
          <StyledOverlay onClick={onClose} />
          <StyledContent
            style={
              { '--keyboard-inset': `${keyboardInset}px` } as CSSProperties
            }
          >
            <DragHandle />
            {children}
          </StyledContent>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    </DrawerContainer>
  );
};

export default Drawer;
