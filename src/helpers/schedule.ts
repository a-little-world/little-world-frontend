export type ScheduleSession = {
  start_time: string;
  end_time: string;
  frequency?: string;
  /** Sessions sharing a group are one recurring series. */
  recurrence_group?: string | null;
};

/**
 * One row per series: a recurring series is shown by its next session only, instead of
 * listing every session to the end of the year. Sessions without a group stay as they are.
 */
export function nextSessionPerSeries<T extends ScheduleSession>(
  sessions: T[],
): T[] {
  const seen = new Set<string>();
  return [...sessions]
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    )
    .filter(session => {
      if (!session.recurrence_group) return true;
      if (seen.has(session.recurrence_group)) return false;
      seen.add(session.recurrence_group);
      return true;
    });
}
