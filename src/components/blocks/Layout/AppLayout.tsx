import { Modal } from '@a-little-world/little-world-design-system';
import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { submitCallFeedback } from '../../../api/livekit';
import { pagesWithViewportHeight } from '../../../constants/index';
import {
  useCallSetupStore,
  useConnectedCallStore,
  usePostCallSurveyStore,
} from '../../../features/stores';
import {
  ACTIVE_CALL_ROOMS_ENDPOINT,
  MATCHES_ENDPOINT,
} from '../../../features/swr/index';
import { blockIncomingCall } from '../../../features/swr/wsBridgeMutations';
import useModalManager, { ModalTypes } from '../../../hooks/useModalManager';
import CallSetup from '../Calls/CallSetup';
import IncomingCall from '../Calls/IncomingCall';
import { MatchCardComponent } from '../Cards/MatchCard';
import MobileNavBar from '../MobileNavBar';
import PostCallSurvey from '../PostCallSurvey/PostCallSurvey';
import Sidebar from '../Sidebar';

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
  const { openModal, closeModal, isModalOpen } = useModalManager();

  const page = location.pathname.split('/')[2] || 'main';
  const isVH = pagesWithViewportHeight.includes(page);
  const { data: matches } = useSWR(MATCHES_ENDPOINT, {
    revalidateOnMount: true,
  });
  const { data: activeCallRooms } = useSWR(ACTIVE_CALL_ROOMS_ENDPOINT);
  const activeCallRoom = activeCallRooms?.[0];
  const { postCallSurvey } = usePostCallSurveyStore();
  const { disconnectedFrom, disconnectFromCall } = useConnectedCallStore();

  // Zustand store hooks
  const { initCallSetup, callSetup, cancelCallSetup } = useCallSetupStore();
  const { removePostCallSurvey } = usePostCallSurveyStore();

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const showNewMatch = Boolean(matches?.unconfirmed?.results?.length);

  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    if (
      activeCallRoom?.room_uuid &&
      activeCallRoom.room_uuid !== disconnectedFrom
    ) {
      openModal(ModalTypes.INCOMING_CALL.id);
    } else if (isModalOpen(ModalTypes.INCOMING_CALL.id)) closeModal();
  }, [activeCallRoom?.uuid, disconnectedFrom]);

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
    } else if (isModalOpen(ModalTypes.CALL_SETUP.id)) closeModal();
  }, [callSetup?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const shouldShowMatchModal = Boolean(
      matches?.proposed?.results?.length ||
      matches?.unconfirmed?.results?.length,
    );

    if (shouldShowMatchModal) {
      openModal(ModalTypes.MATCH.id);
    } else if (isModalOpen(ModalTypes.MATCH.id)) closeModal();
  }, [matches]); // eslint-disable-line

  useEffect(() => {
    if (postCallSurvey) {
      openModal(ModalTypes.POST_CALL_SURVEY.id);
    } else if (isModalOpen(ModalTypes.POST_CALL_SURVEY.id)) closeModal();
  }, [postCallSurvey]);

  const onAnswerCall = () => {
    initCallSetup({ userId: activeCallRoom?.partner?.id });
    closeModal();
  };

  const onRejectCall = () => {
    if (activeCallRoom?.partner?.id) {
      disconnectFromCall(activeCallRoom.room_uuid); // ensure call doesn't re-appear
      blockIncomingCall(activeCallRoom.partner.id, activeCallRoom.room_uuid);
    }
    closeModal();
  };

  const closePostCallSurvey = () => {
    removePostCallSurvey();
    closeModal();
  };

  // submitted even if user closes modal
  const submitPostCallSurvey = ({
    rating,
    review,
    onError,
  }: {
    rating?: number;
    review?: string;
    onError?: () => void;
  } = {}) => {
    // Do not submit when user closes modal without giving rating
    if (rating || postCallSurvey?.rating)
      submitCallFeedback({
        reviewId: postCallSurvey?.review_id,
        liveSessionId: postCallSurvey?.live_session_id,
        rating: rating || postCallSurvey?.rating,
        review: review || postCallSurvey?.review,
        onSuccess: closePostCallSurvey,
        onError: onError ?? (() => null),
      });
    else closePostCallSurvey();
  };

  const closeCallSetup = () => {
    cancelCallSetup();
    closeModal();
  };

  return (
    <Wrapper $isVH={isVH}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
        isVH={isVH}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />

      <Content $isVH={isVH}>{children || <Outlet />}</Content>

      <Modal open={isModalOpen(ModalTypes.CALL_SETUP.id)} locked>
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
          userPk={callSetup?.userId}
        />
      </Modal>

      <Modal
        open={isModalOpen(ModalTypes.POST_CALL_SURVEY.id)}
        onClose={submitPostCallSurvey}
      >
        <PostCallSurvey onSubmit={submitPostCallSurvey} />
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

      <Modal
        open={isModalOpen(ModalTypes.MATCH.id)}
        onClose={closeModal}
        locked={showNewMatch}
      >
        <MatchCardComponent
          showNewMatch={showNewMatch}
          matchId={
            matches?.proposed?.results?.length
              ? matches?.proposed.results[0].id
              : matches?.unconfirmed.results[0]?.id
          }
          profile={
            matches?.proposed?.results?.length
              ? matches?.proposed.results[0].partner
              : matches?.unconfirmed.results[0]?.partner
          }
          onClose={closeModal}
        />
      </Modal>
    </Wrapper>
  );
};

export default FullAppLayout;
