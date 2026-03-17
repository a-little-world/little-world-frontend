import {
  CalendarIcon,
  ClockDashedIcon,
  ClockIcon,
  ExclamationIcon,
  Loading,
  LoadingSizes,
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
import useToast from '../../../hooks/useToast';
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
  HistoryTitle,
  NoHistoryDescription,
  RequestMatchButton,
} from './CallHistory.styles';

function getRequestMatchButtonLabel(
  confirmedMatch: boolean,
  matchingRequested: boolean,
  t: (key: string) => string,
): string {
  if (confirmedMatch) return t('call_history.confirmed_match');
  if (matchingRequested) return t('call_history.requested');
  return t('call_history.match_btn');
}

const CallHistoryList = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();
  const toast = useToast();
  const [requestingMatch, setRequestingMatch] = useState<string | null>(null);

  const handleRequestMatch = (matchId: string) => {
    setRequestingMatch(matchId);
    requestRandomCallMatch({
      matchId,
      onSuccess: () => {
        mutate(RANDOM_CALL_HISTORY_ENDPOINT);
        setRequestingMatch(null);
      },
      onError: (error: any) => {
        const message = error?.message || t('call_history.request_match_error');
        toast.showToast({
          headline: t('call_history.request_match_error_title'),
          title: message,
          icon: (
            <ExclamationIcon label="Exclamation icon" width={20} height={20} />
          ),
          showClose: false,
        });
        setRequestingMatch(null);
      },
    });
  };
  return (
    <CallHistoryListContainer>
      <HistoryTitle type={TextTypes.Body4} bold>
        {t('call_history.title')}
      </HistoryTitle>
      {isLoading ? (
        <Loading size={LoadingSizes.Medium} />
      ) : (
        data.map((item: any) => (
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
                {item.cannot_match_reason && (
                  <Text color={theme.color.text.error}>
                    {item.cannot_match_reason}
                  </Text>
                )}
              </CallInfo>
            </CallDetails>
            <RequestMatchButton
              disabled={
                !!item.cannot_match_reason ||
                item.matching_requested ||
                requestingMatch === item.id ||
                item.confirmed_match
              }
              onClick={() => handleRequestMatch(item.id)}
              loading={requestingMatch === item.id}
            >
              {getRequestMatchButtonLabel(
                item.confirmed_match,
                item.matching_requested,
                t,
              )}
            </RequestMatchButton>
          </CallEntry>
        ))
      )}
    </CallHistoryListContainer>
  );
};

const CallHistory = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useSWR(RANDOM_CALL_HISTORY_ENDPOINT);
  return (
    <Container className={className} $hasData={!isEmpty(data) || isLoading}>
      {(!data || isEmpty(data)) && !isLoading ? (
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
        <CallHistoryList data={data} isLoading={isLoading} />
      )}
    </Container>
  );
};
export default CallHistory;
