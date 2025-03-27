import { Card } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

export const NotFoundCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.medium} ${theme.spacing.xlarge}`};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) =>
    `
    gap: ${theme.spacing.small};

    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }`};
`;

export const VideoDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-top: 1px solid ${({ theme }) => theme.color.border.subtle};
  padding-top: ${({ theme }) => theme.spacing.small};

  ${({ theme }) =>
    `
@media (min-width: ${theme.breakpoints.medium}) {
 padding-top: ${theme.spacing.medium};
}`};
`;
