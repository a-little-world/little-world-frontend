import { Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';

import Sidebar from '../Sidebar';

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  min-height: 100vh;
  box-sizing: border-box;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
      gap: ${theme.spacing.small};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.large};
      gap: ${theme.spacing.large};
    }
  `};
`;

const AppLayout = ({ children, page, sidebarMobile }) => (
  <Wrapper $page={page} className={page ? `main-page show-${page}` : null}>
    <Sidebar sidebarMobile={sidebarMobile} />
    {children || <Outlet />}
  </Wrapper>
);

export default AppLayout;
