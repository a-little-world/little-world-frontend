import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  deriveMatchOverviewStats,
  formatTotalHoursDisplay,
  MATCH_CYCLE_WEEKS,
} from './matchOverviewDerived.ts';

const base = {
  calls: 7,
  totalMinutes: 165,
  streakWeeks: 3,
  messages: 214,
};

describe('deriveMatchOverviewStats', () => {
  it('treats week 10 as last cycle week (not free-play)', () => {
    const derived = deriveMatchOverviewStats({ ...base, week: 10 });

    assert.equal(derived.isFreePlay, false);
    assert.equal(derived.ringValue, 10);
    assert.equal(derived.ringMax, MATCH_CYCLE_WEEKS);
    assert.equal(derived.weeksRemaining, 0);
  });

  it('treats week 11 as free-play with a full ring', () => {
    const derived = deriveMatchOverviewStats({ ...base, week: 11 });

    assert.equal(derived.isFreePlay, true);
    assert.equal(derived.ringValue, MATCH_CYCLE_WEEKS);
    assert.equal(derived.weeksRemaining, 0);
  });

  it('computes weeks remaining before week 10', () => {
    const derived = deriveMatchOverviewStats({ ...base, week: 8 });

    assert.equal(derived.isFreePlay, false);
    assert.equal(derived.ringValue, 8);
    assert.equal(derived.weeksRemaining, 2);
  });

  it('hides avg minutes when calls is 0 (no NaN)', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      week: 1,
      calls: 0,
      totalMinutes: 0,
    });

    assert.equal(derived.avgMinutesPerCall, null);
    assert.equal(Number.isNaN(derived.avgMinutesPerCall as number), false);
  });

  it('rounds average minutes per call', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      week: 5,
      calls: 7,
      totalMinutes: 165,
    });

    assert.equal(derived.avgMinutesPerCall, 24);
    assert.equal(derived.totalHours, 2);
    assert.equal(derived.totalMinutesRemainder, 45);
  });
});

describe('formatTotalHoursDisplay', () => {
  it('zero-pads minutes', () => {
    assert.equal(formatTotalHoursDisplay(2, 5), '2:05');
    assert.equal(formatTotalHoursDisplay(2, 45), '2:45');
  });
});
