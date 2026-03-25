import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CalendarAddIcon,
  CardFooter,
  Gradients,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr';
import { formatDate, formatTime } from '../../../helpers/date';
import {
  OnboardingOptionComparison,
  OptionSubtext,
  OptionTitle,
  StackedCardFooter,
  StatBoxFullWidth,
  StatValue,
  StatsGridFullWidth,
} from './OnboardingSelection.styles';

export type BookAppointmentOverride = {
  appointmentBooked: boolean;
  preMatchingAppointment: { start_time: string; end_time: string };
  preMatchingCallJoinLink: string;
};

const MatchingCallImage = styled(CalendarAddIcon)`
  height: 60px;
  width: 60px;
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
  flex-shrink: 0;
`;

const Note = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
`;

const AppointmentButton = styled(Button)<{ $isLink?: boolean }>`
  ${({ theme, $isLink }) =>
    $isLink &&
    css`
      color: ${theme.color.text.link};
    `}
`;

const getCardState = ({
  hasMatch,
  hadPreMatchingCall,
  hasAppointment,
}: {
  hasMatch: boolean;
  hadPreMatchingCall: boolean;
  hasAppointment: boolean;
}) => {
  if (hasMatch) return 'matched';
  if (hadPreMatchingCall) return 'pre_match_call_completed';
  if (hasAppointment) return 'pre_match_call_booked';
  return 'pre_match_call_not_booked';
};

function BookAppointmentOption({
  override,
}: {
  override?: BookAppointmentOverride | null;
}) {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const { data: user } = useSWR(USER_ENDPOINT);
  const hasMatch = user?.hasMatch ?? false;
  const hadPreMatchingCall = user?.hadPreMatchingCall ?? false;

  const useOverride = override?.appointmentBooked ?? false;
  const preMatchingAppointment = useOverride
    ? override!.preMatchingAppointment
    : user?.preMatchingAppointment;
  const calComAppointmentLink = user?.calComAppointmentLink;
  const preMatchingCallJoinLink = useOverride
    ? override!.preMatchingCallJoinLink
    : user?.preMatchingCallJoinLink;

  const cardState = useOverride
    ? 'pre_match_call_booked'
    : getCardState({
        hasMatch,
        hadPreMatchingCall,
        hasAppointment: !!user?.preMatchingAppointment,
      });
  const isBookedState = cardState === 'pre_match_call_booked';

  return (
    <>
      {isBookedState && (
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
      )}
      {isBookedState && (
        <Link
          buttonAppearance={ButtonAppearance.Primary}
          buttonSize={ButtonSizes.Stretch}
          to={preMatchingCallJoinLink}
        >
          {t(`searching_card.${cardState}_join_call`)}
        </Link>
      )}
      <CardFooter>
        <AppointmentButton
          data-cal-link={calComAppointmentLink}
          data-cal-config='{"layout":"month_view"}'
          onClick={() => null}
          size={ButtonSizes.Stretch}
          appearance={
            isBookedState
              ? ButtonAppearance.Secondary
              : ButtonAppearance.Primary
          }
          $isLink={isBookedState}
        >
          {t(`searching_card.${cardState}_cta`)}
        </AppointmentButton>
      </CardFooter>
    </>
  );
}

function AppointmentOption({
  override,
}: {
  override: BookAppointmentOverride | null;
}) {
  const { t, i18n } = useTranslation();
  const isBooked = override?.appointmentBooked ?? false;

  return (
    <>
      <MatchingCallImage
        label="matching call image"
        gradient={Gradients.Orange}
      />
      <OptionTitle type={TextTypes.Body3} bold>
        {isBooked
          ? t('onboarding_selection.appointment_booked_heading')
          : t('onboarding_selection.book_appointment_title')}
      </OptionTitle>
      <OptionSubtext type={TextTypes.Body4}>
        {isBooked
          ? t('onboarding_selection.appointment_booked_description')
          : t('onboarding_selection.book_appointment_subtext')}
      </OptionSubtext>
      {!isBooked && (
        <>
          <OnboardingOptionComparison variant="appointment" />
          <BookAppointmentOption override={override} />
        </>
      )}
      {isBooked && override && (
        <>
          <StatsGridFullWidth>
            <StatBoxFullWidth>
              <StatValue type={TextTypes.Body3} bold>
                {formatDate(
                  new Date(override.preMatchingAppointment.start_time),
                  'cccc, do LLLL',
                  i18n.language,
                )}
              </StatValue>
              <StatValue type={TextTypes.Body3} bold>
                {formatTime(
                  new Date(override.preMatchingAppointment.start_time),
                )}
                {' – '}
                {formatTime(new Date(override.preMatchingAppointment.end_time))}
              </StatValue>
            </StatBoxFullWidth>
          </StatsGridFullWidth>
          <StackedCardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={override.preMatchingCallJoinLink}
            >
              {t('searching_card.pre_match_call_booked_join_call')}
            </Link>
            <Button
              data-cal-link="#"
              data-cal-config='{"layout":"month_view"}'
              onClick={() => null}
              appearance={ButtonAppearance.Secondary}
              size={ButtonSizes.Stretch}
            >
              {t('searching_card.pre_match_call_booked_cta')}
            </Button>
          </StackedCardFooter>
        </>
      )}
    </>
  );
}

export default AppointmentOption;
