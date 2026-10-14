import type { ScheduleSession } from './schedule';

/**
 * Calendar recurrence for a series of scheduled sessions.
 *
 * The backend creates one session per occurrence on Berlin wall-clock time (a weekly 18:00
 * stays at 18:00 across DST) up to 31 December, and admins can delete or move single
 * sessions. A calendar entry has to reproduce exactly that: an RRULE with UNTIL, plus
 * EXDATEs for occurrences that were removed and RDATEs for sessions that were moved.
 */

export const CALENDAR_TIME_ZONE = 'Europe/Berlin';

const MAX_OCCURRENCES = 400;

type WallTime = {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type SeriesRecurrence = {
  /** Start of the series' last session; the RRULE's UNTIL. */
  until: Date;
  /** Day of the month a monthly series falls on, before clamping to short months. */
  monthDay: number;
  /** Occurrences the rule would produce that the series no longer has. */
  exdates: Date[];
  /** Sessions of the series that the rule does not produce. */
  rdates: Date[];
};

const wallTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: CALENDAR_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export function toBerlinWallTime(date: Date): WallTime {
  const parts = Object.fromEntries(
    wallTimeFormatter
      .formatToParts(date)
      .map(part => [part.type, Number(part.value)]),
  );
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

const wallTimeAsUtc = (wall: WallTime) =>
  Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );

/** Berlin's UTC offset at ``date``, in milliseconds. */
const berlinOffset = (date: Date) =>
  wallTimeAsUtc(toBerlinWallTime(date)) -
  Math.floor(date.getTime() / 1000) * 1000;

export function fromBerlinWallTime(wall: WallTime): Date {
  const asUtc = wallTimeAsUtc(wall);
  // Two passes settle on the offset in force at the result, across a DST change.
  const firstGuess = asUtc - berlinOffset(new Date(asUtc));
  return new Date(asUtc - berlinOffset(new Date(firstGuess)));
}

const pad = (value: number) => String(value).padStart(2, '0');

/** Local Berlin time for ``DTSTART;TZID=Europe/Berlin:`` and friends. */
export function formatBerlinIcsDateTime(date: Date): string {
  const wall = toBerlinWallTime(date);
  return `${wall.year}${pad(wall.month)}${pad(wall.day)}T${pad(wall.hour)}${pad(
    wall.minute,
  )}${pad(wall.second)}`;
}

/** UTC time, which RRULE UNTIL requires when DTSTART carries a TZID. */
export function formatUtcIcsDateTime(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

const daysInMonth = (year: number, month: number) =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/** Occurrences a rule anchored at ``anchor`` produces up to ``until``, as the backend generates them. */
function ruleStarts(
  anchor: Date,
  frequency: string,
  monthDay: number,
  until: Date,
): Date[] {
  const wall = toBerlinWallTime(anchor);
  const starts: Date[] = [];
  for (let occurrence = 0; occurrence < MAX_OCCURRENCES; occurrence += 1) {
    let next: WallTime;
    if (frequency === 'monthly') {
      const monthIndex = wall.month - 1 + occurrence;
      const year = wall.year + Math.floor(monthIndex / 12);
      const month = (monthIndex % 12) + 1;
      next = {
        ...wall,
        year,
        month,
        day: Math.min(monthDay, daysInMonth(year, month)),
      };
    } else {
      const step = frequency === 'fortnightly' ? 14 : 7;
      const day = new Date(
        Date.UTC(wall.year, wall.month - 1, wall.day + step * occurrence),
      );
      next = {
        ...wall,
        year: day.getUTCFullYear(),
        month: day.getUTCMonth() + 1,
        day: day.getUTCDate(),
      };
    }
    const start = occurrence === 0 ? anchor : fromBerlinWallTime(next);
    if (start.getTime() > until.getTime()) break;
    starts.push(start);
  }
  return starts;
}

/** Recurrence for the sessions of one series, or undefined when it is a single session. */
export function seriesRecurrence(
  series: ScheduleSession[],
): SeriesRecurrence | undefined {
  const frequency = series[0]?.frequency;
  if (!frequency || frequency === 'once' || series.length < 2) {
    return undefined;
  }

  const starts = series
    .map(session => new Date(session.start_time))
    .sort((a, b) => a.getTime() - b.getTime());
  const anchor = starts[0];
  const until = starts[starts.length - 1];
  // A series started on the 31st is clamped to the 30th or 28th in short months, so the
  // highest day seen is the one it was scheduled on.
  const monthDay = Math.max(
    ...starts.map(start => toBerlinWallTime(start).day),
  );

  const expected = ruleStarts(anchor, frequency, monthDay, until);
  const actualTimes = new Set(starts.map(start => start.getTime()));
  const expectedTimes = new Set(expected.map(start => start.getTime()));

  return {
    until,
    monthDay,
    exdates: expected.filter(start => !actualTimes.has(start.getTime())),
    rdates: starts.filter(start => !expectedTimes.has(start.getTime())),
  };
}

/**
 * What to put in the calendar for ``session``: its whole series from this session on, or
 * just the session when it does not repeat.
 */
export function calendarRecurrenceFor(
  session: ScheduleSession,
  sessions: ScheduleSession[],
): { frequency: string; recurrence?: SeriesRecurrence } {
  if (!session.recurrence_group || !session.frequency) {
    return { frequency: 'once' };
  }
  const sessionStart = new Date(session.start_time).getTime();
  const recurrence = seriesRecurrence(
    sessions.filter(
      other =>
        other.recurrence_group === session.recurrence_group &&
        new Date(other.start_time).getTime() >= sessionStart,
    ),
  );
  return recurrence
    ? { frequency: session.frequency, recurrence }
    : { frequency: 'once' };
}
