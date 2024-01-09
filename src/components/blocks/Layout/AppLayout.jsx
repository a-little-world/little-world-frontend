import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Sidebar from '../Sidebar';

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const AppLayout = ({ children, page, sidebarMobile }) => (
  <Wrapper $page={page} className={page ? `main-page show-${page}` : null}>
    <Sidebar sidebarMobile={sidebarMobile} />
    {children || <Outlet />}
  </Wrapper>
);

export default AppLayout;
