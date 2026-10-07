import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  calendarRecurrenceFor,
  formatBerlinIcsDateTime,
  formatUtcIcsDateTime,
  fromBerlinWallTime,
  seriesRecurrence,
} from './seriesCalendar.ts';

const berlin = (
  year: number,
  month: number,
  day: number,
  hour = 18,
  minute = 0,
) => fromBerlinWallTime({ year, month, day, hour, minute, second: 0 });

const session = (
  start: Date,
  frequency = 'weekly',
  recurrenceGroup: string | null = 'series',
) => ({
  start_time: start.toISOString(),
  end_time: new Date(start.getTime() + 2 * 60 * 60 * 1000).toISOString(),
  frequency,
  recurrence_group: recurrenceGroup,
});

describe('Berlin wall time', () => {
  it('converts across both DST changes', () => {
    assert.equal(
      berlin(2026, 10, 20).toISOString(),
      '2026-10-20T16:00:00.000Z',
    );
    assert.equal(
      berlin(2026, 10, 27).toISOString(),
      '2026-10-27T17:00:00.000Z',
    );
    assert.equal(
      formatBerlinIcsDateTime(berlin(2026, 10, 27)),
      '20261027T180000',
    );
    assert.equal(
      formatUtcIcsDateTime(berlin(2026, 10, 27)),
      '20261027T170000Z',
    );
  });
});

describe('seriesRecurrence', () => {
  it('ends at the last session and needs no exceptions for an intact weekly series', () => {
    const recurrence = seriesRecurrence([
      session(berlin(2026, 10, 13)),
      session(berlin(2026, 10, 20)),
      session(berlin(2026, 10, 27)),
      session(berlin(2026, 11, 3)),
    ]);

    assert.ok(recurrence);
    assert.equal(recurrence.until.getTime(), berlin(2026, 11, 3).getTime());
    assert.deepEqual(recurrence.exdates, []);
    assert.deepEqual(recurrence.rdates, []);
  });

  it('excludes a deleted session and adds a moved one', () => {
    const recurrence = seriesRecurrence([
      session(berlin(2026, 10, 13)),
      // 20 Oct deleted; 27 Oct moved to Wednesday 19:00.
      session(berlin(2026, 10, 28, 19)),
      session(berlin(2026, 11, 3)),
    ]);

    assert.ok(recurrence);
    assert.deepEqual(
      recurrence.exdates.map(date => date.getTime()),
      [berlin(2026, 10, 20).getTime(), berlin(2026, 10, 27).getTime()],
    );
    assert.deepEqual(
      recurrence.rdates.map(date => date.getTime()),
      [berlin(2026, 10, 28, 19).getTime()],
    );
  });

  it('follows a monthly series clamped to short months', () => {
    const recurrence = seriesRecurrence([
      session(berlin(2026, 10, 31), 'monthly'),
      session(berlin(2026, 11, 30), 'monthly'),
      session(berlin(2026, 12, 31), 'monthly'),
    ]);

    assert.ok(recurrence);
    assert.equal(recurrence.monthDay, 31);
    assert.deepEqual(recurrence.exdates, []);
    assert.deepEqual(recurrence.rdates, []);
  });

  it('is undefined for a single session or a one-off', () => {
    assert.equal(seriesRecurrence([session(berlin(2026, 10, 13))]), undefined);
    assert.equal(
      seriesRecurrence([
        session(berlin(2026, 10, 13), 'once', null),
        session(berlin(2026, 10, 20), 'once', null),
      ]),
      undefined,
    );
  });
});

describe('calendarRecurrenceFor', () => {
  it('covers the series from the given session on, and nothing else', () => {
    const sessions = [
      session(berlin(2026, 10, 13)),
      session(berlin(2026, 10, 20)),
      session(berlin(2026, 10, 27)),
      session(berlin(2026, 10, 14, 10), 'fortnightly', 'other'),
      session(berlin(2026, 10, 15, 10), 'once', null),
    ];

    const fromSecond = calendarRecurrenceFor(sessions[1], sessions);
    assert.equal(fromSecond.frequency, 'weekly');
    assert.equal(
      fromSecond.recurrence?.until.getTime(),
      berlin(2026, 10, 27).getTime(),
    );

    assert.deepEqual(calendarRecurrenceFor(sessions[2], sessions), {
      frequency: 'once',
    });
    assert.deepEqual(calendarRecurrenceFor(sessions[4], sessions), {
      frequency: 'once',
    });
  });
});
