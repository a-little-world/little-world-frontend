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
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr/index';
import { formatDate, formatTime } from '../../../helpers/date';
import SearchingSvg from '../../../images/match-searching.svg';
import AppointmentSvg from '../../../images/new-appointment.svg';
import { USER_FORM_ROUTES, getAppRoute } from '../../../router/routes';
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
  max-width: 280px; // ensures it wraps correctly
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

const AppointmentButton = styled(Button)`
  ${({ theme, $isLink }) =>
    $isLink &&
    css`
      color: ${theme.color.text.link};
    `}
`;

const getCardState = ({ hasMatch, hadPreMatchingCall, hasAppointment }) => {
  if (hasMatch) return 'matched';
  if (hadPreMatchingCall) return 'pre_match_call_completed';
  if (hasAppointment) return 'pre_match_call_booked';
  return 'pre_match_call_not_booked';
};

export function SearchingCard({ setShowCancel }) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const appointmentBtn = useRef();

  const { data: user } = useSWR(USER_ENDPOINT);
  const hasMatch = user?.hasMatch;
  const hadPreMatchingCall = user?.hadPreMatchingCall;
  const preMatchingAppointment = user?.preMatchingAppointment;
  const calComAppointmentLink = user?.calComAppointmentLink;
  const preMatchingCallJoinLink = user?.preMatchingCallJoinLink;

  const cardState = getCardState({
    hasMatch,
    hadPreMatchingCall,
    hasAppointment: !!preMatchingAppointment,
  });

  const isBookedState = cardState === 'pre_match_call_booked';

  useEffect(() => {
    if (!hadPreMatchingCall && !isBookedState && appointmentBtn?.current) {
      appointmentBtn.current?.click();
    }
  }, [hadPreMatchingCall, isBookedState]);

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
            {t(`searching_card.${cardState}_title`)}
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
          {isBookedState ? (
            <div>
              <Text center type={TextTypes.Body4} bold>
                {formatDate(
                  new Date(preMatchingAppointment?.start_time),
                  'cccc, do LLLL',
                  language,
                )}
              </Text>
              <Note center type={TextTypes.Body4} bold>
                {formatTime(new Date(preMatchingAppointment?.start_time))} -{' '}
                {formatTime(new Date(preMatchingAppointment?.end_time))}
              </Note>
            </div>
          ) : (
            <Note center>{t(`searching_card.${cardState}_info_2`)}</Note>
          )}
        </>
      )}

      {hadPreMatchingCall || hasMatch ? (
        <>
          <Link
            buttonAppearance={ButtonAppearance.Primary}
            buttonSize={ButtonSizes.Stretch}
            to={getAppRoute(USER_FORM_ROUTES.SELF_INFO_1)}
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
        <>
          {isBookedState && (
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={preMatchingCallJoinLink}
            >
              {t(`searching_card.${cardState}_join_call`)}
            </Link>
          )}
          <AppointmentButton
            ref={appointmentBtn}
            data-cal-link={calComAppointmentLink}
            data-cal-config='{"layout":"month_view"}'
            onClick={() => null}
            size={ButtonSizes.Stretch}
            variation={
              isBookedState ? ButtonVariations.Inline : ButtonVariations.Basic
            }
            $isLink={isBookedState}
          >
            {t(`searching_card.${cardState}_cta`)}
          </AppointmentButton>
        </>
      )}
    </StyledCard>
  );
}

export default SearchingCard;
