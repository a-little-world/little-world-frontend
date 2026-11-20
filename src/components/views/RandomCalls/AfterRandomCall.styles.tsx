import {
  Button,
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { softCardShadowValue } from '../PartnerLanding/shadow';

const OPTION_CARD_MAX_WIDTH = '640px';

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
    `${theme.spacing.medium} ${theme.spacing.medium} ${theme.spacing.xxlarge}`};
  text-align: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xlarge} ${theme.spacing.large};
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
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      font-size: 3rem;
    }
  `}
`;

export const WindowStatus = styled.p<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme, $open }) =>
    $open ? theme.color.text.heading : theme.color.text.secondary};
  font-size: 0.875rem;
  font-weight: 600;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin-bottom: ${theme.spacing.large};
    }
  `}
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      align-items: stretch;
      justify-items: center;
    }
  `}
`;

export const OptionCard = styled(Card)<{ $recommended?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.large};
  text-align: left;
  box-shadow: ${({ theme }) => softCardShadowValue({ theme })};
  border: 2px solid
    ${({ theme, $recommended }) =>
      $recommended ? theme.color.text.title : 'transparent'};
  max-width: ${OPTION_CARD_MAX_WIDTH};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      align-items: center;
      text-align: center;
    }
  `}
`;

export const CardIntro = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: column;
      margin-bottom: 0;
    }
  `}
`;

export const CardCopy = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const IllustrationSlot = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 5.5rem;

  svg,
  img {
    width: 5.5rem;
    height: auto;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      width: auto;
      height: 7.5rem;

      svg,
      img {
        width: 7.5rem;
      }
    }
  `}
`;

export const CardTitle = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h2' as const,
  bold: true,
})`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const CardBody = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  margin-bottom: 0;
  color: ${({ theme }) => theme.color.text.secondary};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin: ${theme.spacing.xsmall} 0 ${theme.spacing.medium};
    }
  `}
`;

export const CardButton = styled(Button)`
  margin-top: auto;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const ReportRow = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: 0.875rem;
  margin-top: auto;
`;

export const EndedCopy = styled(Text).attrs({
  type: TextTypes.Body4,
  tag: 'p' as const,
})`
  max-width: 36rem;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.color.text.secondary};
`;
