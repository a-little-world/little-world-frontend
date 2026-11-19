import React from 'react';

import {
  CalendarIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  ProgressBar,
  ProgressBarSizes,
  ProgressBarVariations,
  QuestionIcon,
  StarIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import {
  resolveNudge,
  type NudgeIconName,
  type NudgeTone,
} from '../../../constants/matchNudges';

/** Fallback only: the backend sends the goal as `success_minutes`. */
const DEFAULT_MAX_MINUTES = 300;

const NUDGE_ICONS: Record<NudgeIconName, typeof StarIcon> = {
  calendar: CalendarIcon,
  clock: ClockIcon,
  flame: FlameIcon,
  heart: HeartIcon,
  question: QuestionIcon,
  star: StarIcon,
};

export interface ProgressPanelProps {
  minutes: number;
  max?: number;
  /** From `progress_nudge`. Missing or unknown keys fall back to the goal line. */
  nudgeKey?: string | null;
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
    if ($tone === 'motivational') {
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
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: 0 ${({ theme }) => theme.spacing.xxxsmall};
  color: ${({ theme }) => theme.color.text.primary};
`;

const NudgeIconWrapper = styled.span`
  display: flex;
  flex-shrink: 0;
  margin-top: ${({ theme }) => theme.spacing.xxxxsmall};
`;

const NudgeLine = styled(Text)`
  min-width: 0;
  color: ${({ theme }) => theme.color.text.primary};
`;

const ProgressPanel: React.FC<ProgressPanelProps> = ({
  minutes,
  max,
  nudgeKey,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const safeMax = max && max > 0 ? Math.round(max) : DEFAULT_MAX_MINUTES;
  const nudge = resolveNudge(nudgeKey);
  const Icon = NUDGE_ICONS[nudge.icon];
  let iconColor = theme.color.text.info;
  if (nudge.tone === 'success') iconColor = theme.color.text.success;
  if (nudge.tone === 'motivational') iconColor = theme.color.text.highlight;

  return (
    <Panel $tone={nudge.tone}>
      <ProgressBar
        allowOverflow
        showScale={false}
        showValueInBar
        max={safeMax}
        value={minutes}
        size={ProgressBarSizes.Small}
        variation={ProgressBarVariations.Scale}
        endLabel={t('profile_card.minutes_short', { count: safeMax })}
      />
      <NudgeRow>
        <NudgeIconWrapper aria-hidden="true">
          <Icon width={16} height={16} color={iconColor} label="" />
        </NudgeIconWrapper>
        <NudgeLine type={TextTypes.Body6}>
          {t(nudge.textKey, { minutes })}
        </NudgeLine>
      </NudgeRow>
    </Panel>
  );
};

export default ProgressPanel;
