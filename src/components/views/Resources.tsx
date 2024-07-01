import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Stepper from '../atoms/Stepper.tsx';
import ContentSelector from '../blocks/ContentSelector.tsx';

const YT_EMBED_URL = 'https://www.youtube.com/embed/';

const Content = styled.div`
  ${({ theme }) =>
    `
    width: 100%;
    max-width: 1000px;
    padding: ${theme.spacing.xxsmall};
    @media (min-width: ${theme.breakpoints.medium}) {
     padding: 0;
    }`};
`;
const ContentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
`;

const VIDEOS = {
  interculturalCommunication: [
    {
      id: 'HEAtdAeYiQg?si=CFfTat_UccuT-OL6',
      label: 'Interkulturelle Kommunikation - Teil 1',
    },
    {
      id: 'aEVKGlXfNzk?si=dqJ5osXnDpHZ_rcq',
      label: 'Interkulturelle Kommunikation - Teil 2',
    },
    {
      id: 'NmzP_hBtWmU?si=TAnA_ukURlcjIxD_',
      label: 'Interkulturelle Kommunikation - Teil 3',
    },
    {
      id: 'tVmQYvID-4A?si=rhxinzEdDZITbA5Y',
      label: 'Interkulturelle Kommunikation - Teil 4',
    },
    {
      id: 'RFIqBk84ckc?si=7BMf1jEvXfkfSKiK',
      label: 'Interkulturelle Kommunikation - Teil 5',
    },
  ],
};

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
  overflow: hidden;
`;

const StyledIframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) =>
    `
      gap: ${theme.spacing.small};
      // flex-wrap: no-wrap;
      // @media (min-width: ${theme.breakpoints.medium}) {
      //   flex-direction: row;
      // }`};
`;

function Resources() {
  const { t } = useTranslation();

  const [subpage, selectSubpage] = useState('workshops');
  const [videoId, setVideoId] = useState(
    VIDEOS.interculturalCommunication[0].id,
  );
  const title = VIDEOS.interculturalCommunication.find(
    item => item.id === videoId,
  )?.label;

  return (
    <>
      {/* <PageHeader text={t('resources.title')} /> */}
      <ContentSelector
        selection={subpage}
        setSelection={selectSubpage}
        use={'resources'}
      />
      <Content>
        <ContentCard>
          <Text type={TextTypes.Body2} bold tag="h3">
            {title}
          </Text>
          <Container>
            <VideoContainer>
              <StyledIframe
                src={`${YT_EMBED_URL}${videoId}`}
                frameBorder="0"
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></StyledIframe>
            </VideoContainer>

            <Stepper
              steps={VIDEOS.interculturalCommunication}
              activeStep={videoId}
              onSelectStep={setVideoId}
            />
          </Container>
        </ContentCard>
      </Content>
    </>
  );
}

export default Resources;
