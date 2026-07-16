import {
  ClockIcon,
  Gradients,
  HeartIcon,
  MessageIcon,
  StarIcon,
  Text,
  TextTypes,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import type { ResolvedBadge } from '../../helpers/matchOverviewBadges';
import ProgressRing from './ProgressRing';

export interface BadgeMedalProps {
  badge: ResolvedBadge;
  className?: string;
}

const Medal = styled.div<{ $status: ResolvedBadge['status'] }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
`;

const Circle = styled.div<{ $status: ResolvedBadge['status'] }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(
    ${({ theme }) => theme.spacing.xxxlarge} +
      ${({ theme }) => theme.spacing.xxsmall}
  );
  height: calc(
    ${({ theme }) => theme.spacing.xxxlarge} +
      ${({ theme }) => theme.spacing.xxsmall}
  );
  border-radius: ${({ theme }) => theme.radius.half};
  flex-shrink: 0;

  ${({ theme, $status }) => {
    if ($status === 'earned') {
      return css`
        background: ${theme.color.surface.accent};
        border: 2px solid ${theme.color.border.selected};
      `;
    }
    if ($status === 'locked') {
      return css`
        background: ${theme.color.surface.disabled};
        border: 2px dashed ${theme.color.border.moderate};
        opacity: 0.55;
      `;
    }
    return css`
      background: transparent;
      border: none;
    `;
  }}
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
    width: 32,
    height: 32,
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

  let meta = '';
  let ariaLabel = name;

  if (badge.status === 'earned') {
    meta = new Intl.DateTimeFormat(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(badge.earnedAt);
    ariaLabel = `${name}, ${meta}`;
  } else if (badge.status === 'in_progress') {
    meta = t('match_overview.badge_progress', {
      current: badge.current,
      target: badge.target,
      remaining: badge.remaining,
      count: badge.remaining,
    });
    ariaLabel = t('match_overview.badge_aria_in_progress', {
      name,
      remaining: badge.remaining,
      count: badge.remaining,
    });
  } else {
    meta = t(badge.unlockHintKey);
    ariaLabel = `${name}, ${meta}`;
  }

  return (
    <Medal className={className} $status={badge.status} aria-label={ariaLabel}>
      {badge.status === 'in_progress' ? (
        <ProgressRing
          size="badge"
          value={badge.current}
          max={badge.target}
          label={ariaLabel}
        >
          <BadgeIcon icon={badge.icon} muted />
        </ProgressRing>
      ) : (
        <Circle $status={badge.status} aria-hidden>
          <BadgeIcon icon={badge.icon} muted={badge.status === 'locked'} />
        </Circle>
      )}
      <Name type={TextTypes.Body6} tag="span" $status={badge.status}>
        {name}
      </Name>
      <Meta type={TextTypes.Body7} tag="span" $status={badge.status}>
        {meta}
      </Meta>
    </Medal>
  );
}

export default BadgeMedal;
