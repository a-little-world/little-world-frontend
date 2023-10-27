import { Outlet } from "react-router-dom";
import styled from "styled-components";

import Sidebar from "../Sidebar";

const Wrapper = styled.div`
  overflow-x: hidden;
  display: flex;
  padding: 30px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const AppLayout = ({ children, page, sidebarMobile }) => {
  return (
    <Wrapper $page={page} className={`main-page show-${page}`}>
      <Sidebar sidebarMobile={sidebarMobile} />
      {children || <Outlet />}
    </Wrapper>
  );
};

export default AppLayout;
