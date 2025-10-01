import {
  Button,
  ButtonSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import randomCallsImage from '../../../images/item info.png';
import PanelImage from '../../atoms/PanelImage';
import CallHistory from '../../blocks/CallHistory/CallHistory';
import Instructions from '../../blocks/Instructions/Instructions';
import {
  Container,
  InfoPanel,
  InfoPanelText,
  Schedule,
} from './RandomCalls.styles';

const instructions = [
  {
    heading: 'random_calls.step_1.heading',
    description: 'random_calls.step_1.description',
  },
  {
    heading: 'random_calls.step_2.heading',
    description: 'random_calls.step_2.description',
  },
  {
    heading: 'random_calls.step_3.heading',
    description: 'random_calls.step_3.description',
  },
];

const randomCallsSchedule = [
  'Mittwoch – 18:00–20:00 Uhr',
  'Freitag – 10:00–12:00 Uhr',
];

const RandomCalls = () => {
  const { t } = useTranslation();
  const active = true;
  return (
    <Container>
      <InfoPanel>
        <PanelImage
          src={randomCallsImage}
          label={t('random_calls.image_label')}
          alt="random calls"
        />
        <InfoPanelText>
          <Text bold tag="h2" type={TextTypes.Body2}>
            {t('random_calls.title')}
          </Text>
          <Text>{t('random_calls.description')}</Text>
          <Text bold type={TextTypes.Body3}>
            {t('random_calls.active_heading')}
          </Text>
          <Schedule>
            <Text>{t('random_calls.schedule_heading')}</Text>
            {randomCallsSchedule.map(item => (
              <Text key={item}>{item}</Text>
            ))}
          </Schedule>
          <Button disabled={!active} width={ButtonSizes.Small}>
            {t(
              active
                ? 'random_calls.start_btn'
                : 'random_calls.start_btn_disabled',
            )}
          </Button>
        </InfoPanelText>
      </InfoPanel>
      <Instructions title={t('random_calls.title')} items={instructions} />
      <CallHistory />
    </Container>
  );
};

export default RandomCalls;
