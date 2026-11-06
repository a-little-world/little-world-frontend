import React from 'react';

import {
  ProgressBar,
  ProgressBarSizes,
  ProgressBarVariations,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

/** Fallback only: the backend sends the goal as `success_minutes`. */
const DEFAULT_MAX_MINUTES = 300;

export interface ProgressPanelProps {
  minutes: number;
  max?: number;
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing.xsmall};
  box-sizing: border-box;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: ${({ theme }) => theme.radius.large};
  background: ${({ theme }) => theme.color.surface.secondary};
`;

const Nudge = styled(Text)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: 0
    ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.xxxxsmall}`};
  color: ${({ theme }) => theme.color.text.primary};
`;

const ProgressPanel: React.FC<ProgressPanelProps> = ({ minutes, max }) => {
  const { t } = useTranslation();
  const safeMax = max && max > 0 ? Math.round(max) : DEFAULT_MAX_MINUTES;
  const value = Math.min(Math.max(minutes, 0), safeMax);
  const title = t('match_overview.progress_title');

  return (
    <Panel>
      <ProgressBar
        showScale={false}
        showValueInBar
        max={safeMax}
        value={value}
        size={ProgressBarSizes.Small}
        variation={ProgressBarVariations.Scale}
        endLabel={t('profile_card.minutes_short', { count: safeMax })}
      />
      <Nudge>{title}</Nudge>
    </Panel>
  );
};

export default ProgressPanel;
