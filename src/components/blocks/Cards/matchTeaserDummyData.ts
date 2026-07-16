import type { MatchTeaserInput } from '../../../helpers/deriveMatchTeaserState';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/** Temporary fixtures to preview each teaser state on the home match cards. */
export const MATCH_TEASER_DUMMY_SCENARIOS: MatchTeaserInput[] = [
  {
    cycleComplete: true,
    isActive: true,
    messageCount: 18,
    callCount: 6,
    monthsTogether: 4,
    weekStreak: 5,
    lastActivityAt: daysAgo(1),
  },
  {
    cycleComplete: false,
    isActive: true,
    messageCount: 0,
    callCount: 0,
    monthsTogether: 0,
    weekStreak: 0,
    lastActivityAt: null,
  },
  {
    cycleComplete: false,
    isActive: true,
    messageCount: 7,
    callCount: 0,
    monthsTogether: 1,
    weekStreak: 0,
    lastActivityAt: daysAgo(2),
  },
  {
    cycleComplete: false,
    isActive: true,
    messageCount: 12,
    callCount: 3,
    monthsTogether: 2,
    weekStreak: 1,
    lastActivityAt: daysAgo(14),
  },
  {
    cycleComplete: false,
    isActive: true,
    messageCount: 24,
    callCount: 5,
    monthsTogether: 3,
    weekStreak: 4,
    lastActivityAt: daysAgo(3),
  },
];

export const getMatchTeaserDummyInput = (index: number): MatchTeaserInput =>
  MATCH_TEASER_DUMMY_SCENARIOS[index % MATCH_TEASER_DUMMY_SCENARIOS.length];

const hashUserId = (userId: string): number =>
  [...userId].reduce((sum, char) => sum + char.charCodeAt(0), 0);

export const getMatchOverviewDummyInput = (userId: string): MatchTeaserInput =>
  MATCH_TEASER_DUMMY_SCENARIOS[
    hashUserId(userId) % MATCH_TEASER_DUMMY_SCENARIOS.length
  ];
