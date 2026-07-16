export type BadgeMetric = 'calls' | 'weeks' | 'messages';

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
  week: number;
  messages: number;
}

export type BadgeStatus = 'earned' | 'in_progress' | 'locked';

export type ResolvedBadge =
  | {
      id: string;
      nameKey: string;
      unlockHintKey: string;
      icon: BadgeDefinition['icon'];
      status: 'earned';
      earnedAt: Date;
      current: number;
      target: number;
      remaining: number;
      progress: number;
    }
  | {
      id: string;
      nameKey: string;
      unlockHintKey: string;
      icon: BadgeDefinition['icon'];
      status: 'in_progress';
      current: number;
      target: number;
      remaining: number;
      progress: number;
    }
  | {
      id: string;
      nameKey: string;
      unlockHintKey: string;
      icon: BadgeDefinition['icon'];
      status: 'locked';
      current: number;
      target: number;
      remaining: number;
      progress: number;
    };

function metricValue(metric: BadgeMetric, stats: BadgeStats): number {
  if (metric === 'calls') return stats.calls;
  if (metric === 'weeks') return stats.week;
  return stats.messages;
}

/**
 * Resolves badge visual state from definition + live match stats.
 * Only one badge may be in_progress at a time (the nearest unfinished
 * by target among not-yet-earned). Others remain locked until the
 * in-progress one is earned — except badges that are already earned.
 */
export function resolveBadgeStates(
  badges: BadgeDefinition[],
  stats: BadgeStats,
): ResolvedBadge[] {
  const withProgress = badges.map(badge => {
    const current = metricValue(badge.metric, stats);
    const target = badge.target;
    const remaining = Math.max(0, target - current);
    const progress = target > 0 ? Math.min(1, current / target) : 0;
    const isEarned = Boolean(badge.earnedAt) || current >= target;

    return { badge, current, target, remaining, progress, isEarned };
  });

  const inProgressCandidate = withProgress
    .filter(({ isEarned }) => !isEarned)
    .sort((a, b) => a.target - b.target || a.remaining - b.remaining)[0];

  const inProgressId = inProgressCandidate?.badge.id ?? null;

  const STATUS_ORDER: Record<ResolvedBadge['status'], number> = {
    earned: 0,
    in_progress: 1,
    locked: 2,
  };

  return withProgress
    .map(({ badge, current, target, remaining, progress, isEarned }) => {
      const base = {
        id: badge.id,
        nameKey: badge.nameKey,
        unlockHintKey: badge.unlockHintKey,
        icon: badge.icon,
        current,
        target,
        remaining,
        progress,
      };

      if (isEarned) {
        return {
          ...base,
          status: 'earned' as const,
          earnedAt: badge.earnedAt ? new Date(badge.earnedAt) : new Date(),
        };
      }

      if (badge.id === inProgressId) {
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
    .sort(
      (a, b) =>
        STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
        a.target - b.target,
    );
}

export function getNextInProgressBadge(
  badges: ResolvedBadge[],
): Extract<ResolvedBadge, { status: 'in_progress' }> | null {
  return badges.find(badge => badge.status === 'in_progress') ?? null;
}
