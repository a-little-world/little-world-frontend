export const MATCH_CYCLE_WEEKS = 10;

export interface MatchOverviewStatsInput {
  week: number;
  calls: number;
  totalMinutes: number;
  streakWeeks: number;
  messages: number;
}

export interface MatchOverviewDerived {
  isFreePlay: boolean;
  ringValue: number;
  ringMax: number;
  weeksRemaining: number;
  avgMinutesPerCall: number | null;
  totalHours: number;
  totalMinutesRemainder: number;
  calls: number;
  streakWeeks: number;
  messages: number;
}

/**
 * Derives display values for the Match Overview page.
 * Week 10 is the last cycle week (ring full). Week > 10 is free-play.
 */
export function deriveMatchOverviewStats(
  input: MatchOverviewStatsInput,
): MatchOverviewDerived {
  const { week, calls, totalMinutes, streakWeeks, messages } = input;
  const isFreePlay = week > MATCH_CYCLE_WEEKS;
  const weeksRemaining = isFreePlay
    ? 0
    : Math.max(0, MATCH_CYCLE_WEEKS - week);
  const ringValue = isFreePlay
    ? MATCH_CYCLE_WEEKS
    : Math.min(Math.max(week, 0), MATCH_CYCLE_WEEKS);

  const avgMinutesPerCall =
    calls > 0 ? Math.round(totalMinutes / calls) : null;

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMinutesRemainder = totalMinutes % 60;

  return {
    isFreePlay,
    ringValue,
    ringMax: MATCH_CYCLE_WEEKS,
    weeksRemaining,
    avgMinutesPerCall,
    totalHours,
    totalMinutesRemainder,
    calls,
    streakWeeks,
    messages,
  };
}

export function formatTotalHoursDisplay(
  hours: number,
  minutes: number,
): string {
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}
