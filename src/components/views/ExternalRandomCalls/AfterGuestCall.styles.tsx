import {
  Button,
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { softCardShadowValue } from '../PartnerLanding/shadow';
import { OPEN_LOBBY_DOT } from './ExternalRandomCallsPortal.styles';

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: ${({ theme }) =>
    `${theme.spacing.xlarge} ${theme.spacing.medium} ${theme.spacing.xxlarge}`};
  text-align: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxxlarge} ${theme.spacing.large}
        ${theme.spacing.massive};
    }
  `}
`;

export const Title = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h1' as const,
  bold: true,
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.title};
  text-wrap: balance;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      font-size: 3rem;
    }
  `}
`;

export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding: ${({ theme }) => `${theme.spacing.xsmall} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.radius.massive};
  background: ${({ theme }) => theme.color.surface.secondary};
  color: ${({ theme }) => theme.color.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const WindowStatus = styled.p<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  margin: ${({ theme }) => `${theme.spacing.medium} 0 0`};
  color: ${({ theme, $open }) =>
    $open ? theme.color.text.heading : theme.color.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;
`;

export const StatusDot = styled.span<{ $open: boolean }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme, $open }) =>
    $open ? OPEN_LOBBY_DOT : theme.color.text.quaternary};
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.large};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      align-items: stretch;
    }
  `}
`;

export const OptionCard = styled(Card)<{ $recommended?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.large};
  text-align: center;
  box-shadow: ${({ theme }) => softCardShadowValue({ theme })};
  border: 2px solid
    ${({ theme, $recommended }) =>
      $recommended ? theme.color.text.title : 'transparent'};
`;

export const IllustrationSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 7.5rem;
`;

export const CardTitle = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h2' as const,
  bold: true,
})`
  margin: ${({ theme }) => `${theme.spacing.small} 0 0`};
`;

export const CardBody = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  margin: ${({ theme }) => `${theme.spacing.xsmall} 0 ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const CardButton = styled(Button)`
  && {
    width: 100%;
    margin-top: auto;
  }
`;

export const ReportRow = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  margin: ${({ theme }) => `${theme.spacing.large} 0 0`};
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: 0.875rem;
`;

export const EndedCopy = styled(Text).attrs({
  type: TextTypes.Body4,
  tag: 'p' as const,
})`
  max-width: 36rem;
  margin: ${({ theme }) => `${theme.spacing.medium} 0 0`};
  color: ${({ theme }) => theme.color.text.secondary};
`;
