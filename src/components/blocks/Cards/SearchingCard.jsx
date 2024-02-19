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

import { formatTime } from '../../../helpers/date';
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

const getCardState = ({ hasMatch, hadPreMatchingCall, hasAppointment }) => {
  if (hasMatch) return 'matched';
  if (hadPreMatchingCall) return 'pre_match_call_completed';
  if (hasAppointment) return 'pre_match_call_booked';
  return 'pre_match_call_not_booked';
};

export function SearchingCard({
  calComAppointmentLink,
  hasMatch,
  hadPreMatchingCall,
  preMatchingAppointment,
  setShowCancel,
}) {
  const { t } = useTranslation();
  const cardState = getCardState({
    hasMatch,
    hadPreMatchingCall,
    hasAppointment: !!preMatchingAppointment,
  });
  console.log({ preMatchingAppointment });
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
            <SearchingImage
              alt="searching image"
              src={SearchingSvg}
              $hasMatch={hasMatch}
            />
          ) : (
            <MatchingCallImage alt="matching call image" src={AppointmentSvg} />
          )}
          <Text center>{t(`searching_card.${cardState}_info_1`)}</Text>
          <Note center>{t(`searching_card.${cardState}_info_2`)}</Note>
          {cardState === 'pre_match_call_booked' && (
            <Text type={TextTypes.Body4} bold>
              {formatTime(new Date(preMatchingAppointment.start_time))} -{' '}
              {formatTime(new Date(preMatchingAppointment.end_time))}
            </Text>
          )}
        </>
      )}

      {hadPreMatchingCall || hasMatch ? (
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
          data-cal-link={calComAppointmentLink}
          data-cal-config='{"layout":"month_view"}'
          onClick={() => null}
          size={ButtonSizes.Stretch}
        >
          {t(`searching_card.${cardState}_cta`)}
        </Button>
      )}
    </StyledCard>
  );
}

export default SearchingCard;
