import React from 'react';

import type { ResolvedBadge } from '../../../helpers/matchOverviewBadges';
import NextBadgeNudge from './NextBadgeNudge';

export default {
  title: 'Molecules/NextBadgeNudge',
  component: NextBadgeNudge,
};

const inProgress: Extract<ResolvedBadge, { status: 'in_progress' }> = {
  id: 'ten_active_weeks',
  nameKey: 'match_overview.badges.ten_active_weeks.name',
  unlockHintKey: 'match_overview.badges.ten_active_weeks.hint',
  icon: 'star',
  metric: 'active_weeks',
  status: 'in_progress',
  current: 8,
  target: 10,
  remaining: 2,
  progress: 0.8,
};

export const Default = () => (
  <NextBadgeNudge badge={inProgress} onPlanCall={() => undefined} />
);

export const Hidden = () => (
  <NextBadgeNudge badge={null} onPlanCall={() => undefined} />
);
