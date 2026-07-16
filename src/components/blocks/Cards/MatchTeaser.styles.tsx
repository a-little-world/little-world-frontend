import {
  ChevronRightIcon,
  ClockIcon,
  HeartIcon,
  MessageIcon,
  StarIcon,
  Text,
  TextTypes,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { Link } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';

import type { MatchTeaserIcon, MatchTeaserVariant } from '../../../helpers/matchTeaserViewModel';

export type TeaserTint = MatchTeaserVariant;

const teaserBackground = (tint: TeaserTint, theme: DefaultTheme) => {
  if (tint === 'success') return theme.color.surface.success;
  if (tint === 'accent') return theme.color.surface.accent;
  return theme.color.surface.subtle;
};

const teaserForeground = (tint: TeaserTint, theme: DefaultTheme) => {
  if (tint === 'success') return theme.color.text.success;
  if (tint === 'accent') return theme.color.text.highlight;
  return theme.color.text.heading;
};

export const TeaserLink = styled(Link)<{ $tint: TeaserTint }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid transparent;
  text-decoration: none;
  transition: transform 160ms ease, border-color 160ms ease;
  background: ${({ theme, $tint }) => teaserBackground($tint, theme)};
  color: ${({ theme, $tint }) => teaserForeground($tint, theme)};

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.color.border.selected};
  }
`;

export const TeaserSummary = styled.div<{ $tint: TeaserTint }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.radius.small};
  border: 2px solid transparent;
  background: ${({ theme, $tint }) => teaserBackground($tint, theme)};
  color: ${({ theme, $tint }) => teaserForeground($tint, theme)};
`;

export const TeaserIconWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: inherit;
`;

export const TeaserText = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
`;

export const TeaserTitle = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TeaserSubline = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TeaserChevron = styled(ChevronRightIcon).attrs({
  width: 16,
  height: 16,
})`
  flex-shrink: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const TeaserIcon = ({
  icon,
  label,
}: {
  icon: MatchTeaserIcon;
  label: string;
}) => {
  const iconProps = { label, width: 24, height: 24 };

  switch (icon) {
    case 'star':
      return <StarIcon {...iconProps} />;
    case 'message':
      return <MessageIcon {...iconProps} />;
    case 'video':
      return <VideoIcon {...iconProps} />;
    case 'clock':
      return <ClockIcon {...iconProps} />;
    case 'heart':
      return <HeartIcon {...iconProps} />;
    default:
      return null;
  }
};
