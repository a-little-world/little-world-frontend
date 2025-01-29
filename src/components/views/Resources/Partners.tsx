import { Card, Text } from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import LernFairLogo from '../../../images/partners/lern-fair-logo.svg';
import LernFairImage from '../../../images/partners/lern-fair-studying.jpg';
import Video from '../../atoms/Video.tsx';

const YT_EMBED_SLUG = 'lA4CIXDXXK8';

const ContentCard = styled(Card)`
  width: 100%;
  max-width: 1200px;
  padding-bottom: ${({ theme }) => theme.spacing.xlarge};
  gap: ${({ theme }) => theme.spacing.small};
`;

const Images = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.large}) {
       margin-bottom: ${theme.spacing.xxsmall};
  }`}
`;

const Image = styled.img`
  max-width: 272px;
  max-height: 200px;
  border-radius: ${({ theme }) => theme.radius.large};
  margin: auto;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.large}) {
       margin: unset;
       max-width: 320px;
  }`}
`;

const StudyImage = styled(Image)`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  width: 100%;
  object-fit: cover;
  max-width: 320px;
`;

const RegisterText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const Partners: FC = () => {
  const { t } = useTranslation();

  return (
    <ContentCard>
      <Images>
        <Image src={LernFairLogo} alt="lern-fair logo" />
        <StudyImage src={LernFairImage} alt="girl studying" />
      </Images>
      <Text>{t('resources.partners.lern_fair_intro')}</Text>
      <RegisterText>{t('resources.partners.lern_fair_link')}</RegisterText>
      <Video
        src={YT_EMBED_SLUG}
        title={t('resources.partners.lern_fair_video_title')}
      />
    </ContentCard>
  );
};

export default Partners;
