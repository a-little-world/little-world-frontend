import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import MobileNavBar from '../MobileNavBar';
import Sidebar from '../Sidebar';

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
      flex-direction: row;
      gap: ${theme.spacing.small};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.large};
      gap: ${theme.spacing.large};
    }
  `};
`;

const AppLayout = ({ children, page }) => {
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  return (
    <Wrapper className={page ? `main-page show-${page}` : null}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
      {children || <Outlet />}
    </Wrapper>
  );
};

export default AppLayout;
