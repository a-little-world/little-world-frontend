export const MATCH_CYCLE_WEEKS = 10;

export interface MatchOverviewStatsInput {
  /** Weeks containing at least one qualifying video call, from the API snapshot. */
  activeWeeks: number;
  calls: number;
  totalMinutes: number;
  streakWeeks: number;
  messages: number;
  cycleWeeks?: number;
}

export interface MatchOverviewDerived {
  isCycleComplete: boolean;
  ringValue: number;
  ringMax: number;
  weeksRemaining: number;
  avgMinutesPerCall: number | null;
  totalHours: number;
  totalMinutesRemainder: number;
  activeWeeks: number;
  calls: number;
  streakWeeks: number;
  messages: number;
}

/**
 * Derives display values for the Match Overview page.
 *
 * Progress is measured in *active* weeks — weeks the pair actually had a video call —
 * not in weeks elapsed on the calendar and not in consecutive weeks. A pair who skip a
 * week have banked one fewer week, nothing more; the cycle completes on the tenth week
 * they call, whenever that lands. The calendar week (`snapshot.current_week`) and the
 * streak both answer different questions and neither belongs in the ring.
 */
export function deriveMatchOverviewStats(
  input: MatchOverviewStatsInput,
): MatchOverviewDerived {
  const { activeWeeks, calls, totalMinutes, streakWeeks, messages } = input;
  const cycleWeeks = input.cycleWeeks ?? MATCH_CYCLE_WEEKS;
  const bankedWeeks = Math.min(Math.max(activeWeeks, 0), cycleWeeks);
  const isCycleComplete = bankedWeeks >= cycleWeeks;

  const avgMinutesPerCall = calls > 0 ? Math.round(totalMinutes / calls) : null;

  const roundedMinutes = Math.round(totalMinutes);
  const totalHours = Math.floor(roundedMinutes / 60);
  const totalMinutesRemainder = roundedMinutes % 60;

  return {
    isCycleComplete,
    ringValue: bankedWeeks,
    ringMax: cycleWeeks,
    weeksRemaining: cycleWeeks - bankedWeeks,
    avgMinutesPerCall,
    totalHours,
    totalMinutesRemainder,
    activeWeeks,
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
