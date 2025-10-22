import {
  Button,
  CalendarIcon,
  ClockDashedIcon,
  ClockIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { RANDOM_CALL_HISTORY_ENDPOINT } from '../../../features/swr';
import { formatDate, formatTime } from '../../../helpers/date';
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
} from './CallHistory.styles';

const CallHistoryList = ({ data }: { data: any }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();

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
              size={'xsmall'}
              imageType={item.image_type}
            />
            <CallInfo>
              <Text type={TextTypes.Body4} bold>
                {item.name}
              </Text>
              <CallDateTime>
                <CallDate>
                  <CalendarIcon label="Calendar icon" width={16} height={16} />
                  <Text>
                    {formatDate(new Date(item.date), 'd MMMM, p', language)}
                  </Text>
                </CallDate>
                <CallTime>
                  <ClockIcon label="Clock icon" width={16} height={16} />
                  <Text>
                    {t('call_history.duration')}:{' '}
                    {formatTime(new Date(item.duration))}
                  </Text>
                </CallTime>
              </CallDateTime>
              {item.cannot_match && (
                <Text color={theme.color.text.error}>
                  {t('call_history.cannot_match')}
                </Text>
              )}
            </CallInfo>
          </CallDetails>
          <Button disabled={item.cannot_match}>
            {t('call_history.match_btn')}
          </Button>
        </CallEntry>
      ))}
    </CallHistoryListContainer>
  );
};

const CallHistory = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { data } = useSWR(RANDOM_CALL_HISTORY_ENDPOINT, () => [
    {
      name: 'John Doe',
      date: '2025-01-01',
      image: 'https://via.placeholder.com/150',
      cannot_match: false,
    },
    {
      name: 'Jane Doe',
      date: '2025-01-02',
      image: 'https://via.placeholder.com/151',
      cannot_match: true,
    },
  ]);
  return (
    <Container className={className} $hasData={!isEmpty(data)}>
      {isEmpty(data) ? (
        <>
          <NoHistoryDescription>
            <Text>{t('call_history.no_history')}</Text>
          </NoHistoryDescription>
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
