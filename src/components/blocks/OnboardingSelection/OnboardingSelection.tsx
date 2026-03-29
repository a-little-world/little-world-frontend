import {
  Card,
  CardSizes,
  Modal,
  Stepper,
  StepperOrientations,
  Switch,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { FORM_ONBOARDING_ROUTE, getAppRoute } from '../../../router/routes';
import SupportWidget from '../../atoms/SupportWidget';
import PartnerActionCard from '../Cards/PartnerActionCard';
import type { ReportType } from '../ReportForm/constants';
import AppointmentOption, {
  BookAppointmentOverride,
} from './AppointmentOption';
import WalkthroughOption from './WalkthroughOption';

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

const StepperWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
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

function getLeadingCopyKeys(
  mockAppointmentBooked: boolean,
  mockWalkthroughStarted: boolean,
): { titleKey: string; descriptionKey: string } {
  if (mockAppointmentBooked && mockWalkthroughStarted) {
    return {
      titleKey: 'onboarding_selection.leading_both',
      descriptionKey: 'onboarding_selection.leading_description_both',
    };
  }
  if (mockAppointmentBooked) {
    return {
      titleKey: 'onboarding_selection.leading_appointment_booked',
      descriptionKey:
        'onboarding_selection.leading_description_appointment_booked',
    };
  }
  if (mockWalkthroughStarted) {
    return {
      titleKey: 'onboarding_selection.leading_walkthrough_started',
      descriptionKey:
        'onboarding_selection.leading_description_walkthrough_started',
    };
  }
  return {
    titleKey: 'onboarding_selection.leading',
    descriptionKey: 'onboarding_selection.leading_description',
  };
}

const ActionsToolkitWrapper = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.small};
  left: ${({ theme }) => theme.spacing.small};
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

type PartnerActionData = {
  type: ReportType;
  userPk: string;
  userName: string;
  matchId?: string;
};

//  <AccomplishSection>
/* <AccomplishHeading type={TextTypes.Body4} tag="h4">
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
</AccomplishSection> */

function ActionsToolkit({
  mockAppointmentBooked,
  onAppointmentBookedChange,
  mockWalkthroughStarted,
  onWalkthroughStartedChange,
}: {
  mockAppointmentBooked: boolean;
  onAppointmentBookedChange: (checked: boolean) => void;
  mockWalkthroughStarted: boolean;
  onWalkthroughStartedChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <ActionsToolkitWrapper>
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
  const location = useLocation();
  const isFormRoute = location.pathname === getAppRoute(FORM_ONBOARDING_ROUTE);
  const { t } = useTranslation();
  const [partnerActionData, setPartnerActionData] =
    useState<PartnerActionData | null>(null);
  const [mockAppointmentBooked, setMockAppointmentBooked] = useState(false);
  const [mockWalkthroughStarted, setMockWalkthroughStarted] = useState(false);

  const appointmentOverride: BookAppointmentOverride | null =
    mockAppointmentBooked
      ? {
          appointmentBooked: true,
          preMatchingAppointment: MOCK_APPOINTMENT,
          preMatchingCallJoinLink: MOCK_JOIN_LINK,
        }
      : null;
  const walkthroughProgress = MOCK_WALKTHROUGH_PROGRESS;

  const { titleKey: leadingTitleKey, descriptionKey: leadingDescriptionKey } =
    getLeadingCopyKeys(mockAppointmentBooked, mockWalkthroughStarted);
  const hasStartedOnboardingOption =
    mockAppointmentBooked || mockWalkthroughStarted;
  let stepFiveLabelKey = 'onboarding_selection.stepper_step5_start_onboarding';
  if (mockWalkthroughStarted) {
    stepFiveLabelKey = 'onboarding_selection.stepper_step5_quiz_started';
  } else if (mockAppointmentBooked) {
    stepFiveLabelKey = 'onboarding_selection.stepper_step5_appointment_booked';
  }
  const onboardingSteps = [
    { id: '1', label: t('onboarding_selection.stepper_step1_sign_in') },
    { id: '2', label: t('onboarding_selection.stepper_step2_confirm_email') },
    {
      id: '3',
      label: t('onboarding_selection.stepper_step3_complete_profile'),
    },
    {
      id: '4',
      label: t('onboarding_selection.stepper_step4_choose_onboarding'),
    },
    { id: '5', label: t(stepFiveLabelKey) },
  ];

  return (
    <>
      <ActionsToolkit
        mockAppointmentBooked={mockAppointmentBooked}
        onAppointmentBookedChange={setMockAppointmentBooked}
        mockWalkthroughStarted={mockWalkthroughStarted}
        onWalkthroughStartedChange={setMockWalkthroughStarted}
      />
      <Wrapper>
        <Main>
          <StepperWrapper>
            <Stepper
              steps={onboardingSteps}
              activeStepIndex={hasStartedOnboardingOption ? 4 : 3}
              orientation={StepperOrientations.Horizontal}
            />
          </StepperWrapper>

          <LeadingTitle type={TextTypes.Body1} bold tag="h2" center>
            {t(leadingTitleKey)}
          </LeadingTitle>
          <LeadingDescription type={TextTypes.Body4} center>
            {t(leadingDescriptionKey)}
          </LeadingDescription>
          <OptionsRow>
            <OptionCard
              width={CardSizes.Medium}
              $inProgress={mockWalkthroughStarted}
            >
              <WalkthroughOption
                isFormRoute={isFormRoute}
                mockWalkthroughStarted={mockWalkthroughStarted}
                walkthroughProgress={walkthroughProgress}
              />
            </OptionCard>
            <OptionCard
              width={CardSizes.Medium}
              $inProgress={mockAppointmentBooked}
            >
              <AppointmentOption override={appointmentOverride} />
            </OptionCard>
          </OptionsRow>
        </Main>
        {!isFormRoute && <SupportWidget />}
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
    </>
  );
}

export default OnboardingSelection;
