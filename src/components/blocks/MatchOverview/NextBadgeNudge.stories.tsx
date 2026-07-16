import React from 'react';

import type { ResolvedBadge } from '../../../helpers/matchOverviewBadges';
import NextBadgeNudge from './NextBadgeNudge';

export default {
  title: 'Molecules/NextBadgeNudge',
  component: NextBadgeNudge,
};

const inProgress: Extract<ResolvedBadge, { status: 'in_progress' }> = {
  id: 'ten_calls',
  nameKey: 'match_overview.badges.ten_calls.name',
  unlockHintKey: 'match_overview.badges.ten_calls.hint',
  icon: 'star',
  status: 'in_progress',
  current: 7,
  target: 10,
  remaining: 3,
  progress: 0.7,
};

export const Default = () => (
  <NextBadgeNudge badge={inProgress} onPlanCall={() => undefined} />
);

export const Hidden = () => (
  <NextBadgeNudge badge={null} onPlanCall={() => undefined} />
);
