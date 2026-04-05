import {
  Modal,
  Stepper,
  StepperOrientations,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { USER_TYPES } from '../../../constants';
import { USER_ENDPOINT } from '../../../features/swr';
import { getAppRoute } from '../../../router/routes';
import LoadingScreen from '../../atoms/LoadingScreen';
import PartnerActionCard from '../../blocks/Cards/PartnerActionCard';
import AppointmentOption from '../../blocks/Onboarding/AppointmentOption';
import WalkthroughOption from '../../blocks/Onboarding/WalkthroughOption';
import type { ReportType } from '../../blocks/ReportForm/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxsmall};
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
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin-bottom: ${theme.spacing.medium};
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
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const LeadingDescription = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  max-width: 1000px;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      margin-bottom: ${theme.spacing.medium};
    }
  `}
`;

const OptionsRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      justify-content: center;
      align-items: stretch;
      gap: ${theme.spacing.large};
    }
  `}
`;

function getLeadingCopyKeys(
  appointmentBooked: boolean,
  walkthroughStarted: boolean,
): { titleKey: string; descriptionKey: string } {
  if (appointmentBooked && walkthroughStarted) {
    return {
      titleKey: 'onboarding_selection.leading_both',
      descriptionKey: 'onboarding_selection.leading_description_both',
    };
  }
  if (appointmentBooked) {
    return {
      titleKey: 'onboarding_selection.leading_appointment_booked',
      descriptionKey:
        'onboarding_selection.leading_description_appointment_booked',
    };
  }
  if (walkthroughStarted) {
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

function OnboardingSelection() {
  const { t } = useTranslation();
  const [partnerActionData, setPartnerActionData] =
    useState<PartnerActionData | null>(null);
  const { data: user, isLoading } = useSWR(USER_ENDPOINT, {
    revalidateOnFocus: true,
    refreshInterval: 2000, // 2 seconds
  });
  const selfOnboardingStep = user?.selfOnboardingStepId;
  const preMatchingAppointment = user?.preMatchingAppointment;
  const hasAppointment = !!preMatchingAppointment?.start_time;

  const walkthroughProgress = user?.selfOnboardingProgress;

  const { titleKey: leadingTitleKey, descriptionKey: leadingDescriptionKey } =
    getLeadingCopyKeys(hasAppointment, !!selfOnboardingStep);

  let stepFiveLabelKey = 'onboarding_selection.stepper_step4_choose_onboarding';
  if (selfOnboardingStep) {
    stepFiveLabelKey = 'onboarding_selection.stepper_step4_quiz_started';
  } else if (selfOnboardingStep || hasAppointment) {
    stepFiveLabelKey = 'onboarding_selection.stepper_step4_appointment_booked';
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
      label: t(stepFiveLabelKey),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  if (user?.profile?.user_type === USER_TYPES.learner || user?.isOnboarded) {
    return <Navigate to={getAppRoute()} replace />;
  }

  return (
    <Wrapper>
      <Main>
        <StepperWrapper>
          <Stepper
            steps={onboardingSteps}
            activeStepIndex={3}
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
          <WalkthroughOption
            started={!!walkthroughProgress}
            progress={walkthroughProgress}
          />
          <AppointmentOption
            bookAppointmentLink={user?.calComAppointmentLink}
            joinCallLink={user?.preMatchingCallJoinLink}
            onboardingAppointment={preMatchingAppointment}
          />
        </OptionsRow>
      </Main>
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

export default OnboardingSelection;
