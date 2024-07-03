import {
  ButtonAppearance,
  Card,
  CardSizes,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SearchingSvg from '../../../images/match-searching.svg';
import {
  BEGINNERS_ROUTE,
  PROFILE_ROUTE,
  getAppRoute,
} from '../../../routes.jsx';
import { PROFILE_CARD_HEIGHT } from './ProfileCard.jsx';

const StyledCard = styled(Card)`
  align-items: center;
  border-color: ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme }) => theme.spacing.small};
  justify-content: center;
  order: 0;
  height: ${PROFILE_CARD_HEIGHT};
`;

const WelcomeTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  max-width: 270px; // ensures it wraps correctly
`;

const SearchingImage = styled.img`
  height: 80px;
  margin-bottom: ${({ theme, $hasMatch }) =>
    $hasMatch ? '0' : theme.spacing.xxxsmall};
`;

export function LanguageLevelCard() {
  const { t } = useTranslation();

  return (
    <StyledCard width={CardSizes.Small}>
      <WelcomeTitle tag="h3" type={TextTypes.Body1} bold center>
        {t('language_level_card.title')}
      </WelcomeTitle>
      <SearchingImage alt="searching image" src={SearchingSvg} />
      <Text center>{t('language_level_card.description')}</Text>

      <Link
        buttonAppearance={ButtonAppearance.Primary}
        to={getAppRoute(BEGINNERS_ROUTE)}
      >
        {t('language_level_card.cta')}
      </Link>
    </StyledCard>
  );
}

export default LanguageLevelCard;
