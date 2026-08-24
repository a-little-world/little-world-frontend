import {
  FlameIcon,
  FlameOutlineIcon,
  Gradients,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

/**
 * Whether the flame is lit. The count comes from `toleratedWeekStreak` — the same number
 * the progress hero and the `streak_active` state read, so the chip and the copy beside
 * it cannot disagree about how long the run is.
 */
export type StreakChipState = 'active' | 'paused';

export interface StreakChipProps {
  weeks: number;
  state: StreakChipState;
  className?: string;
}

const Pill = styled.div<{ $state: StreakChipState }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: fit-content;
  max-width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.radius.large};
  background: ${({ theme, $state }) =>
    $state === 'active'
      ? theme.color.surface.accent
      : theme.color.surface.secondary};
`;

const IconWrap = styled.span`
  display: flex;
  flex-shrink: 0;
`;

const Copy = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Count = styled(Text)<{ $state: StreakChipState }>`
  font-weight: 600;
  color: ${({ theme, $state }) =>
    $state === 'active'
      ? theme.color.text.primary
      : theme.color.text.secondary};
`;

const Motivation = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

function StreakChip({ weeks, state, className }: StreakChipProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const resolvedState: StreakChipState = weeks < 1 ? 'paused' : state;
  const next = weeks + 1;

  const countLabel =
    resolvedState === 'active'
      ? t('matchStreak.active.count', { count: weeks })
      : t('matchStreak.paused.label');
  const motivation =
    resolvedState === 'active'
      ? t('matchStreak.active.motivation', { next })
      : t('matchStreak.paused.motivation');

  return (
    <Pill
      className={className}
      $state={resolvedState}
      aria-label={`${countLabel}. ${motivation}`}
    >
      <IconWrap aria-hidden>
        {resolvedState === 'active' ? (
          <FlameIcon label="" gradient={Gradients.Orange} />
        ) : (
          <FlameOutlineIcon label="" color={theme.color.text.tertiary} />
        )}
      </IconWrap>
      <Copy>
        <Count
          type={TextTypes.Body5}
          tag="span"
          $state={resolvedState}
          aria-hidden
        >
          {countLabel}
        </Count>
        <Motivation type={TextTypes.Body6} tag="span" aria-hidden>
          {motivation}
        </Motivation>
      </Copy>
    </Pill>
  );
}

export default StreakChip;
