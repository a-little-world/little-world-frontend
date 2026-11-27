import {
  Button,
  Link,
  Card as DSCard,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css, DefaultTheme } from 'styled-components';

import { DoorVisual } from './doors';

/** Same width as the secondary button and the inputs. */
export const outlineWidth = '2px';

const ring = (theme: DefaultTheme, outer: string) =>
  `inset 0 0 0 ${outlineWidth} ${theme.color.border.reversed}, 0 0 0 ${outlineWidth} ${outer}`;

const blueDoor = (theme: DefaultTheme) => css`
  background: ${theme.color.text.heading};
  color: ${theme.color.text.button};
  box-shadow: ${ring(theme, theme.color.border.bold)};
`;

const whiteDoor = (theme: DefaultTheme) => css`
  background: ${theme.color.surface.primary};
  color: ${theme.color.text.primary};
  box-shadow: ${ring(theme, theme.color.border.selected)};
`;

export const doorShell = css<{ $state: DoorVisual }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 11rem;
  min-width: 0;
  height: auto;
  align-self: stretch;
  padding: ${({ theme }) =>
    `${theme.spacing.medium} ${theme.spacing.small} ${theme.spacing.small}`};
  border: 0;
  border-radius: ${({ theme }) =>
    `${theme.radius.massive} ${theme.radius.massive} ${theme.radius.small} ${theme.radius.small}`};
  font: inherit;
  text-align: center;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      width: 12rem;
      padding: ${theme.spacing.medium} ${theme.spacing.medium}
        ${theme.spacing.small};
    }
  `}

  ${({ theme, $state }) =>
    $state === 'booked' ? whiteDoor(theme) : blueDoor(theme)}
`;

const lift = css<{ $state: DoorVisual }>`
  &:hover,
  &:focus-visible {
    transform: translateY(calc(${({ theme }) => theme.spacing.xxxsmall} * -1));
    box-shadow: ${({ theme }) => ring(theme, theme.color.border.selected)};
  }

  &:focus-visible {
    outline: ${outlineWidth} solid ${({ theme }) => theme.color.border.selected};
    outline-offset: ${({ theme }) => theme.spacing.xxxsmall};
  }
`;

export const DoorCard = styled.div<{ $state: DoorVisual }>`
  ${doorShell}
`;

export const DoorButton = styled.button<{ $state: DoorVisual }>`
  ${doorShell}
  ${lift}
  cursor: pointer;
`;

export const DoorFrame = styled.div<{ $state: DoorVisual }>`
  ${doorShell}
  gap: ${({ theme }) => theme.spacing.xxsmall};

  &:hover {
    transform: translateY(calc(${({ theme }) => theme.spacing.xxxsmall} * -1));
    box-shadow: ${({ theme }) => ring(theme, theme.color.border.selected)};
  }

  &:focus-within {
    outline: ${outlineWidth} solid ${({ theme }) => theme.color.border.selected};
    outline-offset: ${({ theme }) => theme.spacing.xxxsmall};
  }
`;

export const DoorHit = styled.button`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;

  &:focus-visible {
    outline: none;
  }
`;

export const Weekday = styled(Text).attrs({
  type: TextTypes.Body7,
  tag: 'span',
})<{ $muted?: boolean }>`
  margin: 0 0 ${({ theme }) => theme.spacing.xxxsmall};
  color: ${({ theme, $muted }) =>
    $muted ? theme.color.text.tertiary : 'inherit'};
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DayNumber = styled(Text).attrs({
  type: TextTypes.Heading4,
  tag: 'span',
})<{
  $booked?: boolean;
}>`
  margin: 0 0 ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme, $booked }) =>
    $booked ? theme.color.text.title : 'inherit'};
  font-family: 'Work Sans', sans-serif;
  line-height: 1;
`;

export const Divider = styled.span<{ $booked?: boolean }>`
  display: block;
  width: 2ch;
  height: ${outlineWidth};
  margin: 0 0 ${({ theme }) => theme.spacing.xsmall};
  background: ${({ theme, $booked }) =>
    $booked ? theme.color.border.message : theme.color.border.reversed};
  opacity: ${({ $booked }) => ($booked ? 1 : 0.4)};
`;

export const Company = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span',
})`
  display: -webkit-box;
  overflow: hidden;
  width: 100%;
  min-height: 2.6em;
  margin: 0 0 ${({ theme }) => theme.spacing.xxsmall};
  color: inherit;
  font-weight: 700;
  line-height: 1.3;
  text-wrap: balance;
  overflow-wrap: break-word;
  hyphens: auto;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const TimeText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span',
})`
  margin: 0;
  color: inherit;
`;

export const TimeRow = styled.span<{ $muted?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  color: ${({ theme, $muted }) =>
    $muted ? theme.color.text.tertiary : 'inherit'};
  white-space: nowrap;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const Spacer = styled.span`
  width: 100%;
  min-height: ${({ theme }) => theme.spacing.xsmall};
`;

export const Places = styled(Text).attrs({
  type: TextTypes.Body7,
  tag: 'span',
})`
  color: inherit;
`;

export const DoorCta = styled(Button)`
  width: 100%;
  min-width: 0;
  max-width: none;
  pointer-events: none;
  height: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

export const StatusRow = styled.span`
  display: inline-flex;
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CancelLink = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ theme }) => theme.color.text.link};
  font: inherit;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.color.text.title};
  }
`;

export const JoinLink = styled(Link)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
`;

/** Same page wrapper as Resources and About Us: a small gutter on phones only. */
export const Content = styled.div`
  ${({ theme }) => css`
    width: 100%;
    max-width: 1200px;
    padding: ${theme.spacing.xxsmall};

    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;

export const Card = styled(DSCard)`
  text-align: left;
  gap: ${({ theme }) => theme.spacing.large};
`;

export const LoadingCard = styled(Card)`
  align-items: center;
  justify-content: center;
  min-height: 240px;
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const HeaderText = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: flex-start;
  min-width: min(100%, 16rem);
  gap: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      max-width: 66%;
    }
  `}
`;

export const Title = styled(Text).attrs({
  type: TextTypes.Heading4,
  tag: 'h2',
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.title};
  font-family: 'Work Sans', sans-serif;
`;

export const Lead = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p',
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.primary};
  text-wrap: pretty;
`;

export const Instruction = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const InstructionMark = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing.xlarge};
  height: ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.accent};
`;

export const InstructionText = styled(Text).attrs({ tag: 'span' })`
  margin: 0;
  color: ${({ theme }) => theme.color.text.heading};
  font-weight: 700;
`;

export const Doors = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  row-gap: ${({ theme }) => theme.spacing.medium};
  column-gap: ${({ theme }) => theme.spacing.medium};
`;

export const Footer = styled.p`
  display: flex;
  align-items: flex-start;
  margin: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const FooterText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span',
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const LiveRegion = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`;
