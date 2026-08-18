import { differenceInCalendarDays } from 'date-fns';

import { weekNumber } from './matchWeek.ts';

/** Days without a call before a match reads as dormant. */
export const QUIET_AFTER_DAYS = 14;

/** Below this a run of weeks is not yet worth calling a streak. */
export const STREAK_MIN_WEEKS = 2;

export interface MatchStateInput {
  cycleComplete: boolean;
  isActive: boolean;
  messageCount: number;
  callCount: number;
  monthsTogether: number;
  weekStreak: number;
  lastActivityAt: Date | null;
}

/**
 * What a match is doing right now. One vocabulary, two presentations: the teaser on the
 * partner card and the progress hero on the Match Overview page both read from this, so
 * the two cannot describe the same match differently.
 */
export type MatchState =
  | { state: 'successful'; calls: number; months: number }
  | { state: 'no_message' }
  | { state: 'no_call'; messages: number }
  | { state: 'dormant'; daysQuiet: number }
  | { state: 'streak_active'; calls: number; weekStreak: number }
  | { state: 'engaged'; calls: number; weekStreak: number };

export type MatchStateKind = MatchState['state'];

/**
 * The longest run worth calling a streak: the largest `x` where `x` of the last `x + 1`
 * weeks had a call.
 *
 * Deliberately not a strict consecutive count. One missed week in a good run is a missed
 * week, not a reset — a pair who called four weeks out of five are on a four-week roll,
 * and telling them they are back to zero is both untrue and discouraging. The window
 * includes the current week, which may still be empty; that costs nothing yet, for the
 * same reason `streak_stats` on the server does not break a run on a week in progress.
 */
export function toleratedWeekStreak(
  weeksWithCalls: number[],
  currentWeek: number,
): number {
  const active = new Set(weeksWithCalls);
  let best = 0;

  for (let x = 1; x <= currentWeek; x += 1) {
    const windowStart = currentWeek - x;
    let hits = 0;
    for (let week = windowStart; week <= currentWeek; week += 1) {
      if (active.has(week)) hits += 1;
    }
    if (hits >= x) best = x;
  }

  return best;
}

/** Week numbers holding at least one call, from call start timestamps. */
export function activeWeekNumbers(
  createdAt: Date,
  callStartedAt: Date[],
): number[] {
  return Array.from(
    new Set(callStartedAt.map(startedAt => weekNumber(createdAt, startedAt))),
  );
}

export function deriveMatchState(
  input: MatchStateInput,
  now: Date = new Date(),
): MatchState {
  const {
    cycleComplete,
    isActive,
    messageCount,
    callCount,
    monthsTogether,
    weekStreak,
    lastActivityAt,
  } = input;

  if (cycleComplete && isActive) {
    return {
      state: 'successful',
      calls: callCount,
      months: monthsTogether,
    };
  }

  if (messageCount === 0) {
    return { state: 'no_message' };
  }

  if (callCount === 0) {
    return { state: 'no_call', messages: messageCount };
  }

  const daysSinceActivity = lastActivityAt
    ? differenceInCalendarDays(now, lastActivityAt)
    : null;

  if (daysSinceActivity !== null && daysSinceActivity >= QUIET_AFTER_DAYS) {
    return { state: 'dormant', daysQuiet: daysSinceActivity };
  }

  // Checked after dormant on purpose: a run that stopped a fortnight ago is not burning,
  // whatever its length, and offering to help beats congratulating them on it.
  if (weekStreak >= STREAK_MIN_WEEKS) {
    return { state: 'streak_active', calls: callCount, weekStreak };
  }

  return { state: 'engaged', calls: callCount, weekStreak };
}
