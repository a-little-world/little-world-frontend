import { differenceInCalendarDays } from 'date-fns';

export const QUIET_AFTER_DAYS = 14;

export interface MatchTeaserInput {
  cycleComplete: boolean;
  isActive: boolean;
  messageCount: number;
  callCount: number;
  monthsTogether: number;
  weekStreak: number;
  lastActivityAt: Date | null;
}

export type MatchTeaserState =
  | { state: 'cycle_complete'; calls: number; months: number }
  | { state: 'no_message' }
  | { state: 'no_call'; messages: number }
  | { state: 'gone_quiet'; daysQuiet: number }
  | { state: 'active'; calls: number; weekStreak: number };

export function deriveMatchTeaserState(
  input: MatchTeaserInput,
  now: Date = new Date(),
): MatchTeaserState {
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
      state: 'cycle_complete',
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
    return { state: 'gone_quiet', daysQuiet: daysSinceActivity };
  }

  return { state: 'active', calls: callCount, weekStreak };
}
