import {
  CallIncomingIcon,
  CallOutgoingIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

export type CallDirection = 'outgoing' | 'incoming';

export interface CallHistoryRowProps {
  direction: CallDirection;
  startedAt: Date;
  durationMinutes: number;
  bothParticipated?: boolean;
  className?: string;
  showStatus?: boolean;
}

const Row = styled.li`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding: ${({ theme }) => theme.spacing.xsmall} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  list-style: none;

  &:last-child {
    border-bottom: none;
  }
`;

const IconWrap = styled.span`
  display: flex;
  color: ${({ theme }) => theme.color.text.accent};
`;

const Middle = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
`;

const Duration = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: ${({ theme }) => theme.spacing.xxxlarge};
`;

function CallHistoryRow({
  direction,
  startedAt,
  durationMinutes,
  bothParticipated = true,
  className,
  showStatus = true,
}: CallHistoryRowProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(startedAt);

  const Icon = direction === 'outgoing' ? CallOutgoingIcon : CallIncomingIcon;

  return (
    <Row className={className}>
      <IconWrap aria-hidden>
        <Icon label="" width={20} height={20} color={theme.color.text.accent} />
      </IconWrap>
      <Middle>
        <Text type={TextTypes.Body5} tag="span" bold>
          {dateLabel}
        </Text>
        {showStatus && (
          <Text type={TextTypes.Body6} tag="span">
            {bothParticipated
              ? t('match_overview.call_both')
              : t('match_overview.call_one_sided')}
          </Text>
        )}
      </Middle>
      <Duration type={TextTypes.Body5} tag="span">
        {t('match_overview.call_duration', {
          count: durationMinutes,
          minutes: durationMinutes,
        })}
      </Duration>
    </Row>
  );
}

export default CallHistoryRow;
