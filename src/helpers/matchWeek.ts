const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * 1-indexed week since the match was created — the same clock the server uses in
 * `management/analytics/match_journey/queries/activity.py`.
 *
 * The one copy on the client. It lived in three files (streak, progress copy, badges),
 * each carrying a comment that the other two existed; a change to how a week is counted
 * had to be made four times to stay true, which is how a rule quietly stops being one.
 * Where the payload already answers the question — `snapshot.current_week` — prefer it,
 * since that one is computed against the server clock rather than the browser's.
 */
export function weekNumber(createdAt: Date, asOf: Date): number {
  const days = Math.floor((asOf.getTime() - createdAt.getTime()) / MS_PER_DAY);
  return Math.max(Math.floor(days / 7) + 1, 1);
}
