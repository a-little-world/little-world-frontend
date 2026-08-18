import {
  ClockIcon,
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
import styled, { useTheme } from 'styled-components';

import type { ResolvedBadge } from '../../helpers/matchOverviewBadges';

export interface BadgeMedalProps {
  badge: ResolvedBadge;
  className?: string;
}

const ICON_SIZE = 32;

const Medal = styled.div<{ $status: ResolvedBadge['status'] }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
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

export default BadgeMedal;
