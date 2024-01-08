import { Card, CardSizes } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%:

  ${({ theme }) => `
    gap: ${theme.spacing.medium};
    flex-wrap: wrap;

    > button {
      flex: 1;
    }

    @media (max-width: ${theme.breakpoints.medium}) {
      > button:first-child {
        order: 1;
      }
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.large};
      flex-wrap: no-wrap;
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

const ModalCard = ({ children }) => (
  <Card width={CardSizes.Large}>{children}</Card>
);

export default ModalCard;
