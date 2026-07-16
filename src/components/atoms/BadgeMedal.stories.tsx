import React from 'react';

import type { ResolvedBadge } from '../../helpers/matchOverviewBadges';
import BadgeMedal from './BadgeMedal';

export default {
  title: 'Atoms/BadgeMedal',
  component: BadgeMedal,
};

const earned: ResolvedBadge = {
  id: 'first_call',
  nameKey: 'match_overview.badges.first_call.name',
  unlockHintKey: 'match_overview.badges.first_call.hint',
  icon: 'video',
  status: 'earned',
  earnedAt: new Date('2026-05-01'),
  current: 1,
  target: 1,
  remaining: 0,
  progress: 1,
};

const inProgress: ResolvedBadge = {
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

const locked: ResolvedBadge = {
  id: 'twenty_calls',
  nameKey: 'match_overview.badges.twenty_calls.name',
  unlockHintKey: 'match_overview.badges.twenty_calls.hint',
  icon: 'heart',
  status: 'locked',
  current: 7,
  target: 20,
  remaining: 13,
  progress: 0.35,
};

export const Earned = () => <BadgeMedal badge={earned} />;
export const InProgress = () => <BadgeMedal badge={inProgress} />;
export const Locked = () => <BadgeMedal badge={locked} />;
