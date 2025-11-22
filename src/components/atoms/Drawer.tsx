import {
  Button,
  ButtonVariations,
  ChevronDownIcon,
} from '@a-little-world/little-world-design-system';
import ReactDrawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import styled, { css } from 'styled-components';

const DrawerContainer = styled.div`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: none;
    }
  `}
`;

const StyledDrawer = styled(ReactDrawer)`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.color.surface.primary} !important;
  height: 80% !important;
  padding: ${({ theme }) => theme.spacing.small};
  padding-top: 0;
  border-radius: ${({ theme }) =>
    `${theme.radius.small} ${theme.radius.small} 0 0`};
  overflow: scroll;
`;

const CloseButton = styled(Button)`
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing.small};
`;

type DrawerProps = {
  children: any;
  direction?: 'bottom' | 'left' | 'right' | 'top';
  onClose: () => void;
  open: boolean;
};

const Drawer = ({
  children,
  direction = 'bottom',
  open,
  onClose,
}: DrawerProps) => (
  <DrawerContainer>
    <StyledDrawer open={open} onClose={onClose} direction={direction}>
      <CloseButton variation={ButtonVariations.Icon} onClick={onClose}>
        <ChevronDownIcon label="close drawer" width="16" height="16" />
      </CloseButton>
      {children}
    </StyledDrawer>
  </DrawerContainer>
);

export default Drawer;
