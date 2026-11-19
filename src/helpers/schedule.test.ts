import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { nextSessionPerSeries } from './schedule.ts';

const session = (
  start: string,
  recurrenceGroup: string | null = null,
  frequency = 'once',
) => ({
  start_time: start,
  end_time: start,
  frequency,
  recurrence_group: recurrenceGroup,
});

describe('nextSessionPerSeries', () => {
  it('keeps only the next session of each recurring series', () => {
    const rows = nextSessionPerSeries([
      session('2026-10-20T15:00:00Z', 'weekly', 'weekly'),
      session('2026-10-13T15:00:00Z', 'weekly', 'weekly'),
      session('2026-10-27T15:00:00Z', 'weekly', 'weekly'),
    ]);

    assert.deepEqual(
      rows.map(row => row.start_time),
      ['2026-10-13T15:00:00Z'],
    );
  });

  it('keeps every one-off session and orders all rows by start', () => {
    const rows = nextSessionPerSeries([
      session('2026-10-30T15:00:00Z', 'fortnightly', 'fortnightly'),
      session('2026-10-14T09:00:00Z'),
      session('2026-10-09T09:00:00Z'),
      session('2026-11-13T15:00:00Z', 'fortnightly', 'fortnightly'),
    ]);

    assert.deepEqual(
      rows.map(row => row.start_time),
      ['2026-10-09T09:00:00Z', '2026-10-14T09:00:00Z', '2026-10-30T15:00:00Z'],
    );
  });

  it('treats each recurrence group as its own series', () => {
    const rows = nextSessionPerSeries([
      session('2026-10-13T15:00:00Z', 'a', 'weekly'),
      session('2026-10-20T15:00:00Z', 'a', 'weekly'),
      session('2026-10-15T18:00:00Z', 'b', 'monthly'),
      session('2026-11-15T18:00:00Z', 'b', 'monthly'),
    ]);

    assert.deepEqual(
      rows.map(row => row.recurrence_group),
      ['a', 'b'],
    );
  });
});
