import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  StarIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import type { ResolvedBadge } from '../../helpers/matchOverviewBadges';

export interface NextBadgeNudgeProps {
  badge: Extract<ResolvedBadge, { status: 'in_progress' }> | null;
  onPlanCall: () => void;
  className?: string;
}

const Banner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.radius.large};
  background: ${({ theme }) => theme.color.surface.accent};
  color: ${({ theme }) => theme.color.text.primary};
`;

const IconWrap = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${({ theme }) => theme.color.text.highlight};
`;

const Copy = styled(Text)`
  flex: 1;
  min-width: 0;

  b,
  strong {
    font-weight: 700;
  }
`;

const PlanButton = styled(Button)`
  flex-shrink: 0;
`;

function NextBadgeNudge({ badge, onPlanCall, className }: NextBadgeNudgeProps) {
  const { t } = useTranslation();

  if (!badge) {
    return null;
  }

  return (
    <Banner className={className}>
      <IconWrap aria-hidden>
        <StarIcon label="" width={24} height={24} />
      </IconWrap>
      <Copy type={TextTypes.Body5} tag="p">
        <Trans
          i18nKey="match_overview.next_badge_nudge"
          values={{
            badgeName: t(badge.nameKey),
            remaining: badge.remaining,
            count: badge.remaining,
          }}
          components={{ b: <strong /> }}
        />
      </Copy>
      <PlanButton
        appearance={ButtonAppearance.Secondary}
        size={ButtonSizes.Small}
        type="button"
        onClick={onPlanCall}
      >
        {t('match_overview.plan_call')}
      </PlanButton>
    </Banner>
  );
}

export default NextBadgeNudge;
