import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  BADGE_CATEGORY_ORDER,
  badgeProgressCopyValues,
  getNextInProgressBadge,
  inferBadgeEarnedAt,
  MATCH_OVERVIEW_BADGE_DEFINITIONS,
  orderAllBadges,
  orderBadgesForStrip,
  resolveBadgeStates,
  resolveOverviewBadges,
  visibleOverviewBadges,
  type BadgeStats,
} from './matchOverviewBadges.ts';

const stats: BadgeStats = {
  calls: 7,
  messages: 214,
  callMinutes: 165,
  activeWeeks: 8,
};

describe('MATCH_OVERVIEW_BADGE_DEFINITIONS', () => {
  it('locks the eight conditions', () => {
    assert.deepEqual(
      MATCH_OVERVIEW_BADGE_DEFINITIONS.map(badge => [
        badge.id,
        badge.metric,
        badge.target,
      ]),
      [
        ['first_call', 'calls', 1],
        ['fifty_messages', 'messages', 50],
        ['hundred_messages', 'messages', 100],
        ['two_hours', 'call_hours', 2],
        ['four_hours', 'call_hours', 4],
        ['ten_hours', 'call_hours', 10],
        ['five_active_weeks', 'active_weeks', 5],
        ['ten_active_weeks', 'active_weeks', 10],
      ],
    );
  });
});

describe('resolveBadgeStates', () => {
  it('earns against each metric independently', () => {
    const resolved = resolveBadgeStates(
      MATCH_OVERVIEW_BADGE_DEFINITIONS,
      stats,
    );
    const byId = Object.fromEntries(resolved.map(badge => [badge.id, badge]));

    assert.equal(byId.first_call.status, 'earned');
    assert.equal(byId.fifty_messages.status, 'earned');
    assert.equal(byId.hundred_messages.status, 'earned');
    assert.equal(byId.two_hours.status, 'earned');
    assert.equal(byId.four_hours.status, 'in_progress');
    assert.equal(byId.ten_hours.status, 'locked');
    assert.equal(byId.five_active_weeks.status, 'earned');
    assert.equal(byId.ten_active_weeks.status, 'in_progress');
  });

  it('earns two hours at 120 minutes, not before', () => {
    const under = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 1,
      messages: 0,
      callMinutes: 119,
      activeWeeks: 1,
    });
    const on = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 1,
      messages: 0,
      callMinutes: 120,
      activeWeeks: 1,
    });

    assert.equal(
      under.find(badge => badge.id === 'two_hours')?.status,
      'in_progress',
    );
    assert.equal(on.find(badge => badge.id === 'two_hours')?.status, 'earned');
  });

  it('uses active weeks, not elapsed calendar weeks', () => {
    const resolved = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 1,
      messages: 0,
      callMinutes: 30,
      activeWeeks: 5,
    });

    assert.equal(
      resolved.find(badge => badge.id === 'five_active_weeks')?.status,
      'earned',
    );
    assert.equal(
      resolved.find(badge => badge.id === 'ten_active_weeks')?.status,
      'in_progress',
    );
  });

  it('picks the unfinished badge closest to its target as in_progress', () => {
    const resolved = resolveBadgeStates(
      MATCH_OVERVIEW_BADGE_DEFINITIONS,
      stats,
    );
    const next = getNextInProgressBadge(resolved);

    // 8/10 active weeks (0.8) is closer than 165 min toward 4 h (0.69).
    assert.equal(next?.id, 'ten_active_weeks');
    assert.equal(next?.status, 'in_progress');
  });

  it('keeps first_call first and in_progress even when another ladder is further along', () => {
    const resolved = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 0,
      messages: 40,
      callMinutes: 0,
      activeWeeks: 0,
    });

    assert.equal(resolved[0].id, 'first_call');
    assert.equal(resolved[0].status, 'in_progress');
    assert.equal(
      resolved.find(badge => badge.id === 'fifty_messages')?.status,
      'in_progress',
    );
    assert.equal(getNextInProgressBadge(resolved)?.id, 'first_call');
    assert.equal(orderBadgesForStrip(resolved)[0].id, 'first_call');
  });

  it('auto-earns when current meets target without earnedAt', () => {
    const resolved = resolveBadgeStates(
      [
        {
          id: 'hundred_messages',
          nameKey: 'n',
          unlockHintKey: 'h',
          icon: 'message',
          metric: 'messages',
          target: 100,
        },
      ],
      { calls: 0, messages: 100, callMinutes: 0, activeWeeks: 0 },
    );

    assert.equal(resolved[0].status, 'earned');
    assert.equal(resolved[0].progress, 1);
    assert.equal(
      resolved[0].status === 'earned' ? resolved[0].earnedAt : undefined,
      null,
    );
  });

  it('marks the first unfinished badge in_progress when none have progress', () => {
    const resolved = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 0,
      messages: 0,
      callMinutes: 0,
      activeWeeks: 0,
    });

    assert.equal(resolved[0].status, 'in_progress');
    assert.equal(resolved[0].id, 'first_call');
    assert.ok(resolved.slice(1).every(badge => badge.status === 'locked'));
  });
});

describe('getNextInProgressBadge', () => {
  it('returns the in-progress badge or null', () => {
    const resolved = resolveBadgeStates(
      MATCH_OVERVIEW_BADGE_DEFINITIONS,
      stats,
    );
    const next = getNextInProgressBadge(resolved);
    assert.ok(next);
    assert.equal(next?.id, 'ten_active_weeks');
    assert.equal(getNextInProgressBadge([]), null);
  });
});

describe('badge ordering', () => {
  const everyStatus = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
    calls: 1, // first_call earned
    messages: 60, // fifty earned, hundred in progress
    callMinutes: 150, // two hours earned, four in progress
    activeWeeks: 2, // five_active_weeks in progress
  });

  it('leads with the first-call category and trails with messages', () => {
    assert.equal(BADGE_CATEGORY_ORDER[0], 'calls');
    assert.equal(
      BADGE_CATEGORY_ORDER[BADGE_CATEGORY_ORDER.length - 1],
      'messages',
    );
    assert.deepEqual(BADGE_CATEGORY_ORDER, [
      'calls',
      'call_hours',
      'active_weeks',
      'messages',
    ]);
  });

  it('keeps the first-call category ahead of messages once both are earned', () => {
    const strip = orderBadgesForStrip(everyStatus).map(badge => badge.id);

    assert.equal(strip[0], 'first_call');
    assert.ok(strip.indexOf('four_hours') < strip.indexOf('hundred_messages'));
    assert.ok(
      strip.indexOf('five_active_weeks') < strip.indexOf('hundred_messages'),
    );
  });

  it('the strip shows earned badges plus the next rung of each category', () => {
    assert.deepEqual(
      orderBadgesForStrip(everyStatus).map(badge => badge.id),
      [
        'first_call',
        'two_hours',
        'four_hours',
        'five_active_weeks',
        'fifty_messages',
        'hundred_messages',
      ],
    );
  });

  it('omits later rungs of a ladder until the next one is earned', () => {
    const resolved = resolveBadgeStates(MATCH_OVERVIEW_BADGE_DEFINITIONS, {
      calls: 1,
      messages: 20,
      callMinutes: 30,
      activeWeeks: 1,
    });
    const visible = visibleOverviewBadges(resolved).map(badge => badge.id);

    assert.deepEqual(visible, [
      'first_call',
      'fifty_messages',
      'two_hours',
      'five_active_weeks',
    ]);
    assert.ok(!visible.includes('hundred_messages'));
    assert.ok(!visible.includes('four_hours'));
    assert.ok(!visible.includes('ten_hours'));
    assert.ok(!visible.includes('ten_active_weeks'));
  });

  it('expanded groups completed, then in progress, then upcoming', () => {
    const statuses = orderAllBadges(everyStatus).map(badge => badge.status);
    const rank = { earned: 0, in_progress: 1, locked: 2 };

    assert.deepEqual(
      statuses.map(status => rank[status]),
      [...statuses.map(status => rank[status])].sort((a, b) => a - b),
    );
  });

  it('expanded holds every badge and keeps category order inside each group', () => {
    const ids = orderAllBadges(everyStatus).map(badge => badge.id);

    assert.equal(ids.length, MATCH_OVERVIEW_BADGE_DEFINITIONS.length);
    assert.deepEqual(ids, [
      'first_call',
      'two_hours',
      'fifty_messages',
      'four_hours',
      'five_active_weeks',
      'hundred_messages',
      'ten_hours',
      'ten_active_weeks',
    ]);
  });
});

describe('inferBadgeEarnedAt', () => {
  const createdAt = new Date('2026-06-01T10:00:00.000Z');

  it('stamps first_call, hour, and active-week badges from call history', () => {
    const earned = inferBadgeEarnedAt(createdAt, [
      { startedAt: '2026-06-01T18:00:00.000Z', durationSeconds: 60 * 30 },
      { startedAt: '2026-06-08T18:00:00.000Z', durationSeconds: 60 * 50 },
      { startedAt: '2026-06-15T18:00:00.000Z', durationSeconds: 60 * 40 },
      { startedAt: '2026-06-22T18:00:00.000Z', durationSeconds: 60 * 10 },
      { startedAt: '2026-06-29T18:00:00.000Z', durationSeconds: 60 * 10 },
    ]);

    assert.equal(earned.first_call, '2026-06-01T18:00:00.000Z');
    // 30+50+40 = 120 minutes on the third call.
    assert.equal(earned.two_hours, '2026-06-15T18:00:00.000Z');
    assert.equal(earned.four_hours, undefined);
    assert.equal(earned.five_active_weeks, '2026-06-29T18:00:00.000Z');
    assert.equal(earned.fifty_messages, undefined);
  });
});

describe('resolveOverviewBadges', () => {
  it('earns from live snapshot stats without dummy dates', () => {
    const resolved = resolveOverviewBadges(
      {
        calls: 2,
        messages: 60,
        callMinutes: 130,
        activeWeeks: 2,
      },
      {
        createdAt: '2026-06-01T10:00:00.000Z',
        calls: [
          { startedAt: '2026-06-01T18:00:00.000Z', durationSeconds: 60 * 70 },
          { startedAt: '2026-06-08T18:00:00.000Z', durationSeconds: 60 * 60 },
        ],
      },
    );
    const byId = Object.fromEntries(resolved.map(badge => [badge.id, badge]));

    assert.equal(byId.first_call.status, 'earned');
    assert.equal(byId.fifty_messages.status, 'earned');
    assert.equal(
      byId.fifty_messages.status === 'earned'
        ? byId.fifty_messages.earnedAt
        : undefined,
      null,
    );
    assert.equal(byId.two_hours.status, 'earned');
    assert.equal(byId.hundred_messages.status, 'in_progress');
  });
});

describe('badgeProgressCopyValues', () => {
  it('keeps call remaining in whole counts', () => {
    assert.deepEqual(
      badgeProgressCopyValues({
        metric: 'calls',
        current: 0,
        target: 1,
        remaining: 1,
      }),
      { current: 0, target: 1, remaining: 1, count: 1 },
    );
  });

  it('formats hours to one decimal', () => {
    const values = badgeProgressCopyValues({
      metric: 'call_hours',
      current: 2.75,
      target: 4,
      remaining: 1.25,
    });

    assert.equal(values.current, '2.8');
    assert.equal(values.target, 4);
    assert.equal(values.remaining, '1.3');
    assert.equal(values.count, 2);
  });
});
