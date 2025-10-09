import {
  ButtonAppearance,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';

import useScrollToTop from '../../../../hooks/useScrollToTop';
import { TRAININGS_ROUTE, getAppRoute } from '../../../../router/routes';
import Stepper from '../../../atoms/Stepper';
import Video from '../../../atoms/Video';
import { TRAININGS_DATA, TRAINING_IDS, getDataBySlug } from '../constants';
import {
  Container,
  ContentCard,
  NotFoundCard,
  VideoDescription,
} from '../shared.styles';
import { CheckInText } from './Trainings.styles';

const Training: FC = () => {
  const { trainingSlug } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();
  const training = getDataBySlug(TRAININGS_DATA, trainingSlug);
  const [videoId, setVideoId] = useState(training?.video[0].id);

  if (!training || !videoId)
    return (
      <NotFoundCard>
        <Text
          color={theme.color.text.title}
          type={TextTypes.Body2}
          tag="h2"
          bold
          center
        >
          {t('resources.trainings.not_found')}
        </Text>
        <Link
          to={getAppRoute(TRAININGS_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
        >
          {t('resources.trainings.return')}
        </Link>
      </NotFoundCard>
    );

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
    scrollToTop();
  };

  const title = training.video.find(item => item.id === videoId)!.label;
  const isLastStep = videoId === last(training.video)?.id;

  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {title}
      </Text>
      <Container>
        <Video src={videoId} title={title} />
        <VideoDescription>
          <Text>{t(`resources.trainings.${training.id}.description`)}</Text>
          {training.hasHandout && (
            <Text>{t(`resources.trainings.${training.id}.handout`)}</Text>
          )}
          <Text>{t(`resources.trainings.${training.id}.glossary`)}</Text>
          <Text>{t(`resources.trainings.${training.id}.teacher`)}</Text>
        </VideoDescription>
        <Stepper
          steps={training.video}
          activeStep={videoId}
          onSelectStep={handleVideoSelect}
        />
        {isLastStep && training.id === TRAINING_IDS.intercultural && (
          <CheckInText center>{t('resources.self_check_in')}</CheckInText>
        )}
      </Container>
    </ContentCard>
  );
};

export default Training;
