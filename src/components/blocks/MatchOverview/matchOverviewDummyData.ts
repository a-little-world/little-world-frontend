import type { NiceAvatarProps } from 'react-nice-avatar';

import {
  MATCH_OVERVIEW_BADGE_DEFINITIONS,
  type BadgeDefinition,
} from '../../../helpers/matchOverviewBadges';
import type { CallDirection } from '../../atoms/CallHistoryRow';

export interface MatchOverviewProfile {
  first_name: string;
  image: string;
  image_type: string;
  avatar_config?: NiceAvatarProps;
}

export interface MatchOverviewCall {
  id: string;
  direction: CallDirection;
  startedAt: string;
  durationMinutes: number;
  bothParticipated: boolean;
}

export interface MatchOverviewPayload {
  week: number;
  calls: number;
  totalMinutes: number;
  streakWeeks: number;
  messages: number;
  matchedAt: string;
  lastCallAt: string | null;
  partner: MatchOverviewProfile;
  self: MatchOverviewProfile;
  badges: BadgeDefinition[];
  callHistory: MatchOverviewCall[];
}

const daysAgo = (days: number, hour = 18) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 30, 0, 0);
  return date.toISOString();
};

/**
 * Storybook-only dummy payload. The live Match Overview page reads
 * GET /api/matches/<uuid>/overview and resolves badges on the client from
 * ``MATCH_OVERVIEW_BADGE_DEFINITIONS``.
 */
export const PLACEHOLDER_STREAK_WEEKS = 3;

/** Counts the placeholder badges are resolved against, so the card is self-consistent. */
export const PLACEHOLDER_BADGE_STATS = {
  calls: 7,
  messages: 214,
  callMinutes: 165,
  activeWeeks: 8,
};

const PLACEHOLDER_EARNED_AT: Partial<Record<string, string>> = {
  first_call: daysAgo(40),
  fifty_messages: daysAgo(24),
  hundred_messages: daysAgo(12),
  two_hours: daysAgo(18),
  five_active_weeks: daysAgo(10),
};

export const PLACEHOLDER_BADGES: BadgeDefinition[] =
  MATCH_OVERVIEW_BADGE_DEFINITIONS.map(badge => {
    const earnedAt = PLACEHOLDER_EARNED_AT[badge.id];
    return earnedAt ? { ...badge, earnedAt } : badge;
  });

/** Temporary page payload for stories. Live page uses GET /api/matches/<uuid>/overview. */
export function getMatchOverviewDummyData(
  partner: MatchOverviewProfile,
  self: MatchOverviewProfile,
): MatchOverviewPayload {
  return {
    week: 8,
    calls: 7,
    totalMinutes: 165,
    streakWeeks: PLACEHOLDER_STREAK_WEEKS,
    messages: 214,
    matchedAt: daysAgo(56),
    lastCallAt: daysAgo(3),
    partner,
    self,
    badges: PLACEHOLDER_BADGES,
    callHistory: [
      {
        id: '1',
        direction: 'outgoing',
        startedAt: daysAgo(3),
        durationMinutes: 32,
        bothParticipated: true,
      },
      {
        id: '2',
        direction: 'incoming',
        startedAt: daysAgo(7),
        durationMinutes: 24,
        bothParticipated: true,
      },
      {
        id: '3',
        direction: 'outgoing',
        startedAt: daysAgo(12),
        durationMinutes: 41,
        bothParticipated: true,
      },
      {
        id: '4',
        direction: 'incoming',
        startedAt: daysAgo(18),
        durationMinutes: 18,
        bothParticipated: true,
      },
      {
        id: '5',
        direction: 'outgoing',
        startedAt: daysAgo(25),
        durationMinutes: 29,
        bothParticipated: true,
      },
      {
        id: '6',
        direction: 'incoming',
        startedAt: daysAgo(32),
        durationMinutes: 15,
        bothParticipated: true,
      },
    ],
  };
}
