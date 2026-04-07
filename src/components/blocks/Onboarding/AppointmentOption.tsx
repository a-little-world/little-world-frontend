import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CalendarAddIcon,
  CardFooter,
  CardSizes,
  Gradients,
  Link,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { formatDate, formatTime } from '../../../helpers/date';
import {
  OptionCard,
  OptionSubtext,
  OptionTitle,
  StackedCardFooter,
  StatBoxFullWidth,
  StatValue,
  StatsGridFullWidth,
} from './Onboarding.styles';

const MatchingCallImage = styled(CalendarAddIcon)`
  height: 60px;
  width: 60px;
  margin-bottom: ${({ theme }) => theme.spacing.xxxsmall};
  flex-shrink: 0;
`;

const AppointmentButton = styled(Button)<{ $isLink?: boolean }>`
  ${({ theme, $isLink }) =>
    $isLink &&
    css`
      color: ${theme.color.text.link};
    `}
`;

const getCardState = ({ hasAppointment }: { hasAppointment: boolean }) => {
  if (hasAppointment) return 'pre_match_call_booked';
  return 'pre_match_call_not_booked';
};

function AppointmentOption({
  bookAppointmentLink,
  onboardingAppointment,
  joinCallLink,
}: {
  bookAppointmentLink?: string;
  onboardingAppointment?: { start_time: string; end_time: string };
  joinCallLink?: string;
}) {
  const { t, i18n } = useTranslation();
  const isBooked = !!onboardingAppointment?.start_time;

  const cardState = getCardState({ hasAppointment: isBooked });

  return (
    <OptionCard $inProgress={isBooked} width={CardSizes.Medium}>
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
        <CardFooter>
          <AppointmentButton
            data-cal-link={bookAppointmentLink}
            data-cal-config='{"layout":"month_view"}'
            onClick={() => null}
            size={ButtonSizes.Stretch}
            appearance={
              isBooked ? ButtonAppearance.Secondary : ButtonAppearance.Primary
            }
            $isLink={isBooked}
          >
            {t(`searching_card.${cardState}_cta`)}
          </AppointmentButton>
        </CardFooter>
      )}
      {isBooked && (
        <>
          <StatsGridFullWidth>
            <StatBoxFullWidth>
              <StatValue type={TextTypes.Body3} bold>
                {formatDate(
                  new Date(onboardingAppointment.start_time),
                  'cccc, do LLLL',
                  i18n.language,
                )}
              </StatValue>
              <StatValue type={TextTypes.Body3} bold>
                {formatTime(new Date(onboardingAppointment.start_time))}
                {' – '}
                {formatTime(new Date(onboardingAppointment.end_time))}
              </StatValue>
            </StatBoxFullWidth>
          </StatsGridFullWidth>
          <StackedCardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={joinCallLink}
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
    </OptionCard>
  );
}

export default AppointmentOption;
