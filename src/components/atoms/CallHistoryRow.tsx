import {
  CallIncomingIcon,
  CallOutgoingIcon,
  PhoneIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { formatDate } from '../../helpers/date';

// 'unknown' is a real state, not a fallback: 15% of sessions have no recorded
// initiator, and showing those as outgoing told both participants they placed the call.
export type CallDirection = 'outgoing' | 'incoming' | 'unknown';

const DIRECTION_ICON = {
  outgoing: CallOutgoingIcon,
  incoming: CallIncomingIcon,
  unknown: PhoneIcon,
} as const;

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

  const dateLabel = formatDate(startedAt, 'EEEE, dd/MM/yyyy', i18n.language);

  const Icon = DIRECTION_ICON[direction];

  return (
    <Row className={className}>
      <IconWrap aria-hidden>
        <Icon label="" width={20} height={20} color={theme.color.text.accent} />
      </IconWrap>
      <Middle>
        <Text type={TextTypes.Body5} tag="span">
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
      <Duration type={TextTypes.Body5} tag="span" bold>
        {t('match_overview.call_duration', {
          count: durationMinutes,
          minutes: durationMinutes,
        })}
      </Duration>
    </Row>
  );
}

export default CallHistoryRow;
