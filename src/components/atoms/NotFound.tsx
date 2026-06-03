import { Card, CardHeader } from '@a-little-world/little-world-design-system';
import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const NotFoundCard = styled(Card)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) =>
    `${theme.spacing.massive} ${theme.spacing.medium} ${theme.spacing.xlarge}`};

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      border: none;
      box-shadow: none;
    }
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxlarge};
    }
  `}
`;

const NotFound = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <NotFoundCard>
    <CardHeader>{title}</CardHeader>
    {children}
  </NotFoundCard>
);

export default NotFound;
