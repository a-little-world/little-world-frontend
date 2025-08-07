import {
  ButtonAppearance,
  ButtonSizes,
  Card,
  CardSizes,
  Link,
  MatchSearchingImage,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { BEGINNERS_ROUTE, getAppRoute } from '../../../router/routes.ts';
import { PROFILE_CARD_HEIGHT } from './ProfileCard.tsx';

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

const SearchingImage = styled(MatchSearchingImage)<{ $hasMatch?: boolean }>`
  height: 72px;
  margin-bottom: ${({ theme, $hasMatch }) =>
    $hasMatch ? '0' : theme.spacing.xxxsmall};
  flex-shrink: 0;
`;

export function LanguageLevelCard() {
  const { t } = useTranslation();

  return (
    <StyledCard width={CardSizes.Small}>
      <WelcomeTitle tag="h3" type={TextTypes.Body1} bold center>
        {t('language_level_card.title')}
      </WelcomeTitle>
      <SearchingImage label="searching for match image" />
      <Text center>{t('language_level_card.description')}</Text>

      <Link
        buttonAppearance={ButtonAppearance.Primary}
        buttonSize={ButtonSizes.Stretch}
        to={getAppRoute(BEGINNERS_ROUTE)}
      >
        {t('language_level_card.cta')}
      </Link>
    </StyledCard>
  );
}

export default LanguageLevelCard;
