import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
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
import AppointmentSvg from '../../../images/new-appointment.svg';
import { USER_FORM_ROUTE, getAppRoute } from '../../../routes';
import { PROFILE_CARD_HEIGHT } from './ProfileCard';

const StyledCard = styled(Card)`
  align-items: center;
  border-color: ${({ theme }) => theme.color.border.subtle};
  gap: ${({ theme, $hasMatch }) =>
    $hasMatch ? theme.spacing.small : theme.spacing.xxsmall};
  justify-content: center;
  order: ${({ $hasMatch }) => ($hasMatch ? 1 : 0)};
  height: ${PROFILE_CARD_HEIGHT};
`;

const WelcomeTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  max-width: 270px; // ensures it wraps correctly
`;

const CancelSearchButton = styled(Button)`
  color: ${({ theme }) => theme.color.text.link};
`;

const SearchingImage = styled.img`
  height: ${({ $hasMatch }) => ($hasMatch ? '140px' : '80px')};
  margin-bottom: ${({ theme, $hasMatch }) =>
    $hasMatch ? '0' : theme.spacing.xxxsmall};
`;

const MatchingCallImage = styled.img`
  height: 80px;
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
`;

const Note = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
`;

export function SearchingCard({ setShowCancel, hasMatch, hadPreMatchingCall }) {
  const { t } = useTranslation();
  return (
    <StyledCard width={CardSizes.Small} $hasMatch={hasMatch}>
      {hasMatch ? (
        <>
          <SearchingImage
            alt="searching image"
            src={SearchingSvg}
            $hasMatch={hasMatch}
          />
          <Text center>{t('matching_state_searching_trans')}</Text>
        </>
      ) : (
        <>
          <WelcomeTitle tag="h3" type={TextTypes.Body1} bold center>
            {t('searching_card.welcome')}
          </WelcomeTitle>
          {hadPreMatchingCall ? (
            <>
              <SearchingImage
                alt="searching image"
                src={SearchingSvg}
                $hasMatch={hasMatch}
              />
              <Text center>{t('searching_card.info_1')}</Text>
              <Note center>{t('searching_card.info_2')}</Note>
            </>
          ) : (
            <>
              <MatchingCallImage
                alt="matching call image"
                src={AppointmentSvg}
              />
              <Text center>{t('searching_card.pre_match_call_info_1')}</Text>
              <Note center>{t('searching_card.pre_match_call_info_2')}</Note>
            </>
          )}
        </>
      )}

      {hadPreMatchingCall ? (
        <>
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
        </>
      ) : (
        <Button
          data-cal-link="herr-duenschnlate-iiscv9/15min?email=herrduenschnlate%2B21211%40gmail.com&amp;hash=cfeb8c8e-e4b4-427e-923a-c1ca9eb242d1-1afa6cb2-7a39-4fe0-b453-101b58417819&amp;bookingcode=e155fdb1-c91d-4a96-b2e3-8fa0b399034b"
          data-cal-config='{"layout":"month_view"}'
          onClick={() => null}
          size={ButtonSizes.Stretch}
        >
          {t('searching_card.pre_match_call_cta')}
        </Button>
      )}
    </StyledCard>
  );
}

export default SearchingCard;
