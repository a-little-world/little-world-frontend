import {
  Button,
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import { softCardShadowValue } from '../PartnerLanding/shadow';

export const StatusPane = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
`;

export const Page = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.xxlarge};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
      padding: ${theme.spacing.medium};
    }
  `}
`;

export const PartnerPill = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  display: none;
  align-items: center;
  margin: 0;
  padding: ${({ theme }) => `${theme.spacing.xxxsmall} ${theme.spacing.small}`};
  border: 1px solid ${({ theme }) => theme.color.border.moderate};
  border-radius: ${({ theme }) => theme.radius.massive};
  color: ${({ theme }) => theme.color.text.secondary};
  font-weight: 600;
  white-space: nowrap;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: inline-flex;
    }
  `}
`;

export const UserChip = styled.div<{ $avatarOnly?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  max-width: 16rem;
  min-width: 0;
  padding: ${({ theme, $avatarOnly }) =>
    $avatarOnly
      ? theme.spacing.xxxsmall
      : `${theme.spacing.xxxsmall} ${theme.spacing.small} ${theme.spacing.xxxsmall} ${theme.spacing.xxxsmall}`};
  border-radius: ${({ theme }) => theme.radius.massive};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

export const UserAvatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing.large};
  height: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme }) => theme.color.gradient.orange10};
  color: ${({ theme }) => theme.color.text.button};
  font-family: 'Signika Negative', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
`;

export const UserName = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  min-width: 0;
  margin: 0;
  overflow: hidden;
  color: ${({ theme }) => theme.color.text.primary};
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};
  border: 1px solid ${({ theme }) => theme.color.border.accent};
  border-radius: ${({ theme }) => theme.radius.medium};
  background: ${({ theme }) => theme.color.surface.subtle};
`;

export const BannerCopy = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  margin: 0;
  color: ${({ theme }) => theme.color.text.primary};
  line-height: 1.45;
`;

export const MainRow = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: start;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
      gap: ${theme.spacing.large};
    }
  `}
`;

export const SideStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  min-width: 0;
`;

export const SecondRow = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: stretch;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: 1fr 1fr;
      gap: ${theme.spacing.large};
    }
  `}
`;

export const LobbyCardShell = styled(Card)`
  box-shadow: ${({ theme }) => softCardShadowValue({ theme })};
`;

export const LobbyDoorSlot = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const LobbyBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  min-width: 0;
  padding: ${({ theme }) => `${theme.spacing.small} 0 ${theme.spacing.small}`};
`;

export const LobbyTitle = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h2' as const,
})`
  color: ${({ theme }) => theme.color.text.heading};
  text-wrap: balance;
`;

export const LobbyLead = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.primary};
`;

export const TimeSlot = styled(Text).attrs({
  type: TextTypes.Body3,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

export const OPEN_LOBBY_DOT = '#26d467';

export const StatusDot = styled.span<{ $open: boolean }>`
  width: ${({ theme }) => theme.spacing.xxsmall};
  height: ${({ theme }) => theme.spacing.xxsmall};
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ $open, theme }) =>
    $open ? OPEN_LOBBY_DOT : theme.color.text.quaternary};
`;

export const StatusLabel = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
  bold: true,
})<{ $open: boolean }>`
  color: ${({ $open, theme }) =>
    $open ? theme.color.text.heading : theme.color.text.secondary};
`;

export const NameForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

export const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  width: 100%;
  max-width: 30rem;
`;

export const NameHint = styled(Text).attrs({
  type: TextTypes.Body6,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const NameError = styled(Text).attrs({
  type: TextTypes.Body6,
})`
  color: ${({ theme }) => theme.color.text.error};
`;

export const StartButton = styled(Button)`
  && {
    align-self: stretch;
    gap: ${({ theme }) => theme.spacing.xsmall};
    width: 100%;
    max-width: 100%;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        align-self: flex-start;
        width: fit-content;
        max-width: 480px;
      }
    }
  `}
`;

export const StackCard = styled(Card)`
  box-shadow: ${({ theme }) => softCardShadowValue({ theme })};
  gap: ${({ theme }) => theme.spacing.small};
`;

export const EqualCard = styled(StackCard)`
  && {
    height: 100%;
  }
`;

export const CardTitle = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h2' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
`;

export const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Step = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing.xlarge};
  height: ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme }) => theme.color.surface.accent};
  color: ${({ theme }) => theme.color.text.title};
  font-family: 'Work Sans', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
`;

export const StepCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  min-width: 0;
`;

export const StepTitle = styled(Text).attrs({
  type: TextTypes.Body5,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
`;

export const StepBody = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const IconList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const IconRow = styled.li<{ $align?: 'center' | 'flex-start' }>`
  display: flex;
  align-items: ${({ $align }) => $align || 'flex-start'};
  gap: ${({ theme }) => theme.spacing.small};
  min-width: 0;
`;

export const IconSlot = styled.span<{ $paddingTop?: string }>`
  display: inline-flex;
  flex-shrink: 0;
  padding-top: ${({ $paddingTop }) => $paddingTop || 0};
`;

export const IconCopy = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  min-width: 0;
`;

export const RowText = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.primary};
  overflow-wrap: break-word;
`;

export const SecondaryIntro = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const VideoTiles = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      grid-template-columns: 1fr 1fr;
    }
  `}
`;

export const VideoTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.radius.medium};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

export const TileTitle = styled(Text).attrs({
  type: TextTypes.Body5,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const TileText = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const Footnote = styled(Text).attrs({
  type: TextTypes.Body5,
  center: true,
})`
  margin-top: auto;
  color: ${({ theme }) => theme.color.text.tertiary};
`;
