import {
  CalendarIcon,
  ClockDashedIcon,
  ClockIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR, { mutate } from 'swr';

import { requestRandomCallMatch } from '../../../api/randomCalls';
import { RANDOM_CALL_HISTORY_ENDPOINT } from '../../../features/swr';
import { formatDate, formatDuration } from '../../../helpers/date';
import ProfileImage from '../../atoms/ProfileImage';
import {
  CallDate,
  CallDateTime,
  CallDetails,
  CallEntry,
  CallHistoryListContainer,
  CallInfo,
  CallTime,
  Container,
  NoHistoryDescription,
  RequestMatchButton,
} from './CallHistory.styles';

const CallHistoryList = ({ data }: { data: any }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();
  const [requestingMatch, setRequestingMatch] = useState<string | null>(null);

  const handleRequestMatch = async (matchId: string) => {
    setRequestingMatch(matchId);
    try {
      await requestRandomCallMatch(matchId);
      // Revalidate the history data to reflect the updated state
      mutate(RANDOM_CALL_HISTORY_ENDPOINT);
    } catch (error) {
      console.error('Failed to request match:', error);
      // TODO: Show error toast/notification to user
    } finally {
      setRequestingMatch(null);
    }
  };

  return (
    <CallHistoryListContainer>
      <Text type={TextTypes.Body4} bold>
        {t('call_history.title')}
      </Text>
      {data.map((item: any) => (
        <CallEntry key={item.id}>
          <CallDetails>
            <ProfileImage
              circle
              image={item.image}
              size="xsmall"
              imageType={item.image_type}
            />
            <CallInfo>
              <Text type={TextTypes.Body4} bold>
                {item.name}
              </Text>
              <CallDateTime>
                {item.date && (
                  <CallDate>
                    <CalendarIcon
                      label="Calendar icon"
                      width={16}
                      height={16}
                    />
                    <Text>
                      {formatDate(new Date(item.date), 'd MMMM, p', language)}
                    </Text>
                  </CallDate>
                )}
                {item.duration && (
                  <CallTime>
                    <ClockIcon label="Clock icon" width={16} height={16} />
                    <Text>
                      {t('call_history.duration')}:{' '}
                      {formatDuration(item.duration)}
                    </Text>
                  </CallTime>
                )}
              </CallDateTime>
              {item.cannot_match && (
                <Text color={theme.color.text.error}>
                  {t('call_history.cannot_match')}
                </Text>
              )}
            </CallInfo>
          </CallDetails>
          <RequestMatchButton
            disabled={
              item.cannot_match ||
              item.matching_requested ||
              requestingMatch === item.id
            }
            onClick={() => handleRequestMatch(item.id)}
          >
            {requestingMatch === item.id
              ? t('call_history.requesting')
              : item.matching_requested
              ? t('call_history.requested')
              : t('call_history.match_btn')}
          </RequestMatchButton>
        </CallEntry>
      ))}
    </CallHistoryListContainer>
  );
};

const CallHistory = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { data } = useSWR(RANDOM_CALL_HISTORY_ENDPOINT);

  return (
    <Container className={className} $hasData={!isEmpty(data)}>
      {!data || isEmpty(data) ? (
        <>
          <ClockDashedIcon label="No call history" />
          <Text bold tag="h3" type={TextTypes.Body4}>
            {t('call_history.title_no_history')}
          </Text>
          <NoHistoryDescription>
            {t('call_history.description_no_history')}
          </NoHistoryDescription>
        </>
      ) : (
        <CallHistoryList data={data} />
      )}
    </Container>
  );
};
export default CallHistory;
