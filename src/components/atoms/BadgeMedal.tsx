import {
  ClockIcon,
  EyeClosedIcon,
  Gradients,
  HeartIcon,
  MessageIcon,
  ProgressRing,
  ProgressRingAppearances,
  ProgressRingSizes,
  StarIcon,
  Text,
  TextTypes,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import type { ResolvedBadge } from '../../helpers/matchOverviewBadges';

export interface BadgeMedalProps {
  badge: ResolvedBadge;
  className?: string;
}

export interface BadgeViewToggleProps {
  expanded: boolean;
  /** Badges not shown in the collapsed row — rendered as +N in the well. */
  hiddenCount: number;
  onClick: () => void;
  className?: string;
}

const ICON_SIZE = 32;

const medalColumn = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
`;

const Medal = styled.div<{ $status: ResolvedBadge['status'] }>`
  ${medalColumn}
`;

/**
 * Same outer size as ProgressRing small so the wells sit on the medal line, but
 * dashed and unfilled so it cannot be read as another badge.
 */
const ToggleWell = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: ${({ theme }) => theme.spacing.xxlarge};
  height: ${({ theme }) => theme.spacing.xxlarge};
  border-radius: ${({ theme }) => theme.radius.half};
  border: ${({ theme }) => theme.spacing.xxxxsmall} dashed
    ${({ theme }) => theme.color.border.moderate};
  background: ${({ theme }) => theme.color.surface.secondary};
  color: ${({ theme }) => theme.color.text.secondary};
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    border-style 0.3s ease;
`;

const ToggleMedal = styled.button`
  ${medalColumn}
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  font: inherit;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    border-style 0.5s ease;

  &:hover ${ToggleWell}, &:focus-visible ${ToggleWell} {
    background: ${({ theme }) => theme.color.surface.secondary};
    border-color: ${({ theme }) => theme.color.border.moderate};
    border-style: solid;
    color: ${({ theme }) => theme.color.text.secondary};
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible ${ToggleWell} {
    outline: ${({ theme }) => theme.spacing.xxxxsmall} solid
      ${({ theme }) => theme.color.border.selected};
    outline-offset: ${({ theme }) => theme.spacing.xxxxsmall};
  }
`;

const ToggleCount = styled(Text)`
  color: ${({ theme }) => theme.color.text.tertiary};
  line-height: 1;
`;

const ToggleLabel = styled(Text)`
  color: ${({ theme }) => theme.color.text.link};
`;

const Name = styled(Text)<{ $status: ResolvedBadge['status'] }>`
  color: ${({ theme, $status }) =>
    $status === 'in_progress'
      ? theme.color.text.highlight
      : theme.color.text.primary};
  font-weight: 600;
`;

const Meta = styled(Text)<{ $status: ResolvedBadge['status'] }>`
  color: ${({ theme, $status }) =>
    $status === 'in_progress'
      ? theme.color.text.highlight
      : theme.color.text.tertiary};
`;

const BadgeIcon = ({
  icon,
  muted,
}: {
  icon: ResolvedBadge['icon'];
  muted?: boolean;
}) => {
  const theme = useTheme();
  const props = {
    label: '',
    width: ICON_SIZE,
    height: ICON_SIZE,
    ...(muted
      ? { color: theme.color.text.disabled }
      : { gradient: Gradients.Orange }),
  };

  switch (icon) {
    case 'star':
      return <StarIcon {...props} />;
    case 'heart':
      return <HeartIcon {...props} />;
    case 'message':
      return <MessageIcon {...props} />;
    case 'video':
      return <VideoIcon {...props} />;
    case 'clock':
      return <ClockIcon {...props} />;
    default:
      return null;
  }
};

function BadgeMedal({ badge, className }: BadgeMedalProps) {
  const { t, i18n } = useTranslation();
  const name = t(badge.nameKey);

  // Subtext is optional, and it is one of two things: the day an earned badge was
  // earned, or what an unearned one asks for. No running tally — "7 of 10, 3 weeks to
  // go" turned a keepsake into a progress bar with numbers, and the ring already shows
  // how far along it is. An earned badge whose date we could not infer simply has none.
  const earnedOn =
    badge.status === 'earned' && badge.earnedAt
      ? new Intl.DateTimeFormat(i18n.language, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(badge.earnedAt)
      : null;
  const meta =
    badge.status === 'earned' ? earnedOn : t(badge.unlockHintKey) || null;
  const ariaLabel = meta ? `${name}, ${meta}` : name;

  return (
    <Medal className={className} $status={badge.status} aria-label={ariaLabel}>
      {badge.status === 'in_progress' ? (
        <ProgressRing
          size={ProgressRingSizes.Small}
          value={badge.current}
          max={badge.target}
          label={ariaLabel}
        >
          <BadgeIcon icon={badge.icon} muted />
        </ProgressRing>
      ) : (
        <ProgressRing
          size={ProgressRingSizes.Small}
          label={ariaLabel}
          appearance={
            badge.status === 'earned'
              ? ProgressRingAppearances.Complete
              : ProgressRingAppearances.Inactive
          }
        >
          <BadgeIcon icon={badge.icon} muted={badge.status === 'locked'} />
        </ProgressRing>
      )}
      <Name type={TextTypes.Body6} tag="span" $status={badge.status}>
        {name}
      </Name>
      {meta ? (
        <Meta type={TextTypes.Body7} tag="span" $status={badge.status}>
          {meta}
        </Meta>
      ) : null}
    </Medal>
  );
}

/**
 * Last-slot control in the badge strip. Shares the medal column so the well sits
 * on the ring line; the +N count is the hidden remainder, not another badge.
 */
function BadgeViewToggle({
  expanded,
  hiddenCount,
  onClick,
  className,
}: BadgeViewToggleProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const copy = t(
    expanded
      ? 'match_overview.show_less_badges'
      : 'match_overview.show_all_badges',
  );

  return (
    <ToggleMedal
      className={className}
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
    >
      <ToggleWell>
        {expanded ? (
          <EyeClosedIcon label={copy} color={theme.color.text.tertiary} />
        ) : (
          <ToggleCount bold type={TextTypes.Body4} tag="span">
            +{hiddenCount}
          </ToggleCount>
        )}
      </ToggleWell>
      <ToggleLabel type={TextTypes.Body6} tag="span">
        {copy}
      </ToggleLabel>
    </ToggleMedal>
  );
}

export { BadgeViewToggle };
export default BadgeMedal;
