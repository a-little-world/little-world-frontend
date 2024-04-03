import {
  Button,
  ButtonVariations,
  ChevronDownIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
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
  gap: ${({ theme }) => theme.spacing.medium};
  height: 80% !important;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) =>
    `${theme.radius.small} ${theme.radius.small} 0 0`};
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
}: DrawerProps) => {
  return (
    <DrawerContainer>
      <StyledDrawer open={open} onClose={onClose} direction={direction}>
        <Button variation={ButtonVariations.Icon} onClick={onClose}>
          <ChevronDownIcon
            label="close drawer"
            labelId="closeDrawer"
            width="24"
            height="24"
          />
        </Button>
        {children}
      </StyledDrawer>
    </DrawerContainer>
  );
};

export default Drawer;
