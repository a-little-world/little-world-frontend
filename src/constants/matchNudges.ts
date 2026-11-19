/**
 * Presentation for the partner-card progress nudge.
 *
 * The backend decides which nudge applies and sends its key as `progress_nudge`
 * (see `management/match_nudges.py`). This file only maps that key to a tone,
 * an icon and a locale key. It has no imports so it can be unit-tested with
 * `node --test`.
 */

export type NudgeTone = 'success' | 'motivational' | 'informational';

export type NudgeIconName =
  | 'calendar'
  | 'clock'
  | 'flame'
  | 'heart'
  | 'question'
  | 'star';

export interface Nudge {
  tone: NudgeTone;
  icon: NudgeIconName;
  /** Locale key under `profile_card.nudge`. */
  textKey: string;
}

const NUDGES = {
  goal: { tone: 'informational', icon: 'question' },
  schedule: { tone: 'motivational', icon: 'calendar' },
  short_call: { tone: 'informational', icon: 'clock' },
  band_1: { tone: 'success', icon: 'star' },
  band_2: { tone: 'motivational', icon: 'flame' },
  band_3: { tone: 'success', icon: 'star' },
  band_4: { tone: 'motivational', icon: 'heart' },
  band_5: { tone: 'success', icon: 'heart' },
  band_6: { tone: 'motivational', icon: 'clock' },
  band_7: { tone: 'success', icon: 'heart' },
  band_8: { tone: 'motivational', icon: 'flame' },
  band_9: { tone: 'motivational', icon: 'star' },
  band_10: { tone: 'success', icon: 'heart' },
  beyond_goal: { tone: 'success', icon: 'flame' },
  stale: { tone: 'motivational', icon: 'calendar' },
  recent_hour: { tone: 'success', icon: 'clock' },
  recent_long: { tone: 'success', icon: 'heart' },
} satisfies Record<string, Omit<Nudge, 'textKey'>>;

export type NudgeKey = keyof typeof NUDGES;

export const NUDGE_KEYS = Object.keys(NUDGES) as NudgeKey[];

/** Shown when the key is missing (older backend) or unknown (newer backend). */
const FALLBACK_KEY: NudgeKey = 'goal';

function isNudgeKey(key: string): key is NudgeKey {
  return Object.prototype.hasOwnProperty.call(NUDGES, key);
}

export function resolveNudge(key: string | null | undefined): Nudge {
  const resolved = key && isNudgeKey(key) ? key : FALLBACK_KEY;
  return { ...NUDGES[resolved], textKey: `profile_card.nudge.${resolved}` };
}
