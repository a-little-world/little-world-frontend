import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { MatchStateKind } from './deriveMatchState.ts';
import {
  progressCopyKeys,
  progressCtaTarget,
  progressLastCallUsesWeekday,
  progressShowsLastCall,
} from './deriveProgressCopy.ts';

const ALL_STATES: MatchStateKind[] = [
  'successful',
  'no_message',
  'no_call',
  'dormant',
  'streak_active',
  'engaged',
];

describe('progressCopyKeys', () => {
  it('answers every match state', () => {
    ALL_STATES.forEach(state => {
      const keys = progressCopyKeys(state);
      assert.ok(keys.headingKey, `${state} has no heading`);
      assert.ok(keys.bodyKey, `${state} has no body`);
    });
  });

  it('gives the completed cycle no call to action', () => {
    assert.equal(progressCopyKeys('successful').ctaKey, null);
    assert.equal(progressCtaTarget('successful'), null);
  });

  it('counts down remaining weeks while engaged', () => {
    assert.equal(
      progressCopyKeys('engaged').headingKey,
      'match_overview.weeks_remaining_heading',
    );
  });

  it('keeps one key namespace per state', () => {
    ALL_STATES.filter(state => state !== 'engaged').forEach(state => {
      assert.equal(
        progressCopyKeys(state).headingKey,
        `match_overview.progress.${state}.heading`,
      );
    });
  });
});

describe('progressCtaTarget', () => {
  it('sends a dormant match to support and everything else to the chat', () => {
    assert.equal(progressCtaTarget('dormant'), 'support');
    ALL_STATES.filter(
      state => state !== 'dormant' && state !== 'successful',
    ).forEach(state => {
      assert.equal(progressCtaTarget(state), 'chat', state);
    });
  });
});

describe('progressShowsLastCall', () => {
  // Shown once a call has actually happened — `dormant` included, where the point is that
  // calls started and then stopped. `no_message` and `no_call` have nothing to report, and
  // `successful` closes the cycle with its own copy.
  const SHOWS_LAST_CALL: MatchStateKind[] = [
    'engaged',
    'streak_active',
    'dormant',
  ];

  it('mentions the last call for exactly the states that have had one', () => {
    ALL_STATES.forEach(state => {
      assert.equal(
        progressShowsLastCall(state),
        SHOWS_LAST_CALL.includes(state),
        state,
      );
    });
  });

  it('never picks a weekday for a state that shows no last call', () => {
    ALL_STATES.filter(state => !progressShowsLastCall(state)).forEach(state => {
      assert.ok(!progressLastCallUsesWeekday(state), state);
    });
  });
});

describe('progressLastCallUsesWeekday', () => {
  it('names the weekday only while a streak is live', () => {
    assert.ok(progressLastCallUsesWeekday('streak_active'));
    assert.ok(!progressLastCallUsesWeekday('engaged'));
    assert.ok(!progressLastCallUsesWeekday('dormant'));
  });
});
