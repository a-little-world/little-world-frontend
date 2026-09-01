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
  it('fills the ring on the tenth active week', () => {
    const derived = deriveMatchOverviewStats({ ...base, activeWeeks: 10 });

    assert.equal(derived.isCycleComplete, true);
    assert.equal(derived.ringValue, 10);
    assert.equal(derived.ringMax, MATCH_CYCLE_WEEKS);
    assert.equal(derived.weeksRemaining, 0);
  });

  it('counts active weeks, so idle calendar weeks cost nothing but progress', () => {
    const derived = deriveMatchOverviewStats({ ...base, activeWeeks: 8 });

    assert.equal(derived.isCycleComplete, false);
    assert.equal(derived.ringValue, 8);
    assert.equal(derived.weeksRemaining, 2);
  });

  it('caps the ring once the cycle is over-completed', () => {
    const derived = deriveMatchOverviewStats({ ...base, activeWeeks: 14 });

    assert.equal(derived.isCycleComplete, true);
    assert.equal(derived.ringValue, MATCH_CYCLE_WEEKS);
    assert.equal(derived.weeksRemaining, 0);
  });

  it('starts empty when no week has had a call', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      activeWeeks: 0,
      calls: 0,
      totalMinutes: 0,
    });

    assert.equal(derived.ringValue, 0);
    assert.equal(derived.weeksRemaining, MATCH_CYCLE_WEEKS);
    assert.equal(derived.isCycleComplete, false);
  });

  it('hides avg minutes when calls is 0 (no NaN)', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      activeWeeks: 1,
      calls: 0,
      totalMinutes: 0,
    });

    assert.equal(derived.avgMinutesPerCall, null);
    assert.equal(Number.isNaN(derived.avgMinutesPerCall as number), false);
  });

  it('rounds average minutes per call', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      activeWeeks: 5,
      calls: 7,
      totalMinutes: 165,
    });

    assert.equal(derived.avgMinutesPerCall, 24);
    assert.equal(derived.totalHours, 2);
    assert.equal(derived.totalMinutesRemainder, 45);
  });

  it('uses cycleWeeks from the snapshot when provided', () => {
    const derived = deriveMatchOverviewStats({
      ...base,
      activeWeeks: 8,
      cycleWeeks: 12,
    });

    assert.equal(derived.isCycleComplete, false);
    assert.equal(derived.ringMax, 12);
    assert.equal(derived.weeksRemaining, 4);
  });
});

describe('formatTotalHoursDisplay', () => {
  it('zero-pads minutes', () => {
    assert.equal(formatTotalHoursDisplay(2, 5), '2:05');
    assert.equal(formatTotalHoursDisplay(2, 45), '2:45');
  });
});
