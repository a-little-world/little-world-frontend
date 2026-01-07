import {
  ChevronDownIcon,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';
import { Drawer as VaulDrawer } from 'vaul';

const DrawerContainer = styled.div`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: none;
    }
  `}
`;

const StyledContent = styled(VaulDrawer.Content)`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.color.surface.primary};
  height: 80%;
  padding: ${({ theme }) => theme.spacing.small};
  padding-top: 0;
  border-radius: ${({ theme }) =>
    `${theme.radius.small} ${theme.radius.small} 0 0`};
  overflow: scroll;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  outline: none;
  z-index: 100;
`;

const StyledOverlay = styled(VaulDrawer.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 4px;
  background-color: ${({ theme }) => theme.color.border.primary || '#ccc'};
  border-radius: 2px;
  margin: 8px 0;
`;

type DrawerProps = {
  children: any;
  onClose: () => void;
  open: boolean;
};

const Drawer = ({ children, open, onClose }: DrawerProps) => (
  <DrawerContainer>
    <VaulDrawer.Root
      open={open}
      onOpenChange={isOpen => !isOpen && onClose()}
      dismissible
    >
      <VaulDrawer.Portal>
        <StyledOverlay onClick={onClose} />
        <StyledContent>
          <DragHandle />
          {/* Provides the user with a visual cue that it can be scrolled */}

          <ChevronDownIcon label="close drawer" width="16" height="16" />

          {children}
        </StyledContent>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  </DrawerContainer>
);

export default Drawer;
