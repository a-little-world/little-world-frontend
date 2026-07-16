import type { NiceAvatarProps } from 'react-nice-avatar';

import type { BadgeDefinition } from '../../../helpers/matchOverviewBadges';
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

/** Temporary page payload until the match overview API exists. */
export function getMatchOverviewDummyData(
  partner: MatchOverviewProfile,
  self: MatchOverviewProfile,
): MatchOverviewPayload {
  return {
    week: 8,
    calls: 7,
    totalMinutes: 165,
    streakWeeks: 3,
    messages: 214,
    matchedAt: daysAgo(56),
    lastCallAt: daysAgo(3),
    partner,
    self,
    badges: [
      {
        id: 'first_call',
        nameKey: 'match_overview.badges.first_call.name',
        unlockHintKey: 'match_overview.badges.first_call.hint',
        icon: 'video',
        metric: 'calls',
        target: 1,
        earnedAt: daysAgo(40),
      },
      {
        id: 'five_calls',
        nameKey: 'match_overview.badges.five_calls.name',
        unlockHintKey: 'match_overview.badges.five_calls.hint',
        icon: 'heart',
        metric: 'calls',
        target: 5,
        earnedAt: daysAgo(20),
      },
      {
        id: 'ten_calls',
        nameKey: 'match_overview.badges.ten_calls.name',
        unlockHintKey: 'match_overview.badges.ten_calls.hint',
        icon: 'star',
        metric: 'calls',
        target: 10,
      },
      {
        id: 'twenty_calls',
        nameKey: 'match_overview.badges.twenty_calls.name',
        unlockHintKey: 'match_overview.badges.twenty_calls.hint',
        icon: 'star',
        metric: 'calls',
        target: 20,
      },
      {
        id: 'cycle_complete',
        nameKey: 'match_overview.badges.cycle_complete.name',
        unlockHintKey: 'match_overview.badges.cycle_complete.hint',
        icon: 'clock',
        metric: 'weeks',
        target: 10,
      },
      {
        id: 'hundred_messages',
        nameKey: 'match_overview.badges.hundred_messages.name',
        unlockHintKey: 'match_overview.badges.hundred_messages.hint',
        icon: 'message',
        metric: 'messages',
        target: 100,
        earnedAt: daysAgo(12),
      },
    ],
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
