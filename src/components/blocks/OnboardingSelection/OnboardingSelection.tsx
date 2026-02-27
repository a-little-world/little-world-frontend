import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CalendarAddIcon,
  Card,
  CardFooter,
  CardSizes,
  Gradients,
  Link,
  Modal,
  Switch,
  TeacherImage,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT, getMatchEndpoint } from '../../../features/swr';
import { formatDate, formatTime } from '../../../helpers/date';
import { WALKTHROUGH_ROUTE, getAppRoute } from '../../../router/routes';
import OptionSelector from '../../atoms/OptionSelector';
import PartnerActionCard from '../Cards/PartnerActionCard';
import ProfileCard from '../Cards/ProfileCard';
import type { ReportType } from '../ReportForm/constants';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      flex-direction: row;
      align-items: flex-start;
      gap: ${theme.spacing.large};
      padding-bottom: ${theme.spacing.medium};
    }
  `}
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const LeadingTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

const LeadingDescription = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const OptionsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: ${theme.spacing.large};
    }
  `}
`;

const OptionCard = styled(Card)<{
  $fullWidth?: boolean;
  $inProgress?: boolean;
}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme, $inProgress }) =>
    $inProgress ? theme.color.border.selected : theme.color.border.subtle};
  background: ${({ theme }) => theme.color.surface.secondary};
  padding: ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.small};
  min-width: 0;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme, $inProgress }) =>
      $inProgress ? theme.color.border.success : theme.color.border.selected};
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
      max-width: none;
    `}
`;

const OptionTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  text-align: center;
`;

const OptionSubtext = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const SupportColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex-shrink: 0;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      width: 280px;
    }
  `}
`;

const SupportCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      flex-direction: column;
      justify-content: flex-start;
    }
  `}
`;

const Version2TabSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  gap: ${({ theme }) => theme.spacing.medium};
`;

/** Segmented control: muted pill container with rounded toggle buttons */
const SegmentedControl = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  background: ${({ theme }) => theme.color.surface.disabled};
  border-radius: 8px;
  width: 100%;
`;

const SegmentedControlButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  color: ${({ theme, $active }) =>
    $active ? theme.color.text.heading : theme.color.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.color.surface.primary : 'transparent'};
  box-shadow: ${({ $active }) =>
    $active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none'};

  &:hover {
    color: ${({ theme }) => theme.color.text.heading};
  }
`;

const TabPanel = styled.div`
  width: 100%;
`;

/** V2 detail card: subtle border, header with icon box, then content */
const OptionCardV2 = styled(OptionCard)`
  border-color: ${({ theme }) => theme.color.border.subtle};
  align-items: stretch;
  text-align: left;
`;

const CardHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const CardTitleV2 = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
  line-height: 1.3;
`;

const CardDescriptionV2 = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  line-height: 1.5;
`;

const CardContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  flex: 1;
`;

/** "What you'll accomplish" block */
const AccomplishSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const AccomplishHeading = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

const AccomplishList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const AccomplishListItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.secondary};
  line-height: 1.4;
`;

const CheckIcon = styled.span`
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  color: ${({ theme }) => theme.color.text.highlight};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

/** Two-column stats (Duration / Steps) */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.small};
`;

/** V1 only: grid so stat boxes fill available width */
const StatsGridV1 = styled(StatsGrid)`
  width: 100%;

  & > * {
    width: 100%;
    min-width: 0;
  }
`;

/** V1 only: single stat box full width */
const StatsGridFullWidth = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

const StatBox = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
`;

/** V1 only: stat box that fills the full-width grid cell */
const StatBoxFullWidth = styled(StatBox)`
  width: 100%;
  min-width: 0;
`;

const StatLabel = styled(Text)`
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const StatValue = styled(Text)`
  color: ${({ theme }) => theme.color.text.heading};
`;

function CheckCircleIcon() {
  return (
    <CheckIcon aria-hidden>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M5 8l2.5 2.5L11 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CheckIcon>
  );
}

const ActionsToolkitWrapper = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  z-index: 100;
  padding: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.color.surface.secondary};
  border: 2px solid ${({ theme }) => theme.color.border.moderate};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  min-width: 200px;
`;

/** Dummy appointment for toolkit "Appointment booked" override */
const MOCK_APPOINTMENT = {
  start_time: '2025-03-15T14:00:00.000Z',
  end_time: '2025-03-15T14:30:00.000Z',
};
const MOCK_JOIN_LINK = '#';

/** Mock walkthrough progress when "Walkthrough started" is on */
const MOCK_WALKTHROUGH_PROGRESS = { completed: 3, total: 9 };

type BookAppointmentOverride = {
  appointmentBooked: boolean;
  preMatchingAppointment: { start_time: string; end_time: string };
  preMatchingCallJoinLink: string;
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

type PartnerActionData = {
  type: ReportType;
  userPk: string;
  userName: string;
  matchId?: string;
};

type OnboardingTab = 'appointment' | 'walkthrough';

function BookAppointmentCardContent({
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
          <StatsGridV1>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.duration_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.appointment_duration')}
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.steps_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.appointment_steps')}
              </StatValue>
            </StatBox>
          </StatsGridV1>
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
        </>
      )}
    </>
  );
}

function WalkthroughCardContent({
  mockWalkthroughStarted,
  walkthroughProgress,
}: {
  mockWalkthroughStarted: boolean;
  walkthroughProgress: { completed: number; total: number };
}) {
  const { t } = useTranslation();
  return (
    <>
      <TeacherImage label="teacher image" height={60} />
      <OptionTitle type={TextTypes.Body3} bold>
        {mockWalkthroughStarted
          ? t('onboarding_selection.walkthrough_in_progress_heading')
          : t('onboarding_selection.walkthrough_title')}
      </OptionTitle>
      <OptionSubtext type={TextTypes.Body4}>
        {mockWalkthroughStarted
          ? t('onboarding_selection.walkthrough_in_progress_description')
          : t('onboarding_selection.walkthrough_subtext')}
      </OptionSubtext>
      {!mockWalkthroughStarted && (
        <>
          <StatsGridV1>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.duration_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.walkthrough_duration')}
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.steps_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.walkthrough_steps')}
              </StatValue>
            </StatBox>
          </StatsGridV1>
          <CardFooter>
            <Link
              buttonAppearance={ButtonAppearance.Primary}
              buttonSize={ButtonSizes.Stretch}
              to={getAppRoute(WALKTHROUGH_ROUTE)}
            >
              {t('onboarding_selection.walkthrough_cta')}
            </Link>
          </CardFooter>
        </>
      )}
      {mockWalkthroughStarted && (
        <>
          <StatsGridV1>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.duration_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.walkthrough_duration')}
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel type={TextTypes.Body4}>
                {t('onboarding_selection.steps_completed_label')}
              </StatLabel>
              <StatValue type={TextTypes.Body3} bold>
                {t('onboarding_selection.walkthrough_progress', {
                  completed: walkthroughProgress.completed,
                  total: walkthroughProgress.total,
                })}
              </StatValue>
            </StatBox>
          </StatsGridV1>
          <Link
            buttonAppearance={ButtonAppearance.Primary}
            buttonSize={ButtonSizes.Stretch}
            to={getAppRoute(WALKTHROUGH_ROUTE)}
          >
            {t('onboarding_selection.walkthrough_continue_cta')}
          </Link>
        </>
      )}
    </>
  );
}

function OnboardingSelectionVersion1({
  version,
  mockAppointmentBooked,
  mockWalkthroughStarted,
}: {
  version: number;
  mockAppointmentBooked: boolean;
  mockWalkthroughStarted: boolean;
}) {
  const { t, i18n } = useTranslation();
  const [partnerActionData, setPartnerActionData] =
    useState<PartnerActionData | null>(null);
  const [activeTab, setActiveTab] = useState<OnboardingTab>('appointment');

  const { data: matches } = useSWR(getMatchEndpoint(1));
  const supportResults = matches?.support?.results ?? [];

  const isVersion2 = version === 2;

  const appointmentOverride: BookAppointmentOverride | null =
    mockAppointmentBooked
      ? {
          appointmentBooked: true,
          preMatchingAppointment: MOCK_APPOINTMENT,
          preMatchingCallJoinLink: MOCK_JOIN_LINK,
        }
      : null;
  const walkthroughProgress = MOCK_WALKTHROUGH_PROGRESS;

  const leadingTitleKey =
    mockAppointmentBooked && mockWalkthroughStarted
      ? 'onboarding_selection.leading_both'
      : mockAppointmentBooked
        ? 'onboarding_selection.leading_appointment_booked'
        : mockWalkthroughStarted
          ? 'onboarding_selection.leading_walkthrough_started'
          : 'onboarding_selection.leading';

  const leadingDescriptionKey =
    mockAppointmentBooked && mockWalkthroughStarted
      ? 'onboarding_selection.leading_description_both'
      : mockAppointmentBooked
        ? 'onboarding_selection.leading_description_appointment_booked'
        : mockWalkthroughStarted
          ? 'onboarding_selection.leading_description_walkthrough_started'
          : 'onboarding_selection.leading_description';

  return (
    <Wrapper>
      <Main>
        <LeadingTitle type={TextTypes.Body1} bold tag="h2" center>
          {t(leadingTitleKey)}
        </LeadingTitle>
        <LeadingDescription type={TextTypes.Body4} center>
          {t(leadingDescriptionKey)}
        </LeadingDescription>
        {isVersion2 ? (
          <Version2TabSection>
            <SegmentedControl role="tablist">
              <SegmentedControlButton
                type="button"
                role="tab"
                aria-selected={activeTab === 'appointment'}
                $active={activeTab === 'appointment'}
                onClick={() => setActiveTab('appointment')}
              >
                {t('onboarding_selection.book_appointment_title')}
              </SegmentedControlButton>
              <SegmentedControlButton
                type="button"
                role="tab"
                aria-selected={activeTab === 'walkthrough'}
                $active={activeTab === 'walkthrough'}
                onClick={() => setActiveTab('walkthrough')}
              >
                {t('onboarding_selection.walkthrough_title')}
              </SegmentedControlButton>
            </SegmentedControl>
            <OptionCardV2 $fullWidth>
              <TabPanel role="tabpanel">
                {activeTab === 'appointment' ? (
                  <>
                    <MatchingCallImage
                      label="matching call image"
                      gradient={Gradients.Orange}
                      height={60}
                    />
                    <CardHeaderSection>
                      <CardTitleV2 type={TextTypes.Body2} bold>
                        {mockAppointmentBooked
                          ? t('onboarding_selection.appointment_booked_heading')
                          : t('onboarding_selection.book_appointment_title')}
                      </CardTitleV2>
                      <CardDescriptionV2>
                        {mockAppointmentBooked
                          ? t(
                              'onboarding_selection.appointment_booked_description',
                            )
                          : t('onboarding_selection.book_appointment_subtext')}
                      </CardDescriptionV2>
                    </CardHeaderSection>
                    <CardContentSection>
                      {!mockAppointmentBooked && (
                        <>
                          <AccomplishSection>
                            <AccomplishHeading type={TextTypes.Body4} tag="h4">
                              {t('onboarding_selection.what_you_accomplish')}
                            </AccomplishHeading>
                            <AccomplishList>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.appointment_accomplish_1',
                                  )}
                                </span>
                              </AccomplishListItem>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.appointment_accomplish_2',
                                  )}
                                </span>
                              </AccomplishListItem>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.appointment_accomplish_3',
                                  )}
                                </span>
                              </AccomplishListItem>
                            </AccomplishList>
                          </AccomplishSection>
                          <StatsGrid>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.duration_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t('onboarding_selection.appointment_duration')}
                              </StatValue>
                            </StatBox>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.steps_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t('onboarding_selection.appointment_steps')}
                              </StatValue>
                            </StatBox>
                          </StatsGrid>
                          <BookAppointmentOption
                            override={appointmentOverride}
                          />
                        </>
                      )}
                      {mockAppointmentBooked && appointmentOverride && (
                        <>
                          <StatsGrid>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.date_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {formatDate(
                                  new Date(
                                    appointmentOverride.preMatchingAppointment.start_time,
                                  ),
                                  'cccc, do LLLL',
                                  i18n.language,
                                )}
                              </StatValue>
                            </StatBox>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.time_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {formatTime(
                                  new Date(
                                    appointmentOverride.preMatchingAppointment.start_time,
                                  ),
                                )}{' '}
                                –{' '}
                                {formatTime(
                                  new Date(
                                    appointmentOverride.preMatchingAppointment.end_time,
                                  ),
                                )}
                              </StatValue>
                            </StatBox>
                          </StatsGrid>
                          <Link
                            buttonAppearance={ButtonAppearance.Primary}
                            buttonSize={ButtonSizes.Stretch}
                            to={appointmentOverride.preMatchingCallJoinLink}
                          >
                            {t(
                              'searching_card.pre_match_call_booked_join_call',
                            )}
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
                        </>
                      )}
                    </CardContentSection>
                  </>
                ) : (
                  <>
                    <TeacherImage label="teacher image" height={60} />
                    <CardHeaderSection>
                      <CardTitleV2 type={TextTypes.Body2} bold>
                        {mockWalkthroughStarted
                          ? t(
                              'onboarding_selection.walkthrough_in_progress_heading',
                            )
                          : t('onboarding_selection.walkthrough_title')}
                      </CardTitleV2>
                      <CardDescriptionV2>
                        {mockWalkthroughStarted
                          ? t(
                              'onboarding_selection.walkthrough_in_progress_description',
                            )
                          : t('onboarding_selection.walkthrough_subtext')}
                      </CardDescriptionV2>
                    </CardHeaderSection>
                    <CardContentSection>
                      {!mockWalkthroughStarted && (
                        <>
                          <AccomplishSection>
                            <AccomplishHeading type={TextTypes.Body4} tag="h4">
                              {t('onboarding_selection.what_you_accomplish')}
                            </AccomplishHeading>
                            <AccomplishList>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.walkthrough_accomplish_1',
                                  )}
                                </span>
                              </AccomplishListItem>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.walkthrough_accomplish_2',
                                  )}
                                </span>
                              </AccomplishListItem>
                              <AccomplishListItem>
                                <CheckCircleIcon />
                                <span>
                                  {t(
                                    'onboarding_selection.walkthrough_accomplish_3',
                                  )}
                                </span>
                              </AccomplishListItem>
                            </AccomplishList>
                          </AccomplishSection>
                          <StatsGrid>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.duration_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t('onboarding_selection.walkthrough_duration')}
                              </StatValue>
                            </StatBox>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.steps_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t('onboarding_selection.walkthrough_steps')}
                              </StatValue>
                            </StatBox>
                          </StatsGrid>
                        </>
                      )}
                      {mockWalkthroughStarted ? (
                        <>
                          <StatsGrid>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t('onboarding_selection.duration_label')}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t('onboarding_selection.walkthrough_duration')}
                              </StatValue>
                            </StatBox>
                            <StatBox>
                              <StatLabel type={TextTypes.Body4}>
                                {t(
                                  'onboarding_selection.steps_completed_label',
                                )}
                              </StatLabel>
                              <StatValue type={TextTypes.Body3} bold>
                                {t(
                                  'onboarding_selection.walkthrough_progress',
                                  {
                                    completed: walkthroughProgress.completed,
                                    total: walkthroughProgress.total,
                                  },
                                )}
                              </StatValue>
                            </StatBox>
                          </StatsGrid>
                          <Link
                            buttonAppearance={ButtonAppearance.Primary}
                            buttonSize={ButtonSizes.Stretch}
                            to={getAppRoute(WALKTHROUGH_ROUTE)}
                          >
                            {t('onboarding_selection.walkthrough_continue_cta')}
                          </Link>
                        </>
                      ) : (
                        <CardFooter>
                          <Link
                            buttonAppearance={ButtonAppearance.Primary}
                            buttonSize={ButtonSizes.Stretch}
                            to={getAppRoute(WALKTHROUGH_ROUTE)}
                          >
                            {t('onboarding_selection.walkthrough_cta')}
                          </Link>
                        </CardFooter>
                      )}
                    </CardContentSection>
                  </>
                )}
              </TabPanel>
            </OptionCardV2>
          </Version2TabSection>
        ) : (
          <OptionsRow>
            <OptionCard
              width={CardSizes.Medium}
              $inProgress={mockAppointmentBooked}
            >
              <BookAppointmentCardContent override={appointmentOverride} />
            </OptionCard>
            <OptionCard
              width={CardSizes.Medium}
              $inProgress={mockWalkthroughStarted}
            >
              <WalkthroughCardContent
                mockWalkthroughStarted={mockWalkthroughStarted}
                walkthroughProgress={walkthroughProgress}
              />
            </OptionCard>
          </OptionsRow>
        )}
      </Main>
      <SupportColumn>
        {supportResults.length > 0 && (
          <SupportCards>
            {supportResults.map(
              (match: { partner: any; id: string; chatId: string }) => (
                <ProfileCard
                  key={match.partner.id}
                  userPk={match.partner.id}
                  profile={match.partner}
                  isDeleted={match.partner.isDeleted}
                  isSelf={false}
                  isMatch={!match.partner.isSupport}
                  matchId={match.id}
                  openPartnerModal={params =>
                    setPartnerActionData({
                      ...params,
                      type: params.type as ReportType,
                    })
                  }
                  isOnline={match.partner.isOnline}
                  isSupport={match.partner.isSupport}
                  chatId={match.chatId}
                  onProfile={false}
                />
              ),
            )}
          </SupportCards>
        )}
      </SupportColumn>
      <Modal
        open={Boolean(partnerActionData)}
        onClose={() => setPartnerActionData(null)}
      >
        {!!partnerActionData && (
          <PartnerActionCard
            data={{
              matchId: partnerActionData.matchId ?? '',
              userName: partnerActionData.userName,
              type: partnerActionData.type,
            }}
            onClose={() => setPartnerActionData(null)}
          />
        )}
      </Modal>
    </Wrapper>
  );
}

function ActionsToolkit({
  version,
  onVersionChange,
  mockAppointmentBooked,
  onAppointmentBookedChange,
  mockWalkthroughStarted,
  onWalkthroughStartedChange,
}: {
  version: number;
  onVersionChange: (v: number) => void;
  mockAppointmentBooked: boolean;
  onAppointmentBookedChange: (checked: boolean) => void;
  mockWalkthroughStarted: boolean;
  onWalkthroughStartedChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <ActionsToolkitWrapper>
      <div>
        <Text type={TextTypes.Body4}>
          {t('onboarding_selection.toolkit_version')}
        </Text>
        <OptionSelector
          options={[
            { value: 1, label: 'V1' },
            { value: 2, label: 'V2' },
          ]}
          value={version}
          onChange={onVersionChange}
          ariaLabelPrefix={t('onboarding_selection.toolkit_version')}
        />
      </div>

      <div>
        <Switch
          id="toolkit-appointment-booked"
          checked={mockAppointmentBooked}
          onCheckedChange={onAppointmentBookedChange}
          label={t('onboarding_selection.toolkit_appointment_booked')}
          labelInline
        />
        <Switch
          id="toolkit-walkthrough-started"
          checked={mockWalkthroughStarted}
          onCheckedChange={onWalkthroughStartedChange}
          label={t('onboarding_selection.toolkit_walkthrough_started')}
          labelInline
        />
      </div>
    </ActionsToolkitWrapper>
  );
}

function OnboardingSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const versionParam = searchParams.get('version');
  const version = versionParam === '2' ? 2 : 1;

  const [mockAppointmentBooked, setMockAppointmentBooked] = useState(false);
  const [mockWalkthroughStarted, setMockWalkthroughStarted] = useState(false);

  const setVersion = (v: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('version', String(v));
      return next;
    });
  };

  return (
    <>
      <ActionsToolkit
        version={version}
        onVersionChange={setVersion}
        mockAppointmentBooked={mockAppointmentBooked}
        onAppointmentBookedChange={setMockAppointmentBooked}
        mockWalkthroughStarted={mockWalkthroughStarted}
        onWalkthroughStartedChange={setMockWalkthroughStarted}
      />
      <OnboardingSelectionVersion1
        version={version}
        mockAppointmentBooked={mockAppointmentBooked}
        mockWalkthroughStarted={mockWalkthroughStarted}
      />
    </>
  );
}

export default OnboardingSelection;
