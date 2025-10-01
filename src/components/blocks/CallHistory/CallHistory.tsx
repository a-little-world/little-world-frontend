import {
  ClockDashedIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import { Container } from './CallHistory.styles';

const CallHistory = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <ClockDashedIcon label="No call history" />
      <Text bold tag="h3" type={TextTypes.Body4}>
        {t('call_history.title_no_history')}
      </Text>
      <Text>{t('call_history.description_no_history')}</Text>
    </Container>
  );
};
export default CallHistory;
