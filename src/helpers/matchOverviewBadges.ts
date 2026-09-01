import { toDate, weekNumber } from './matchWeek.ts';

export type BadgeMetric = 'calls' | 'messages' | 'call_hours' | 'active_weeks';

export interface BadgeDefinition {
  id: string;
  nameKey: string;
  unlockHintKey: string;
  icon: 'star' | 'heart' | 'message' | 'video' | 'clock';
  metric: BadgeMetric;
  target: number;
  /** ISO date string when earned; null/undefined if not yet earned. */
  earnedAt?: string | null;
}

export interface BadgeStats {
  calls: number;
  messages: number;
  /** Total qualifying call minutes. Converted to hours for ``call_hours`` badges. */
  callMinutes: number;
  /** Weeks with at least one qualifying call — same number as the progress ring. */
  activeWeeks: number;
}

export type BadgeStatus = 'earned' | 'in_progress' | 'locked';

type BadgeFields = {
  id: string;
  nameKey: string;
  unlockHintKey: string;
  icon: BadgeDefinition['icon'];
  metric: BadgeMetric;
  current: number;
  target: number;
  remaining: number;
  progress: number;
};

export type ResolvedBadge =
  | (BadgeFields & { status: 'earned'; earnedAt: Date | null })
  | (BadgeFields & { status: 'in_progress' })
  | (BadgeFields & { status: 'locked' });

/**
 * Frontend-owned badge ladder. Conditions are resolved against match stats on the
 * client until a server catalog exists. Hours badges compare total call minutes
 * against 60 × target; active-week badges use weeks with a qualifying call.
 */
export const MATCH_OVERVIEW_BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_call',
    nameKey: 'match_overview.badges.first_call.name',
    unlockHintKey: 'match_overview.badges.first_call.hint',
    icon: 'video',
    metric: 'calls',
    target: 1,
  },
  {
    id: 'fifty_messages',
    nameKey: 'match_overview.badges.fifty_messages.name',
    unlockHintKey: 'match_overview.badges.fifty_messages.hint',
    icon: 'message',
    metric: 'messages',
    target: 50,
  },
  {
    id: 'hundred_messages',
    nameKey: 'match_overview.badges.hundred_messages.name',
    unlockHintKey: 'match_overview.badges.hundred_messages.hint',
    icon: 'message',
    metric: 'messages',
    target: 100,
  },
  {
    id: 'two_hours',
    nameKey: 'match_overview.badges.two_hours.name',
    unlockHintKey: 'match_overview.badges.two_hours.hint',
    icon: 'clock',
    metric: 'call_hours',
    target: 2,
  },
  {
    id: 'four_hours',
    nameKey: 'match_overview.badges.four_hours.name',
    unlockHintKey: 'match_overview.badges.four_hours.hint',
    icon: 'clock',
    metric: 'call_hours',
    target: 4,
  },
  {
    id: 'ten_hours',
    nameKey: 'match_overview.badges.ten_hours.name',
    unlockHintKey: 'match_overview.badges.ten_hours.hint',
    icon: 'clock',
    metric: 'call_hours',
    target: 10,
  },
  {
    id: 'five_active_weeks',
    nameKey: 'match_overview.badges.five_active_weeks.name',
    unlockHintKey: 'match_overview.badges.five_active_weeks.hint',
    icon: 'heart',
    metric: 'active_weeks',
    target: 5,
  },
  {
    id: 'ten_active_weeks',
    nameKey: 'match_overview.badges.ten_active_weeks.name',
    unlockHintKey: 'match_overview.badges.ten_active_weeks.hint',
    icon: 'star',
    metric: 'active_weeks',
    target: 10,
  },
];

function definitionOrder(id: string): number {
  const index = MATCH_OVERVIEW_BADGE_DEFINITIONS.findIndex(
    badge => badge.id === id,
  );
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function metricValue(metric: BadgeMetric, stats: BadgeStats): number {
  if (metric === 'calls') return stats.calls;
  if (metric === 'messages') return stats.messages;
  if (metric === 'call_hours') return stats.callMinutes / 60;
  return stats.activeWeeks;
}

function formatHours(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Interpolation values for progress / nudge copy, keyed by ``badge.metric``. */
export function badgeProgressCopyValues(badge: {
  metric: BadgeMetric;
  current: number;
  target: number;
  remaining: number;
}): {
  current: string | number;
  target: number;
  remaining: string | number;
  count: number;
} {
  if (badge.metric === 'call_hours') {
    const remainingHours = Math.max(0, badge.remaining);
    return {
      current: formatHours(badge.current),
      target: badge.target,
      remaining: formatHours(remainingHours),
      count: remainingHours <= 1 ? 1 : Math.ceil(remainingHours),
    };
  }

  const remaining = Math.max(0, Math.ceil(badge.remaining));
  return {
    current: Math.floor(badge.current),
    target: badge.target,
    remaining,
    count: remaining,
  };
}

type BadgeProgressRow = {
  badge: BadgeDefinition;
  index: number;
  current: number;
  target: number;
  remaining: number;
  progress: number;
  isEarned: boolean;
};

/** Lowest unfinished target in each metric — later rungs stay out of sight. */
function categoryCurrentIds(rows: BadgeProgressRow[]): Set<string> {
  const byMetric = new Map<BadgeMetric, BadgeProgressRow[]>();
  rows.forEach(row => {
    const group = byMetric.get(row.badge.metric) ?? [];
    group.push(row);
    byMetric.set(row.badge.metric, group);
  });

  const currentIds = new Set<string>();
  Array.from(byMetric.values()).forEach(group => {
    const next = [...group]
      .sort((a, b) => a.target - b.target)
      .find(row => !row.isEarned);
    if (next) currentIds.add(next.badge.id);
  });
  return currentIds;
}

/**
 * Resolves badge visual state from definition + match stats.
 *
 * Metrics are ladders (messages, hours, active weeks). Only the next unfinished
 * rung in each ladder can be in_progress; later rungs stay locked. First call
 * is always in_progress until earned, even at zero, so it leads the strip.
 */
export function resolveBadgeStates(
  badges: BadgeDefinition[],
  stats: BadgeStats,
): ResolvedBadge[] {
  const withProgress = badges.map((badge, index) => {
    const current = metricValue(badge.metric, stats);
    const { target } = badge;
    const remaining = Math.max(0, target - current);
    const progress = target > 0 ? Math.min(1, current / target) : 0;
    const isEarned = Boolean(badge.earnedAt) || current >= target;

    return { badge, index, current, target, remaining, progress, isEarned };
  });

  const currentIds = categoryCurrentIds(withProgress);

  return withProgress
    .map(({ badge, current, target, remaining, progress, isEarned }) => {
      const base: BadgeFields = {
        id: badge.id,
        nameKey: badge.nameKey,
        unlockHintKey: badge.unlockHintKey,
        icon: badge.icon,
        metric: badge.metric,
        current,
        target,
        remaining,
        progress,
      };

      if (isEarned) {
        return {
          ...base,
          status: 'earned' as const,
          earnedAt: badge.earnedAt ? new Date(badge.earnedAt) : null,
        };
      }

      const isCategoryCurrent = currentIds.has(badge.id);
      const leadFirstCall = badge.id === 'first_call';
      if (isCategoryCurrent && (progress > 0 || leadFirstCall)) {
        return {
          ...base,
          status: 'in_progress' as const,
        };
      }

      return {
        ...base,
        status: 'locked' as const,
      };
    })
    .sort((a, b) => {
      const aFirst = a.id === 'first_call' && a.status !== 'earned' ? 0 : 1;
      const bFirst = b.id === 'first_call' && b.status !== 'earned' ? 0 : 1;
      if (aFirst !== bFirst) return aFirst - bFirst;
      return (
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        definitionOrder(a.id) - definitionOrder(b.id)
      );
    });
}

export function getNextInProgressBadge(
  badges: ResolvedBadge[],
): Extract<ResolvedBadge, { status: 'in_progress' }> | null {
  const inProgress = badges.filter(
    (badge): badge is Extract<ResolvedBadge, { status: 'in_progress' }> =>
      badge.status === 'in_progress',
  );
  const firstCall = inProgress.find(badge => badge.id === 'first_call');
  if (firstCall) return firstCall;
  return (
    [...inProgress].sort(
      (a, b) =>
        b.progress - a.progress ||
        definitionOrder(a.id) - definitionOrder(b.id),
    )[0] ?? null
  );
}

/**
 * Earned badges plus the next unfinished rung of each metric. Later linked
 * badges (100 messages before 50, 10 hours before 2) are omitted.
 */
export function visibleOverviewBadges(
  badges: ResolvedBadge[],
): ResolvedBadge[] {
  const currentUnfinished = new Set<string>();
  const unfinishedByMetric = new Map<BadgeMetric, ResolvedBadge[]>();

  badges
    .filter(badge => badge.status !== 'earned')
    .forEach(badge => {
      const group = unfinishedByMetric.get(badge.metric) ?? [];
      group.push(badge);
      unfinishedByMetric.set(badge.metric, group);
    });

  Array.from(unfinishedByMetric.values()).forEach(group => {
    const [lowest] = [...group].sort((a, b) => a.target - b.target);
    currentUnfinished.add(lowest.id);
  });

  return badges.filter(
    badge => badge.status === 'earned' || currentUnfinished.has(badge.id),
  );
}

/** The category a badge belongs to is its metric; these are the ladders. */
const LEAD_BADGE_ID = 'first_call';
const TRAILING_CATEGORY: BadgeMetric = 'messages';

/**
 * Category display order, derived from the ladder so it cannot drift from it.
 *
 * The category holding the first call leads and keeps leading once it is earned —
 * getting a first call to happen is what the whole page is for, so its ladder outranks
 * the others whatever their progress. Messages trail: they accumulate on their own and
 * say the least about whether a match is working. Anything between keeps the order the
 * definitions are written in.
 */
export const BADGE_CATEGORY_ORDER: BadgeMetric[] = (() => {
  const lead = MATCH_OVERVIEW_BADGE_DEFINITIONS.find(
    badge => badge.id === LEAD_BADGE_ID,
  )?.metric;

  const declared: BadgeMetric[] = [];
  MATCH_OVERVIEW_BADGE_DEFINITIONS.forEach(badge => {
    if (!declared.includes(badge.metric)) declared.push(badge.metric);
  });

  const middle = declared.filter(
    metric => metric !== lead && metric !== TRAILING_CATEGORY,
  );
  return [...(lead ? [lead] : []), ...middle, TRAILING_CATEGORY];
})();

export function categoryPriority(metric: BadgeMetric): number {
  const index = BADGE_CATEGORY_ORDER.indexOf(metric);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

const STATUS_ORDER: Record<ResolvedBadge['status'], number> = {
  earned: 0,
  in_progress: 1,
  locked: 2,
};

function byCategoryThenRung(a: ResolvedBadge, b: ResolvedBadge): number {
  return (
    categoryPriority(a.metric) - categoryPriority(b.metric) ||
    a.target - b.target
  );
}

/**
 * The collapsed strip: earned badges plus the next rung of each category, in category
 * order. How many of these are on screen is a layout question, not this function's —
 * the strip fits what it can and the last slot is the view-all control.
 */
export function orderBadgesForStrip(badges: ResolvedBadge[]): ResolvedBadge[] {
  return [...visibleOverviewBadges(badges)].sort(byCategoryThenRung);
}

/** Expanded: every badge, completed then in progress then upcoming, category order inside each. */
export function orderAllBadges(badges: ResolvedBadge[]): ResolvedBadge[] {
  return [...badges].sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      byCategoryThenRung(a, b),
  );
}

export interface BadgeCallEvent {
  startedAt: Date | string;
  durationSeconds: number;
}

const HOUR_BADGES = [
  { id: 'two_hours', minutes: 120 },
  { id: 'four_hours', minutes: 240 },
  { id: 'ten_hours', minutes: 600 },
] as const;

const WEEK_BADGES = [
  { id: 'five_active_weeks', weeks: 5 },
  { id: 'ten_active_weeks', weeks: 10 },
] as const;

/**
 * When each call-based badge was crossed, from qualifying call history.
 * Message badges are omitted — the overview snapshot has a count, not timestamps.
 *
 * This is a *date*, not the earned test. Whether a badge is earned comes from the
 * snapshot totals in `resolveBadgeStates`; the minutes summed here are per-call and
 * already floored to whole seconds by the API, so within a second of a threshold the
 * two can disagree and a badge shows as earned with no date. That degrades the right
 * way (`Boolean(earnedAt) || current >= target`) and is why the date is never the test.
 */
export function inferBadgeEarnedAt(
  createdAt: Date | string,
  calls: BadgeCallEvent[],
): Partial<Record<string, string>> {
  const created = toDate(createdAt);
  const sorted = [...calls]
    .map(call => ({
      at: toDate(call.startedAt),
      minutes: Math.max(0, call.durationSeconds) / 60,
    }))
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  const earned: Partial<Record<string, string>> = {};
  if (sorted[0]) {
    earned.first_call = sorted[0].at.toISOString();
  }

  let cumulativeMinutes = 0;
  const weeksSeen = new Set<number>();

  sorted.forEach(call => {
    cumulativeMinutes += call.minutes;
    HOUR_BADGES.forEach(badge => {
      if (!earned[badge.id] && cumulativeMinutes >= badge.minutes) {
        earned[badge.id] = call.at.toISOString();
      }
    });

    const week = weekNumber(created, call.at);
    if (weeksSeen.has(week)) return;
    weeksSeen.add(week);
    WEEK_BADGES.forEach(badge => {
      if (!earned[badge.id] && weeksSeen.size >= badge.weeks) {
        earned[badge.id] = call.at.toISOString();
      }
    });
  });

  return earned;
}

/** Resolves the frontend ladder against a live overview snapshot. */
export function resolveOverviewBadges(
  stats: BadgeStats,
  options: { createdAt: Date | string; calls: BadgeCallEvent[] },
): ResolvedBadge[] {
  const earnedAtById = inferBadgeEarnedAt(options.createdAt, options.calls);
  const definitions = MATCH_OVERVIEW_BADGE_DEFINITIONS.map(badge => {
    const earnedAt = earnedAtById[badge.id];
    return earnedAt ? { ...badge, earnedAt } : badge;
  });
  return resolveBadgeStates(definitions, stats);
}
