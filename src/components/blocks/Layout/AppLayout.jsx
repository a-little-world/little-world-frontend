import { Outlet } from "react-router-dom";
import styled from "styled-components";

import WebsocketBridge from "../../../WebsocketBridge";
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
      <WebsocketBridge />
      <Sidebar sidebarMobile={sidebarMobile} />
      {children || <Outlet />}
    </Wrapper>
  );
};

export default AppLayout;
