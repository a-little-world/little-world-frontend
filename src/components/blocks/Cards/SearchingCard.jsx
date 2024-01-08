import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  Card,
  CardSizes,
  Link,
  Text,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SearchingSvg from '../../../images/match-searching.svg';
import { USER_FORM_ROUTE } from '../../../routes';

const StyledCard = styled(Card)`
  margin: 0 auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  justify-content: space-around;

  > img {
    height: 140px;
  }
`;

const CancelSearchButton = styled(Button)`
  color: ${({ theme }) => theme.color.text.link};
`;

export function SearchingCard({ setShowCancel }) {
  const { t } = useTranslation();
  return (
    <StyledCard width={CardSizes.Small}>
      <img alt="" src={SearchingSvg} />
      <Text center>{t('matching_state_searching_trans')}</Text>
      {/* matchState === "pending" && t("matching_state_found_unconfirmed_trans") */}
      <Link
        buttonAppearance={ButtonAppearance.Primary}
        to={`/${USER_FORM_ROUTE}`}
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
