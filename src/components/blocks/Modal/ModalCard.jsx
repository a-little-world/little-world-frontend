import React from 'react';
import styled from 'styled-components';
import {
  Card, CardSizes
} from "@a-little-world/little-world-design-system";

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => `
  gap: ${theme.spacing.small};
  flex-wrap: wrap;

  > button {
    flex: 1;
  }

  @media (min-width: ${theme.breakpoints.small}) {
    gap: ${theme.spacing.large};
    flex-wrap: nowrap;
  }
  `}
`;

export const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.medium};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.large};
  }
  `}
`;

const ModalCard = ({ children }) =>
  <Card width={CardSizes.Large}>
    {children}
  </Card>

export default ModalCard