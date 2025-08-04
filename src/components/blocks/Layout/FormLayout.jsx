import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '../Header.tsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  overflow: hidden;

  ${({ theme }) => `
  padding: ${theme.spacing.small};

  @media (min-width: ${theme.breakpoints.small}) {
      flex: unset;
      padding: ${theme.spacing.large};
    }
  `}
`;

const FormLayout = ({ children }) => (
  <Wrapper>
    <Header />
    <Content>{children || <Outlet />}</Content>
  </Wrapper>
);

export default FormLayout;
