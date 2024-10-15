import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { last } from 'lodash';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import useScrollToTop from '../../../hooks/useScrollToTop.tsx';
import Stepper from '../../atoms/Stepper.tsx';
import Video from '../../atoms/Video.tsx';

const VIDEOS = {
  interculturalCommunication: [
    {
      id: 'HEAtdAeYiQg?si=CFfTat_UccuT-OL6',
      label: 'Interkulturelle Kommunikation - Achtsamer Umgang',
    },
    {
      id: 'aEVKGlXfNzk?si=dqJ5osXnDpHZ_rcq',
      label: 'Interkulturelle Kommunikation - Selbstreflexion',
    },
    {
      id: 'NmzP_hBtWmU?si=TAnA_ukURlcjIxD_',
      label: 'Interkulturelle Kommunikation - Fremdreflexion',
    },
    {
      id: 'tVmQYvID-4A?si=rhxinzEdDZITbA5Y',
      label: 'Interkulturelle Kommunikation - Umgang miteinander',
    },
    {
      id: 'RFIqBk84ckc?si=7BMf1jEvXfkfSKiK',
      label:
        'Interkulturelle Kommunikation - Theorie muss sein: Kulturdimensionen',
    },
    {
      id: 'aaN4Htfkp4I?si=fy88MDx4-y7RNC-j',
      label: 'Interkulturelle Kommunikation - Sensibilisierung',
    },
  ],
};

const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) =>
    `
      gap: ${theme.spacing.small};
      // flex-wrap: no-wrap;
      @media (min-width: ${theme.breakpoints.medium}) {
        gap: ${theme.spacing.medium};
      }`};
`;

const CheckInText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xsmall};
  span {
    font-size: 1.125rem;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border-top: 1px solid ${({ theme }) => theme.color.border.subtle};
  padding-top: ${({ theme }) => theme.spacing.small};

  ${({ theme }) =>
    `
  @media (min-width: ${theme.breakpoints.medium}) {
   padding-top: ${theme.spacing.medium};
  }`};
`;

const Trainings: FC = () => {
  const { t } = useTranslation();
  const scrollToTop = useScrollToTop();
  const [videoId, setVideoId] = useState(
    VIDEOS.interculturalCommunication[0].id,
  );
  const theme = useTheme();

  const handleVideoSelect = (id: string) => {
    setVideoId(id);
    scrollToTop();
  };
  const title = VIDEOS.interculturalCommunication.find(
    item => item.id === videoId,
  )!.label;

  const isLastStep = videoId === last(VIDEOS.interculturalCommunication)?.id;
  return (
    <ContentCard>
      <Text color={theme.color.text.title} type={TextTypes.Body2} bold tag="h2">
        {title}
      </Text>
      <Container>
        <Video src={videoId} title={title} />
        <Description>
          <Text>{t('resources.description_communication')}</Text>
          <Text>{t('resources.teacher_communication')}</Text>
          <Text>{t('resources.method_communication')}</Text>
          <Text>{t('resources.glossary_communication')}</Text>
        </Description>
        <Stepper
          steps={VIDEOS.interculturalCommunication}
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

export default Trainings;
