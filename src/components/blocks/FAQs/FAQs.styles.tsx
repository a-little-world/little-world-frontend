import { Card, Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const FAQsCard = styled(Card)`
  min-height: 0;
  overflow: hidden;
  width: 100%;
  padding: 0;
  padding-top: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.medium}) {
    padding-top: ${theme.spacing.large};
    max-width: 1240px;
  }`}
`;

export const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  overflow-y: scroll;
  padding: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => `
  @media (min-width: ${theme.breakpoints.medium}) {
    padding: ${theme.spacing.large};
  }`}
`;

export const FAQImageWrapper = styled.div`
  width: 80%;
  max-width: 160px;
  margin: 0 auto;
`;

export const FAQItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const FAQSectionTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

export const FAQsDescription = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;
