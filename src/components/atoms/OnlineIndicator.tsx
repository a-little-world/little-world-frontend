import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css, keyframes } from 'styled-components';

const Indicator = styled.div<{
  $online: boolean;
  $position: 'absolute' | 'relative';
}>`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.highlight};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  background-color: ${({ theme }) => theme.color.surface.primary};
  border-radius: 100px;
  padding: ${({ theme }) => `6px ${theme.spacing.xsmall}`};
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  position: ${({ $position }) => $position};
  pointer-events: none;
  opacity: ${({ $online }) => ($online ? 1 : 0)};
  transition: opacity 1s;
  box-shadow: 0px 1px 6px 4px rgb(0 0 0 / 7%);

  ${({ $position, theme }) =>
    $position === 'absolute' &&
    css`
      left: ${theme.spacing.medium};
      top: ${theme.spacing.medium};
    `}
`;

const IndicatorText = styled(Text)`
  line-height: 1;
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0px rgba(46, 169, 87, 0.2);
  }
  100% {
    box-shadow: 0 0 0 5px rgba(46, 169, 87, 0);
  }
`;

export const OnlineCircle = styled.span`
  background-color: ${({ theme }) => theme.color.status.success};
  height: 9px;
  width: 9px;
  border-radius: 100%;
  margin-top: ${({ theme }) => theme.spacing.xxxxsmall};
  margin-top: 0;
  animation: ${pulse} 2s infinite;
`;

const OnlineIndicator = ({
  customText,
  isOnline,
  position = 'relative',
}: {
  isOnline: boolean;
  position?: 'absolute' | 'relative';
  customText?: string;
}) => {
  const { t } = useTranslation();
  return (
    <Indicator $online={isOnline} $position={position}>
      <IndicatorText tag="span" type={TextTypes.Body6}>
        {customText || t('online_indicator.online')}
      </IndicatorText>
      <OnlineCircle />
    </Indicator>
  );
};

export default OnlineIndicator;
