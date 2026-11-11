import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { NUDGE_KEYS, resolveNudge } from './matchNudges.ts';

const readLocale = (lang: string): Record<string, string> =>
  JSON.parse(
    readFileSync(new URL(`../locale/${lang}.json`, import.meta.url), 'utf8'),
  );

/** Every key `management/match_nudges.py` can send. Keep in step with it. */
const BACKEND_KEYS = [
  'goal',
  'schedule',
  'short_call',
  ...Array.from({ length: 10 }, (_, i) => `band_${i + 1}`),
  'beyond_goal',
  'stale',
  'recent_hour',
  'recent_long',
];

describe('resolveNudge', () => {
  it('maps every backend key to its own copy', () => {
    assert.deepEqual([...NUDGE_KEYS].sort(), [...BACKEND_KEYS].sort());
    BACKEND_KEYS.forEach(key => {
      assert.equal(resolveNudge(key).textKey, `profile_card.nudge.${key}`);
    });
  });

  it('gives each line its tone and icon', () => {
    assert.deepEqual(resolveNudge('stale'), {
      tone: 'motivational',
      icon: 'calendar',
      textKey: 'profile_card.nudge.stale',
    });
    assert.deepEqual(resolveNudge('band_10'), {
      tone: 'success',
      icon: 'heart',
      textKey: 'profile_card.nudge.band_10',
    });
    assert.equal(resolveNudge('goal').tone, 'informational');
  });

  it('falls back to the goal line for a missing or unknown key', () => {
    const goal = resolveNudge('goal');
    assert.deepEqual(resolveNudge(undefined), goal);
    assert.deepEqual(resolveNudge(null), goal);
    assert.deepEqual(resolveNudge(''), goal);
    assert.deepEqual(resolveNudge('band_99'), goal);
    assert.deepEqual(resolveNudge('toString'), goal);
  });

  ['de', 'en'].forEach(lang => {
    it(`has one complete ${lang} sentence per nudge`, () => {
      const locale = readLocale(lang);
      NUDGE_KEYS.forEach(key => {
        const text = locale[`profile_card.nudge.${key}`];
        assert.ok(text, `${lang}: profile_card.nudge.${key} is missing`);
        assert.match(text, /[.!?]$/, `${lang}: ${key} has no end punctuation`);
        assert.doesNotMatch(text, /\{\{name\}\}/);
      });
      assert.match(locale['profile_card.nudge.band_1'], /\{\{minutes\}\}/);
    });
  });
});
