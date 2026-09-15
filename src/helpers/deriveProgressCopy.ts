import type { MatchStateKind } from './deriveMatchState.ts';

export interface ProgressCopyKeys {
  headingKey: string;
  bodyKey: string;
  ctaKey: string | null;
}

/** Where the hero's button goes. `null` states have no button. */
export type ProgressCtaTarget = 'chat' | 'support' | null;

/**
 * Match Overview progress hero copy, keyed by `MatchState`.
 *
 * The states are the ones in `deriveMatchState`, not a private set — this hero and the
 * teaser on the partner card describe the same match, and they used to do it from two
 * unrelated vocabularies (`first_call` / `next_call` / `needs_support` / `complete` here,
 * `no_call` / `active` / `gone_quiet` / `cycle_complete` there). One list means a state
 * added in one place cannot go unanswered in the other.
 */
const COPY_KEYS: Record<MatchStateKind, ProgressCopyKeys> = {
  successful: {
    headingKey: 'match_overview.progress.successful.heading',
    bodyKey: 'match_overview.progress.successful.body',
    ctaKey: null,
  },
  no_message: {
    headingKey: 'match_overview.progress.no_message.heading',
    bodyKey: 'match_overview.progress.no_message.body',
    ctaKey: 'match_overview.progress.no_message.cta',
  },
  no_call: {
    headingKey: 'match_overview.progress.no_call.heading',
    bodyKey: 'match_overview.progress.no_call.body',
    ctaKey: 'match_overview.progress.no_call.cta',
  },
  dormant: {
    headingKey: 'match_overview.progress.dormant.heading',
    bodyKey: 'match_overview.progress.dormant.body',
    ctaKey: 'match_overview.progress.dormant.cta',
  },
  streak_active: {
    headingKey: 'match_overview.progress.streak_active.heading',
    bodyKey: 'match_overview.progress.streak_active.body',
    ctaKey: 'match_overview.progress.streak_active.cta',
  },
  engaged: {
    // Counts down the weeks still to bank, so it stays the weeks-remaining string.
    headingKey: 'match_overview.weeks_remaining_heading',
    bodyKey: 'match_overview.progress.engaged.body',
    ctaKey: 'match_overview.progress.engaged.cta',
  },
};

const CTA_TARGETS: Record<MatchStateKind, ProgressCtaTarget> = {
  successful: null,
  no_message: 'chat',
  no_call: 'chat',
  // The only state that routes away from the pair: they have tried and it has gone
  // quiet, so the useful next step is us, not another message into the void.
  dormant: 'support',
  streak_active: 'chat',
  engaged: 'chat',
};

export function progressCopyKeys(state: MatchStateKind): ProgressCopyKeys {
  return COPY_KEYS[state];
}

export function progressCtaTarget(state: MatchStateKind): ProgressCtaTarget {
  return CTA_TARGETS[state];
}

export interface ProgressCopyValues {
  name: string;
  weeksRemaining: number;
  weekStreak: number;
}

/**
 * Interpolation values for the hero, per state.
 *
 * Kept beside the keys because they belong to them: `count` drives i18next pluralisation,
 * so handing a state a `count` that means something else in its string is how a heading
 * ends up counting the wrong thing. Only `engaged` counts down remaining weeks; only
 * `streak_active` names the length of the run.
 */
export function progressCopyParams(
  state: MatchStateKind,
  { name, weeksRemaining, weekStreak }: ProgressCopyValues,
): Record<string, string | number> {
  if (state === 'engaged') {
    return { name, count: weeksRemaining };
  }
  if (state === 'streak_active') {
    return { name, count: weekStreak };
  }
  return { name };
}

/**
 * Which states show the last-call line. It needs a call to have happened, so `dormant`
 * qualifies — a match that has gone quiet is precisely one where when they last spoke is
 * the useful thing to say. Before the first call it would only compete with the ask.
 */
export function progressShowsLastCall(state: MatchStateKind): boolean {
  return (
    state === 'engaged' || state === 'streak_active' || state === 'dormant'
  );
}

/**
 * A weekday is only unambiguous on an active streak — "last Wednesday" is this run.
 * Engaged or dormant can be several Wednesdays ago, so those get the calendar date.
 */
export function progressLastCallUsesWeekday(state: MatchStateKind): boolean {
  return state === 'streak_active';
}
