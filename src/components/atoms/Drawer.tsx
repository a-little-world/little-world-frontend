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
  flex-shrink: 0;
  z-index: 101;
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
  onClose: () => void;
  open: boolean;
  title: string;
};

const Drawer = ({ children, open, onClose, title }: DrawerProps) => (
  <DrawerContainer>
    <VaulDrawer.Root
      open={open}
      onOpenChange={isOpen => !isOpen && onClose()}
      dismissible
    >
      <VaulDrawer.Portal>
        <VisuallyHiddenTitle>{title}</VisuallyHiddenTitle>
        <StyledOverlay onClick={onClose} />
        <StyledContent>
          <DragHandle />
          {children}
        </StyledContent>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  </DrawerContainer>
);

export default Drawer;
