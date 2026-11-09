import React from 'react';

import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  ProgressBar,
  ProgressBarSizes,
  ProgressBarVariations,
  StarIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

/** Fallback only: the backend sends the goal as `success_minutes`. */
const DEFAULT_MAX_MINUTES = 300;

/** User-facing goal. Tokens past this keep the "goal reached" nudge. */
const GOAL_TOKENS = 10;

type NudgeTone = 'success' | 'motivational' | 'warning';

type NudgeIcon = typeof StarIcon;

interface Nudge {
  tone: NudgeTone;
  lines: string[];
  Icon: NudgeIcon;
}

export interface ProgressPanelProps {
  minutes: number;
  max?: number;
  /** From `progress_tokens`. Omitted responses fall back to the goal line. */
  tokens?: number;
  /** From `both_partners_messaged`. */
  bothPartnersMessaged?: boolean;
}

const Panel = styled.div<{ $tone: NudgeTone }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.xsmall};
  box-sizing: border-box;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: ${({ theme }) => theme.radius.large};

  ${({ theme, $tone }) => {
    if ($tone === 'success') {
      return css`
        background: ${theme.color.surface.success};
      `;
    }
    if ($tone === 'warning') {
      return css`
        background: ${theme.color.surface.message};
      `;
    }
    // No light-blue surface token. Tint the blue accent so this reads as blue.
    return css`
      background: color-mix(
        in srgb,
        ${theme.color.border.accent} 42%,
        ${theme.color.surface.primary}
      );
    `;
  }}
`;

const NudgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: 0 ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.primary};
`;

const NudgeCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const NudgeLine = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
`;

const NUDGES: Record<number, (t: TFunction) => Nudge> = {
  1: t => ({
    tone: 'success',
    lines: [t('profile_card.nudge.1')],
    Icon: CheckIcon,
  }),
  2: t => ({
    tone: 'motivational',
    lines: [t('profile_card.nudge.2')],
    Icon: FlameIcon,
  }),
  3: t => ({
    tone: 'success',
    lines: [t('profile_card.nudge.3'), t('profile_card.nudge.3_more')],
    Icon: StarIcon,
  }),
  4: t => ({
    tone: 'motivational',
    lines: [t('profile_card.nudge.4')],
    Icon: HeartIcon,
  }),
  5: t => ({
    tone: 'success',
    lines: [t('profile_card.nudge.5')],
    Icon: CheckIcon,
  }),
  6: t => ({
    tone: 'motivational',
    lines: [t('profile_card.nudge.6')],
    Icon: ClockIcon,
  }),
  7: t => ({
    tone: 'success',
    lines: [t('profile_card.nudge.7'), t('profile_card.nudge.7_more')],
    Icon: HeartIcon,
  }),
  8: t => ({
    tone: 'motivational',
    lines: [t('profile_card.nudge.8'), t('profile_card.nudge.8_more')],
    Icon: FlameIcon,
  }),
  9: t => ({
    tone: 'motivational',
    lines: [t('profile_card.nudge.9')],
    Icon: StarIcon,
  }),
  10: t => ({
    tone: 'success',
    lines: [t('profile_card.nudge.10'), t('profile_card.nudge.10_more')],
    Icon: CheckIcon,
  }),
};

/**
 * A call under the first token band wins over the "set a meeting" prompt:
 * they have already talked. The meeting prompt and the goal line are for
 * before any mutual call, and stay hidden while the card requires minutes.
 */
function resolveNudge(
  tokens: number | undefined,
  minutes: number,
  bothPartnersMessaged: boolean,
  t: TFunction,
): Nudge {
  if (tokens == null) {
    return {
      tone: 'motivational',
      lines: [t('profile_card.nudge.goal')],
      Icon: StarIcon,
    };
  }

  if (tokens <= 0) {
    if (minutes > 0) {
      return {
        tone: 'motivational',
        lines: [t('profile_card.nudge.short_call')],
        Icon: ClockIcon,
      };
    }
    if (bothPartnersMessaged) {
      return {
        tone: 'warning',
        lines: [t('profile_card.nudge.schedule')],
        Icon: CalendarIcon,
      };
    }
    return {
      tone: 'motivational',
      lines: [t('profile_card.nudge.goal')],
      Icon: StarIcon,
    };
  }

  const band = Math.min(tokens, GOAL_TOKENS);
  return NUDGES[band](t);
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({
  minutes,
  max,
  tokens,
  bothPartnersMessaged = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const safeMax = max && max > 0 ? Math.round(max) : DEFAULT_MAX_MINUTES;
  const value = Math.min(Math.max(minutes, 0), safeMax);
  const nudge = resolveNudge(tokens, minutes, bothPartnersMessaged, t);
  const { Icon } = nudge;
  let iconColor = theme.color.text.info;
  if (nudge.tone === 'success') iconColor = theme.color.text.success;
  if (nudge.tone === 'warning') iconColor = theme.color.text.highlight;

  return (
    <Panel $tone={nudge.tone}>
      <ProgressBar
        showScale={false}
        showValueInBar
        max={safeMax}
        value={value}
        size={ProgressBarSizes.Small}
        variation={ProgressBarVariations.Scale}
        endLabel={t('profile_card.minutes_short', { count: safeMax })}
      />
      <NudgeRow>
        <Icon width={12} height={12} color={iconColor} label="" />
        <NudgeCopy>
          {nudge.lines.map(line => (
            <NudgeLine key={line} type={TextTypes.Body6}>
              {line}
            </NudgeLine>
          ))}
        </NudgeCopy>
      </NudgeRow>
    </Panel>
  );
};

export default ProgressPanel;
