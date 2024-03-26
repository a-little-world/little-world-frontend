import { ChevronDownIcon } from '@a-little-world/little-world-design-system';
import React from 'react';
import ReactDrawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import styled from 'styled-components';

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
    <>
      <StyledDrawer open={open} onClose={onClose} direction={direction}>
        <ChevronDownIcon
          label="close drawer"
          labelId="closeDrawer"
          width="24"
          height="24"
        />
        {children}
      </StyledDrawer>
    </>
  );
};

export default Drawer;
