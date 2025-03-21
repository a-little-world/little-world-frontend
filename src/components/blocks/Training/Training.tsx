import {
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';

import useScrollToTop from '../../../hooks/useScrollToTop.tsx';
import { TRAININGS_ROUTE, getAppRoute } from '../../../routes.ts';
import Stepper from '../../atoms/Stepper.tsx';
import Video from '../../atoms/Video.tsx';
import {
  CheckInText,
  Container,
  ContentCard,
  Description,
} from './Training.styles.tsx';
import { SLUG_TO_ID, TRAININGS_DATA } from './constants.ts';

function getTrainingDataBySlug(slug?: string) {
  if (!slug) return null;
  const id = SLUG_TO_ID[slug];
  return id ? TRAININGS_DATA[id] : null;
}

const Training: FC = () => {
  const { trainingSlug } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();
  const training = getTrainingDataBySlug(trainingSlug);
  const [videoId, setVideoId] = useState(training?.video[0].id);

  if (!training || !videoId)
    return (
      <ContentCard>
        <Text
          color={theme.color.text.title}
          type={TextTypes.Body2}
          bold
          tag="h2"
        >
          {t('resources.trainings.not_found')}
        </Text>
        <Link to={getAppRoute(TRAININGS_ROUTE)}>
          {t('resources.trainings.return')}
        </Link>
      </ContentCard>
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
        <Description>
          <Text>{t(`resources.trainings.${training.id}.description`)}</Text>
          <Text>{t(`resources.trainings.${training.id}.teacher`)}</Text>

          {training.hasHandout ? (
            <Text>{t(`resources.trainings.${training.id}.handout`)}</Text>
          ) : (
            <Text>{t(`resources.trainings.${training.id}.glossary`)}</Text>
          )}
        </Description>
        <Stepper
          steps={training.video}
          activeStep={videoId}
          onSelectStep={handleVideoSelect}
        />
        {isLastStep && (
          <CheckInText center>{t('resources.self_check_in')}</CheckInText>
        )}
      </Container>
    </ContentCard>
  );
};

export default Training;
