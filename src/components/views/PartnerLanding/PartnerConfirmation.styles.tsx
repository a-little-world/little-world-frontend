import {
  Button,
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { pageSidePadding } from './PartnerLanding.styles';
import { softCardShadowValue } from './shadow';

export const ConfirmPage = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const ConfirmIntro = styled.section`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};
  padding-top: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xxxsmall})`};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
  ${pageSidePadding}
`;

export const ConfirmTitle = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h1' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.button};
  max-width: 56rem;
  line-height: 1.1;
  text-wrap: balance;
  text-shadow: 0 1px 8px rgb(0 0 0 / 50%);
  margin: 0;

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      font-size: 1.875rem;
    }
  `}
`;

export const ConfirmLead = styled(Text).attrs({
  type: TextTypes.Body4,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  max-width: 50rem;
  text-shadow: 0 1px 8px rgb(0 0 0 / 50%);
  margin: 0;

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      font-size: 1rem;
    }
  `}
`;

export const ConfirmCards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.large};
  padding-top: ${({ theme }) => theme.spacing.large};
  padding-bottom: ${({ theme }) => theme.spacing.small};
  ${pageSidePadding}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      justify-content: center;
    }
  `}
`;

export const ConfirmCard = styled(Card)`
  && {
    flex: 1;
    width: 100%;
    max-width: 100%;
    gap: ${({ theme }) => theme.spacing.medium};
    align-items: stretch;
    border: none;
    border-radius: ${({ theme }) => theme.radius.large};
    padding: ${({ theme }) => theme.spacing.medium};
    box-shadow:
      inset 0 0 0 1px ${({ theme }) => theme.color.border.subtle},
      ${softCardShadowValue};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        max-width: 37rem;
        border-radius: ${theme.radius.xlarge};
        padding: ${theme.spacing.large};
      }
    }
  `}
`;

export const ConfirmCardTitle = styled(Text).attrs({
  type: TextTypes.Heading5,
  tag: 'h2' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
  margin: 0;
`;

export const ConfirmCardText = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  line-height: 1.5;
  margin: 0;
`;

export const LinkRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: stretch;
    }
  `}
`;

export const LinkField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  flex: 1;
  min-width: 0;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  padding: 0
    ${({ theme }) =>
      `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.secondary};
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    ${({ theme }) => theme.color.border.subtle};

  svg {
    flex-shrink: 0;
    opacity: 0.6;
  }
`;

export const LinkValue = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.color.text.primary};
`;

export const CopyButton = styled(Button)<{ $copied?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  flex-shrink: 0;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  padding: 0
    ${({ theme }) =>
      `calc(${theme.spacing.medium} - ${theme.spacing.xxxxsmall})`};

  ${({ $copied, theme }) =>
    $copied &&
    css`
      background: ${theme.color.surface.success};
      color: ${theme.color.text.success};
      filter: none;

      &:hover {
        filter: none;
      }
    `}

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      width: 100%;
    }
  `}
`;

export const CalendarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CalendarOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  padding: ${({ theme }) =>
    `${`calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`} ${theme.spacing.small}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.primary};
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    ${({ theme }) => theme.color.border.subtle};
  text-align: left;
  cursor: pointer;
  transition: box-shadow 160ms ease;

  &:hover {
    box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.highlight};
  }
`;

export const CalendarOptionCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
  min-width: 0;
  flex: 1;
`;

export const CalendarOptionTitle = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
`;

export const CalendarOptionSubtitle = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.quaternary};
`;

export const CalendarChevron = styled.span`
  display: flex;
  opacity: 0.5;
  flex-shrink: 0;
`;

export const InfoBarWrap = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
  ${pageSidePadding}
`;

export const InfoBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 76rem;
  margin: 0 auto;
  padding: ${({ theme }) =>
    `${`calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`} ${theme.spacing.medium}`};
  border-radius: ${({ theme }) => theme.radius.medium};
  background: ${({ theme }) => theme.color.surface.secondary};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  `}
`;

export const InfoBarCopy = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
  color: ${({ theme }) => theme.color.text.primary};

  svg {
    flex-shrink: 0;
    opacity: 0.7;
    margin-top: ${({ theme }) => theme.spacing.xxxxsmall};
  }
`;

export const InfoBarText = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  line-height: 1.5;
  margin: 0;
`;

export const InfoBarSupport = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  flex-shrink: 0;
  white-space: nowrap;
`;
