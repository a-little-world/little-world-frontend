import {
  ClockDashedIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import { Container, NoHistoryDescription } from './CallHistory.styles';

const CallHistory = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <Container className={className}>
      <ClockDashedIcon label="No call history" />
      <Text bold tag="h3" type={TextTypes.Body4}>
        {t('call_history.title_no_history')}
      </Text>
      <NoHistoryDescription>
        {t('call_history.description_no_history')}
      </NoHistoryDescription>
    </Container>
  );
};
export default CallHistory;
