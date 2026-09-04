import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { Modal } from '@a-little-world/little-world-design-system';
import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import {
  dismissSurvey,
  markSurveyShown,
  PendingSurvey,
  submitSurvey,
  SurveyAnswers,
} from '../../../api/surveys';
import { pagesWithViewportHeight, USER_TYPES } from '../../../constants/index';
import {
  useCallSetupStore,
  useConnectedCallStore,
} from '../../../features/stores';
import useModalManagerStore, {
  ModalTypes,
} from '../../../features/stores/modalManager';
import {
  ACTIVE_CALL_ROOMS_ENDPOINT,
  MATCHES_ENDPOINT,
  PENDING_SURVEY_ENDPOINT,
  USER_ENDPOINT,
} from '../../../features/swr/index';
import { blockIncomingCall } from '../../../features/swr/wsBridgeMutations';
import { getAppRoute, ONBOARDING_ROUTE } from '../../../router/routes';
import LoadingScreen from '../../atoms/LoadingScreen';
import CallSetup from '../Calls/CallSetup';
import IncomingCall from '../Calls/IncomingCall';
import MatchModal from '../Matching/MatchModal';
import MobileNavBar from '../MobileNavBar';
import Sidebar from '../Sidebar';
import Survey, { hasRequiredAnswers } from '../Survey/Survey';

const Wrapper = styled.div<{ $isVH: boolean }>`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;

  ${({ $isVH }) =>
    $isVH &&
    css`
      height: 100vh;
      max-height: 100vh;
    `}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
      flex-direction: row;
      gap: ${theme.spacing.small};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.large};
      gap: ${theme.spacing.large};
    }
  `};
`;

const Content = styled.section<{ $isVH: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  min-width: 0;
  flex: 1;
  background-color: ${({ theme }) => theme.color.surface.background};

  ${({ theme, $isVH }) => css`
    ${$isVH &&
    css`
      overflow: hidden;
      padding-bottom: ${theme.spacing.xxsmall};
    `}
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
      gap: ${theme.spacing.small};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      gap: ${theme.spacing.medium};
    }
  `};
`;

export const FullAppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openModal, closeModal, dismissModal, isModalOpen } =
    useModalManagerStore();

  const { data: user, isLoading: isUserLoading } = useSWR(USER_ENDPOINT);
  const onboardingBasePath = getAppRoute(ONBOARDING_ROUTE);
  const isOnOnboardingRoute =
    location.pathname === onboardingBasePath ||
    location.pathname.startsWith(`${onboardingBasePath}/`);
  const shouldRedirectVolunteerToOnboarding =
    user?.profile?.user_type === USER_TYPES.volunteer &&
    !user?.isOnboarded &&
    !isOnOnboardingRoute;

  const subPath = location.pathname.split('/').slice(2).join('/');
  const isVH = pagesWithViewportHeight.some(
    route => subPath === route || subPath.startsWith(`${route}/`),
  );
  const { data: matches } = useSWR(MATCHES_ENDPOINT, {
    revalidateOnMount: true,
  });
  const { data: activeCallRooms } = useSWR(ACTIVE_CALL_ROOMS_ENDPOINT);
  const activeCallRoom = activeCallRooms?.[0];
  const { disconnectedFromSession, disconnectFromCall } =
    useConnectedCallStore();

  // Zustand store hooks
  const { initCallSetup, callSetup, cancelCallSetup } = useCallSetupStore();

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const { data: pendingSurveyData, mutate: refetchPendingSurvey } = useSWR(
    PENDING_SURVEY_ENDPOINT,
  );
  const pendingSurvey: PendingSurvey | null = pendingSurveyData?.survey ?? null;
  const surveyAnswersRef = useRef<SurveyAnswers>({});
  const acknowledgedSurveyId = useRef<number | null>(null);
  const [surveyError, setSurveyError] = useState<string | null>(null);

  const unconfirmedMatch = matches?.unconfirmed?.results?.[0] ?? null;
  const proposals = matches?.proposed?.results ?? [];

  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    if (
      activeCallRoom?.room_uuid &&
      activeCallRoom.room_uuid !== disconnectedFromSession
    ) {
      openModal(ModalTypes.INCOMING_CALL.id);
    } else dismissModal(ModalTypes.INCOMING_CALL.id);
  }, [activeCallRoom?.uuid, disconnectedFromSession]);

  // Initialize call setup from query param on page load
  useEffect(() => {
    const callSetupUserId = searchParams.get('call-setup');
    if (callSetupUserId && !callSetup) {
      initCallSetup({ userId: callSetupUserId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Add query param when call setup is initiated
  useEffect(() => {
    if (callSetup?.userId) {
      const currentCallSetupParam = searchParams.get('call-setup');
      if (currentCallSetupParam !== callSetup.userId) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('call-setup', callSetup.userId);
          return newParams;
        });
      }
    }
  }, [callSetup?.userId, searchParams, setSearchParams]);

  useEffect(() => {
    if (callSetup?.userId) {
      openModal(ModalTypes.CALL_SETUP.id);
    } else dismissModal(ModalTypes.CALL_SETUP.id);
  }, [callSetup?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const shouldShowMatchModal = Boolean(
      matches?.proposed?.results?.length ||
      matches?.unconfirmed?.results?.length,
    );

    if (shouldShowMatchModal) {
      openModal(ModalTypes.MATCH.id);
    } else dismissModal(ModalTypes.MATCH.id);
  }, [matches]); // eslint-disable-line

  // Polling is the whole delivery mechanism. A route change is the natural moment to look:
  // leaving a call navigates, so the post-call survey arrives without needing a live socket.
  useEffect(() => {
    refetchPendingSurvey();
  }, [location.pathname, refetchPendingSurvey]);

  useEffect(() => {
    if (!pendingSurvey) {
      dismissModal(ModalTypes.SURVEY.id);
      return;
    }

    openModal(ModalTypes.SURVEY.id);
    setSurveyError(null);
    surveyAnswersRef.current = {};

    // Confirms the card reached the user, which is what the offer count is measured against.
    if (acknowledgedSurveyId.current !== pendingSurvey.id) {
      acknowledgedSurveyId.current = pendingSurvey.id;
      markSurveyShown(pendingSurvey.id).catch(() => null);
    }
  }, [pendingSurvey?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAnswerCall = () => {
    initCallSetup({ userId: activeCallRoom?.partner?.id });
    closeModal();
  };

  const onRejectCall = () => {
    if (activeCallRoom?.partner?.id) {
      disconnectFromCall({
        sessionId: activeCallRoom.room_uuid,
        partnerId: activeCallRoom.partner.id,
      }); // ensure call doesn't re-appear
      blockIncomingCall(activeCallRoom.partner.id, activeCallRoom.room_uuid);
    }
    closeModal();
  };

  const handleSurveySubmit = async (answers: SurveyAnswers) => {
    if (!pendingSurvey) return;
    try {
      await submitSurvey({ surveyId: pendingSurvey.id, answers });
      closeModal();
      await refetchPendingSurvey();
    } catch (error: any) {
      setSurveyError(error?.message ?? null);
    }
  };

  /**
   * Closing the modal is not the same as declining: an answer the user already gave is worth
   * keeping, so a complete answer set is submitted and only an empty one is a dismissal.
   */
  const handleSurveyClose = async () => {
    if (!pendingSurvey) {
      closeModal();
      return;
    }

    const answers = surveyAnswersRef.current;
    if (hasRequiredAnswers(pendingSurvey.questions, answers)) {
      await handleSurveySubmit(answers);
      return;
    }

    closeModal();
    await dismissSurvey(pendingSurvey.id).catch(() => null);
    await refetchPendingSurvey();
  };

  const handleSurveyAnswersChange = useCallback((answers: SurveyAnswers) => {
    surveyAnswersRef.current = answers;
  }, []);

  if (isUserLoading && !user) {
    return (
      <Wrapper $isVH={isVH}>
        <LoadingScreen />
      </Wrapper>
    );
  }

  if (shouldRedirectVolunteerToOnboarding) {
    return <Navigate to={onboardingBasePath} replace />;
  }

  return (
    <Wrapper $isVH={isVH}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
        isVH={isVH}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />

      <Content $isVH={isVH}>{children || <Outlet />}</Content>

      <Modal
        open={isModalOpen(ModalTypes.CALL_SETUP.id)}
        onClose={() => {
          cancelCallSetup();
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('call-setup');
            return newParams;
          });
          closeModal();
        }}
      >
        <CallSetup
          onClose={() => {
            cancelCallSetup();
            setSearchParams(prev => {
              const newParams = new URLSearchParams(prev);
              newParams.delete('call-setup');
              return newParams;
            });
            closeModal();
          }}
          userPk={callSetup?.userId as string}
        />
      </Modal>

      <Modal
        open={isModalOpen(ModalTypes.SURVEY.id) && !!pendingSurvey}
        onClose={handleSurveyClose}
      >
        {!!pendingSurvey && (
          <Survey
            // Keyed so a second survey starts with empty answers rather than the previous ones.
            key={pendingSurvey.id}
            survey={pendingSurvey}
            onAnswersChange={handleSurveyAnswersChange}
            onSubmit={handleSurveySubmit}
            submitError={surveyError}
          />
        )}
      </Modal>
      <Modal
        open={isModalOpen(ModalTypes.INCOMING_CALL.id)}
        onClose={onRejectCall}
      >
        <IncomingCall
          userPk={activeCallRoom?.partner.id}
          userProfile={activeCallRoom?.partner}
          onAnswerCall={onAnswerCall}
          onRejectCall={onRejectCall}
        />
      </Modal>

      <MatchModal
        open={isModalOpen(ModalTypes.MATCH.id)}
        onClose={closeModal}
        unconfirmedMatch={unconfirmedMatch}
        proposals={proposals}
      />
    </Wrapper>
  );
};

export default FullAppLayout;
