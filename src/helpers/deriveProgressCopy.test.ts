import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { MatchStateKind } from './deriveMatchState.ts';
import {
  progressCopyKeys,
  progressCtaTarget,
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
  it('only mentions the last call once calls are happening', () => {
    assert.ok(progressShowsLastCall('engaged'));
    assert.ok(progressShowsLastCall('streak_active'));
    assert.ok(!progressShowsLastCall('no_call'));
    assert.ok(!progressShowsLastCall('dormant'));
  });
});
