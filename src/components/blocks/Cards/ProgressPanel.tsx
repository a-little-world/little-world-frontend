import React from 'react';

import {
  ProgressBar,
  ProgressBarSizes,
  ProgressBarVariations,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

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
  padding: 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: none;
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

const ProgressPanel: React.FC<ProgressPanelProps> = ({
  minutes,
  max = 300,
}) => {
  const { t } = useTranslation();
  const safeMax = max > 0 ? max : 300;
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
        endLabel={`${safeMax} Min`}
      />
      <Nudge>{title}</Nudge>
    </Panel>
  );
};

export default ProgressPanel;
