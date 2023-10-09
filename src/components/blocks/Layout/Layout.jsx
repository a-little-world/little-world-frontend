import React, { useEffect, useState } from "react";
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

const Layout = ({ children, page }) => {
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  return (
    <Wrapper $page={page} className={`main-page show-${page}`}>
      <Sidebar sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }} />
      {children || <Outlet />}
    </Wrapper>
  );
};

export default Layout;
