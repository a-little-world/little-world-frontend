import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  activeWeekNumbers,
  deriveMatchState,
  QUIET_AFTER_DAYS,
  STREAK_MIN_WEEKS,
  toleratedWeekStreak,
  type MatchStateInput,
} from './deriveMatchState.ts';

const now = new Date('2026-07-01T12:00:00.000Z');
const createdAt = new Date('2026-06-01T10:00:00.000Z');

const base: MatchStateInput = {
  cycleComplete: false,
  isActive: true,
  messageCount: 20,
  callCount: 4,
  monthsTogether: 1,
  weekStreak: 0,
  lastActivityAt: new Date('2026-06-30T18:00:00.000Z'),
};

describe('toleratedWeekStreak', () => {
  it('is the run length when every recent week has a call', () => {
    // Weeks 3, 4 and 5 active, currently in week 5.
    assert.equal(toleratedWeekStreak([3, 4, 5], 5), 3);
  });

  it('forgives one missed week inside the run', () => {
    // Week 4 empty, so a strict count would say 1. Three of the last four weeks called.
    assert.equal(toleratedWeekStreak([3, 5, 6], 6), 3);
  });

  it('survives an empty current week, which is still in progress', () => {
    assert.equal(toleratedWeekStreak([3, 4, 5], 6), 3);
  });

  it('is 0 when the only call has fallen outside every window', () => {
    // Week 3 called, weeks 4-6 empty: not even one of the last two weeks had a call.
    assert.equal(toleratedWeekStreak([3], 6), 0);
  });

  it('counts a single call this week as a run of one', () => {
    assert.equal(toleratedWeekStreak([6], 6), 1);
  });

  it('is 0 with no calls at all', () => {
    assert.equal(toleratedWeekStreak([], 4), 0);
  });

  it('counts a week once however many calls it held', () => {
    assert.deepEqual(
      activeWeekNumbers(createdAt, [
        new Date('2026-06-02T10:00:00.000Z'),
        new Date('2026-06-03T10:00:00.000Z'),
        new Date('2026-06-10T10:00:00.000Z'),
      ]),
      [1, 2],
    );
  });
});

describe('deriveMatchState', () => {
  it('is successful when the cycle is complete', () => {
    assert.deepEqual(
      deriveMatchState(
        { ...base, cycleComplete: true, callCount: 12, monthsTogether: 3 },
        now,
      ),
      { state: 'successful', calls: 12, months: 3 },
    );
  });

  it('is no_message before anything is said', () => {
    assert.deepEqual(
      deriveMatchState({ ...base, messageCount: 0, callCount: 0 }, now),
      { state: 'no_message' },
    );
  });

  it('is no_call once they are talking but have not called', () => {
    assert.deepEqual(
      deriveMatchState({ ...base, callCount: 0, messageCount: 12 }, now),
      { state: 'no_call', messages: 12 },
    );
  });

  it('is dormant after the quiet threshold, whatever the streak was', () => {
    const state = deriveMatchState(
      {
        ...base,
        weekStreak: 5,
        lastActivityAt: new Date(
          now.getTime() - QUIET_AFTER_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
      now,
    );

    assert.equal(state.state, 'dormant');
  });

  it('is streak_active once the run is worth naming', () => {
    assert.deepEqual(
      deriveMatchState({ ...base, weekStreak: STREAK_MIN_WEEKS }, now),
      { state: 'streak_active', calls: 4, weekStreak: STREAK_MIN_WEEKS },
    );
  });

  it('is engaged when calls are happening but there is no run yet', () => {
    assert.deepEqual(deriveMatchState({ ...base, weekStreak: 1 }, now), {
      state: 'engaged',
      calls: 4,
      weekStreak: 1,
    });
  });

  it('treats a completed cycle on an inactive match as its underlying state', () => {
    const state = deriveMatchState(
      { ...base, cycleComplete: true, isActive: false, weekStreak: 3 },
      now,
    );

    assert.equal(state.state, 'streak_active');
  });
});
