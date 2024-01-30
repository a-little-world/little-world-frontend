import {
  Card,
  CardSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

export const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  text-align: center;

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.small}) {
      margin-bottom: ${theme.spacing.xxsmall};
    }
  `}
`;

export const StyledCard = styled(Card)`
  gap: ${({ theme }) => theme.spacing.medium};
`;

const Title = styled(Text)`
  color: ${({ theme }) => theme.color.text.highlight};
`;

export const ModalTitle = ({ children, ...rest }) => (
  <Title tag="h2" type={TextTypes.Heading4} center {...rest}>
    {children}
  </Title>
);

const ModalCard = ({ children, size }) => (
  <StyledCard width={size || CardSizes.Medium}>{children}</StyledCard>
);

export default ModalCard;
