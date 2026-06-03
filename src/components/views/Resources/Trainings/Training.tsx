import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';

import useScrollToTop from '../../../../hooks/useScrollToTop';
import Stepper from '../../../atoms/Stepper';
import Video from '../../../atoms/Video';
import { TRAININGS_DATA, TRAINING_IDS, getDataBySlug } from '../constants';
import { Container, ContentCard, VideoDescription } from '../shared.styles';
import DynamicCourse from './DynamicCourse';
import { CheckInText } from './Trainings.styles';

// ---------------------------------------------------------------------------
// Hardcoded (video-only) training view
// ---------------------------------------------------------------------------

type HardcodedTrainingData =
  (typeof TRAININGS_DATA)[keyof typeof TRAININGS_DATA];

const HardcodedTraining: FC<{ training: HardcodedTrainingData }> = ({
  training,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();
  const [videoId, setVideoId] = useState(training.video[0].id);

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

// ---------------------------------------------------------------------------
// Route-level component — dispatches to hardcoded or dynamic view
// ---------------------------------------------------------------------------

const Training: FC = () => {
  const { trainingSlug } = useParams();
  const hardcoded = getDataBySlug(TRAININGS_DATA, trainingSlug);

  if (hardcoded) {
    return <HardcodedTraining training={hardcoded} />;
  }

  return <DynamicCourse slug={trainingSlug} />;
};

export default Training;
