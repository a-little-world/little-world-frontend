import {
  ButtonAppearance,
  ButtonSizes,
  Card,
  Link,
  Text,
} from '@a-little-world/little-world-design-system';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import LernFairLogo from '../../../images/partners/lern-fair-logo.svg';
import LernFairImage from '../../../images/partners/lern-fair-studying.jpg';

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

const PresentationText = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const PresentationLink = styled(Link)`
  align-self: center;
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
      <PresentationText center>
        {t('resources.partners.lern_fair_presentation')}
      </PresentationText>

      <PresentationLink
        buttonAppearance={ButtonAppearance.Primary}
        buttonSize={ButtonSizes.Small}
        href="https://rwth.zoom.us/j/95770913582?pwd=U3g5QWtCZXd3SFpxVC8zVmlWN1RtUT09"
        target="_blank"
      >
        {t('resources.partners.lern_fair_presentation_link')}
      </PresentationLink>
    </ContentCard>
  );
};

export default Partners;
