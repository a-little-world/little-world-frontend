import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  Card,
  CardSizes,
  ClockDashedIcon,
  Gradients,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SearchingSvg from '../../../images/match-searching.svg';
import { USER_FORM_ROUTE, getAppRoute } from '../../../routes';
import Logo, { LogoText } from '../../atoms/Logo';
import { PROFILE_CARD_HEIGHT } from './ProfileCard';

const StyledCard = styled(Card)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  justify-content: center;
  order: 0;
  height: ${PROFILE_CARD_HEIGHT};

  > img {
    height: 140px;
  }
`;

const WelcomeTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.link};
`;

const CancelSearchButton = styled(Button)`
  color: ${({ theme }) => theme.color.text.link};
`;

const PendingIcon = styled(ClockDashedIcon)`
  color: ${({ theme }) => theme.color.surface.highlight};
`;

export function SearchingCard({ setShowCancel, hasMatch }) {
  const { t } = useTranslation();
  return (
    <StyledCard width={CardSizes.Small}>
      {hasMatch ? (
        <>
          <img alt="" src={SearchingSvg} />
          <Text center>{t('matching_state_searching_trans')}</Text>
        </>
      ) : (
        <>
          <WelcomeTitle tag="h3" type={TextTypes.Body1} bold center>
            Welcome to
            <br />
            Little World
          </WelcomeTitle>
          <PendingIcon height={48} width={48} />
          <Text>
            We are busy finding the best match for you. You'll receive a
            notification once we have!
          </Text>
          <Text>
            Please note this can take a few weeks, so we appreciate your
            patience.
          </Text>
        </>
      )}

      <Link
        buttonAppearance={ButtonAppearance.Primary}
        to={getAppRoute(USER_FORM_ROUTE)}
      >
        {t('cp_modify_search')}
      </Link>
      <CancelSearchButton
        variation={ButtonVariations.Inline}
        onClick={() => setShowCancel(true)}
      >
        {t('cp_cancel_search')}
      </CancelSearchButton>
    </StyledCard>
  );
}

export default SearchingCard;
