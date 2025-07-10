import { Modal } from '@a-little-world/little-world-design-system';
import React, { ReactNode, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { submitCallFeedback } from '../../../api/livekit.ts';
import {
  useActiveCallStore,
  useCallSetupStore,
  usePostCallSurveyStore,
} from '../../../features/stores/index.ts';
import {
  ACTIVE_CALL_ROOMS_ENDPOINT,
  MATCHES_ENDPOINT,
} from '../../../features/swr/index.ts';
import { blockIncomingCall } from '../../../features/swr/wsBridgeMutations.ts';
import useModalManager, { ModalTypes } from '../../../hooks/useModalManager.ts';
import '../../../main.css';
import CallSetup from '../Calls/CallSetup.tsx';
import IncomingCall from '../Calls/IncomingCall.tsx';
import { MatchCardComponent } from '../Cards/MatchCard.tsx';
import MobileNavBar from '../MobileNavBar.jsx';
import PostCallSurvey from '../PostCallSurvey/PostCallSurvey.tsx';
import Sidebar from '../Sidebar.jsx';

const isViewportHeight = ['chat'];

const Wrapper = styled.div<{ $isVH: boolean }>`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-sizing: border-box;

  ${({ $isVH }) =>
    $isVH &&
    css`
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
  const { openModal, closeModal, isModalOpen } = useModalManager();

  const page = location.pathname.split('/')[2] || 'main';
  const isVH = isViewportHeight.includes(page);
  const { data: matches, error } = useSWR(MATCHES_ENDPOINT, {
    revalidateOnMount: true,
  });
  const { data: activeCallRooms } = useSWR(ACTIVE_CALL_ROOMS_ENDPOINT);
  const activeCallRoom = activeCallRooms?.[0];
  const { callSetup } = useCallSetupStore();
  const { postCallSurvey } = usePostCallSurveyStore();
  const { activeCall } = useActiveCallStore();

  // Zustand store hooks
  const { initCallSetup } = useCallSetupStore();
  const { removePostCallSurvey } = usePostCallSurveyStore();

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const showNewMatch = Boolean(matches?.unconfirmed?.results?.length);
  console.log({ showNewMatch, matches, error });
  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    if (activeCallRoom?.uuid) {
      openModal(ModalTypes.INCOMING_CALL.id);
    } else if (isModalOpen(ModalTypes.INCOMING_CALL.id)) closeModal();
  }, [activeCallRoom?.uuid]);

  useEffect(() => {
    if (callSetup) {
      openModal(ModalTypes.CALL_SETUP.id);
    } else if (isModalOpen(ModalTypes.CALL_SETUP.id)) closeModal();
  }, [callSetup]);

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

  useEffect(() => {
    if (!callSetup && !activeCall) {
      document.body.classList.remove('hide-mobile-header');
    }
  }, [callSetup, activeCall]);

  const onAnswerCall = () => {
    initCallSetup({ userId: activeCallRoom?.partner?.id });
    closeModal();
  };

  const onRejectCall = () => {
    if (activeCallRoom?.partner?.id) {
      blockIncomingCall(activeCallRoom.partner.id);
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

  return (
    <Wrapper $isVH={isVH}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />

      <Content $isVH={isVH}>{children || <Outlet />}</Content>

      <Modal open={isModalOpen(ModalTypes.CALL_SETUP.id)} locked>
        <CallSetup onClose={closeModal} userPk={callSetup?.userId} />
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
