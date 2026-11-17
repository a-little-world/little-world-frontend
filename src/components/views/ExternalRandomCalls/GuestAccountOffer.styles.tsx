import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { softCardShadowValue } from '../PartnerLanding/shadow';

export const Illustration = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const OfferLayout = styled.div<{ $single: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.large};
  text-align: left;

  ${({ $single, theme }) =>
    $single
      ? css`
          max-width: 32rem;
        `
      : css`
          @media (min-width: ${theme.breakpoints.medium}) {
            grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
            align-items: start;
          }
        `}
`;

export const OfferCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.large};
  text-align: left;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: ${({ theme }) => softCardShadowValue({ theme })};
`;

export const CallListCard = styled(OfferCard)`
  order: 2;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      order: 1;
    }
  `}
`;

export const AccountCard = styled(OfferCard)`
  order: 1;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      order: 2;
    }
  `}
`;

export const CardHeading = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h2' as const,
  bold: true,
})`
  margin: 0;
  text-wrap: balance;
`;

export const CallRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.small};
  border-top: 1px dashed ${({ theme }) => theme.color.border.subtle};

  &:first-of-type {
    padding-top: 0;
    border-top: 0;
  }
`;

export const Avatar = styled.span<{ $tone: 'orange' | 'blue' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme, $tone }) =>
    $tone === 'orange'
      ? theme.color.gradient.orange10
      : theme.color.gradient.blue10};
  color: ${({ theme }) => theme.color.text.button};
  font-weight: 600;
`;

export const AvatarPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CallCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
`;

export const CallName = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
})`
  margin: 0;
  font-weight: 600;
`;

export const CallMeta = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const Benefit = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const TickCircle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.half};
  background: #c7ebd1;
`;

export const BenefitText = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
})`
  margin: 0;
`;

export const LaterLink = styled.div`
  display: flex;
  justify-content: center;
`;

export const Footnote = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  margin: ${({ theme }) => `${theme.spacing.xsmall} 0 0`};
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: 0.75rem;
  text-align: center;
`;

export const Goodbye = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 32rem;
`;
