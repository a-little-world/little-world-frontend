import {
  CalendarIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  QuestionIcon,
  StarIcon,
} from '@a-little-world/little-world-design-system';
import { TFunction } from 'i18next';

/** User-facing goal. The next band uses the "keep talking" line. */
const GOAL_TOKENS = 10;

export type NudgeIcon = typeof StarIcon;

export type NudgeTone = 'success' | 'motivational' | 'informational';

export interface Nudge {
  tone: NudgeTone;
  text: string;
  Icon: NudgeIcon;
}

/** Column H (short lead) and column J (sentence), shown as one line. */
function nudgeCopy(
  t: TFunction,
  key: string,
  values?: { name?: string; minutes?: number },
): string {
  const body = values
    ? t(`profile_card.nudge.${key}`, values)
    : t(`profile_card.nudge.${key}`);
  return `${t(`profile_card.nudge.${key}_lead`)} ${body}`;
}

interface NudgeContext {
  t: TFunction;
  minutes: number;
  partnerName: string;
  /** Most recent qualifying call. Absent when the pair has never had one. */
  lastCallMinutes?: number | null;
  /** That call ended within the last seven days. */
  lastCallWithinWeek?: boolean;
  /** Fifteen days with no new mutual minutes. */
  minutesStale?: boolean;
}

const NUDGES: Record<number, (ctx: NudgeContext) => Nudge> = {
  1: ({ t, minutes }) => ({
    tone: 'success',
    text: nudgeCopy(t, '1', { minutes }),
    Icon: StarIcon,
  }),
  2: ({ t }) => ({
    tone: 'motivational',
    text: nudgeCopy(t, '2'),
    Icon: FlameIcon,
  }),
  3: ({ t }) => ({
    tone: 'success',
    text: nudgeCopy(t, '3'),
    Icon: StarIcon,
  }),
  4: ({ t }) => ({
    tone: 'motivational',
    text: nudgeCopy(t, '4'),
    Icon: HeartIcon,
  }),
  5: ({ t }) => ({
    tone: 'success',
    text: nudgeCopy(t, '5'),
    Icon: HeartIcon,
  }),
  6: ({ t }) => ({
    tone: 'motivational',
    text: nudgeCopy(t, '6'),
    Icon: ClockIcon,
  }),
  7: ({ t }) => ({
    tone: 'success',
    text: nudgeCopy(t, '7'),
    Icon: HeartIcon,
  }),
  8: ({ t }) => ({
    tone: 'motivational',
    text: nudgeCopy(t, '8'),
    Icon: FlameIcon,
  }),
  9: ({ t }) => ({
    tone: 'motivational',
    text: nudgeCopy(t, '9'),
    Icon: StarIcon,
  }),
  10: ({ t }) => ({
    tone: 'success',
    text: nudgeCopy(t, '10'),
    Icon: HeartIcon,
  }),
};

/**
 * A call under the first token band wins over the "set a meeting" prompt:
 * they have already talked. The meeting prompt and the goal line are for
 * before any mutual call, and stay hidden while the card requires minutes.
 */
export function resolveNudge(
  tokens: number | undefined,
  bothPartnersMessaged: boolean,
  ctx: NudgeContext,
): Nudge {
  const {
    t,
    minutes,
    partnerName,
    lastCallMinutes,
    lastCallWithinWeek,
    minutesStale,
  } = ctx;

  // A quiet stretch, or a long call this week, replaces the token-band line.
  if (minutesStale) {
    return {
      tone: 'motivational',
      text: nudgeCopy(t, 'stale', { name: partnerName }),
      Icon: CalendarIcon,
    };
  }

  if (
    lastCallWithinWeek &&
    lastCallMinutes != null &&
    lastCallMinutes >= 60 &&
    lastCallMinutes < 120
  ) {
    return {
      tone: 'success',
      text: nudgeCopy(t, 'recent_hour'),
      Icon: ClockIcon,
    };
  }

  if (lastCallWithinWeek && lastCallMinutes != null && lastCallMinutes >= 120) {
    return {
      tone: 'success',
      text: nudgeCopy(t, 'recent_long'),
      Icon: HeartIcon,
    };
  }

  if (tokens == null) {
    return {
      tone: 'informational',
      text: nudgeCopy(t, 'goal'),
      Icon: QuestionIcon,
    };
  }

  if (tokens <= 0) {
    if (minutes > 0) {
      return {
        tone: 'informational',
        text: nudgeCopy(t, 'short_call'),
        Icon: ClockIcon,
      };
    }
    if (bothPartnersMessaged) {
      return {
        tone: 'motivational',
        text: nudgeCopy(t, 'schedule', { name: partnerName }),
        Icon: CalendarIcon,
      };
    }
    return {
      tone: 'informational',
      text: nudgeCopy(t, 'goal'),
      Icon: QuestionIcon,
    };
  }

  if (tokens > GOAL_TOKENS) {
    return {
      tone: 'success',
      text: nudgeCopy(t, '11'),
      Icon: FlameIcon,
    };
  }

  return NUDGES[tokens](ctx);
}
