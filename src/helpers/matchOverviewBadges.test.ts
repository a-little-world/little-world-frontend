import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  getNextInProgressBadge,
  resolveBadgeStates,
  type BadgeDefinition,
} from './matchOverviewBadges.ts';

const badges: BadgeDefinition[] = [
  {
    id: 'first_call',
    nameKey: 'match_overview.badges.first_call.name',
    unlockHintKey: 'match_overview.badges.first_call.hint',
    icon: 'video',
    metric: 'calls',
    target: 1,
    earnedAt: '2026-05-01T12:00:00.000Z',
  },
  {
    id: 'ten_calls',
    nameKey: 'match_overview.badges.ten_calls.name',
    unlockHintKey: 'match_overview.badges.ten_calls.hint',
    icon: 'star',
    metric: 'calls',
    target: 10,
  },
  {
    id: 'twenty_calls',
    nameKey: 'match_overview.badges.twenty_calls.name',
    unlockHintKey: 'match_overview.badges.twenty_calls.hint',
    icon: 'heart',
    metric: 'calls',
    target: 20,
  },
  {
    id: 'hundred_messages',
    nameKey: 'match_overview.badges.hundred_messages.name',
    unlockHintKey: 'match_overview.badges.hundred_messages.hint',
    icon: 'message',
    metric: 'messages',
    target: 100,
  },
];

describe('resolveBadgeStates', () => {
  it('marks earned badges and picks nearest unfinished as in_progress', () => {
    const resolved = resolveBadgeStates(badges, {
      calls: 7,
      week: 8,
      messages: 214,
    });

    assert.deepEqual(
      resolved.map(badge => badge.status),
      ['earned', 'earned', 'in_progress', 'locked'],
    );
    assert.equal(resolved[0].id, 'first_call');
    assert.equal(resolved[1].id, 'hundred_messages');
    assert.equal(resolved[2].id, 'ten_calls');
    assert.equal(resolved[2].current, 7);
    assert.equal(resolved[2].remaining, 3);
    assert.equal(resolved[3].id, 'twenty_calls');
  });

  it('orders badges earned → in_progress → locked', () => {
    const resolved = resolveBadgeStates(badges, {
      calls: 7,
      week: 8,
      messages: 50,
    });

    assert.deepEqual(
      resolved.map(badge => badge.status),
      ['earned', 'in_progress', 'locked', 'locked'],
    );
  });

  it('auto-earns when current meets target without earnedAt', () => {
    const resolved = resolveBadgeStates(
      [
        {
          id: 'ten_calls',
          nameKey: 'n',
          unlockHintKey: 'h',
          icon: 'star',
          metric: 'calls',
          target: 10,
        },
      ],
      { calls: 10, week: 5, messages: 0 },
    );

    assert.equal(resolved[0].status, 'earned');
    assert.equal(resolved[0].progress, 1);
  });

  it('locks all unfinished when none started (calls 0 → first is in_progress)', () => {
    const resolved = resolveBadgeStates(
      badges.filter(b => !b.earnedAt),
      { calls: 0, week: 1, messages: 0 },
    );

    assert.equal(resolved[0].status, 'in_progress');
    assert.equal(resolved[0].id, 'ten_calls');
    assert.ok(resolved.slice(1).every(b => b.status === 'locked'));
  });
});

describe('getNextInProgressBadge', () => {
  it('returns the in-progress badge or null', () => {
    const resolved = resolveBadgeStates(badges, {
      calls: 7,
      week: 8,
      messages: 50,
    });

    const next = getNextInProgressBadge(resolved);
    assert.ok(next);
    assert.equal(next?.id, 'ten_calls');
    assert.equal(getNextInProgressBadge([]), null);
  });
});
