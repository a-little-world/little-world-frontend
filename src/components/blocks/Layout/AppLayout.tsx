import { Modal } from '@a-little-world/little-world-design-system';
import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { submitCallFeedback } from '../../../api/livekit.ts';
import {
  blockIncomingCall,
  initCallSetup,
  removePostCallSurvey,
  setMatchRejected,
} from '../../../features/userData.js';
import { useSelector } from '../../../hooks/index.ts';
import useModalManager, { ModalType } from '../../../hooks/useModalManager.ts';
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
  const dispatch = useDispatch();
  const { openModal, closeModal, isModalOpen } = useModalManager();

  const page = location.pathname.split('/')[2] || 'main';
  const isVH = isViewportHeight.includes(page);
  const matches = useSelector(state => state.userData.matches);
  const matchRejected = useSelector(state => state.userData.matchRejected);
  const activeCallRooms = useSelector(state => state.userData.activeCallRooms);
  const activeCall = activeCallRooms[0];
  const callSetup = useSelector(state => state.userData.callSetup);
  const postCallSurvey = useSelector(state => state.userData.postCallSurvey);
  const activeCall = useSelector(state => state.userData.activeCall);

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  const dashboardVisibleMatches = matches
    ? [...matches.support.items, ...matches.confirmed.items]
    : [];

  const showNewMatch = Boolean(
    matches?.unconfirmed?.items?.length && !matchRejected,
  );

  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    console.log('useEffect active call id', activeCall?.uuid)
    if (activeCall?.uuid) {
      openModal(ModalType.INCOMING_CALL.id);
    } else if (isModalOpen(ModalType.INCOMING_CALL.id)) closeModal();
  }, [activeCall?.uuid, openModal, closeModal, isModalOpen]);

  useEffect(() => {
    if (callSetup) {
      openModal(ModalType.CALL_SETUP.id);
    } else if (isModalOpen(ModalType.CALL_SETUP.id)) closeModal();
  }, [callSetup, openModal, isModalOpen, closeModal]);

  useEffect(() => {
    const shouldShowMatchModal = Boolean(
      matches?.proposed?.items?.length ||
        matches?.unconfirmed?.items?.length ||
        matchRejected,
    );

    if (shouldShowMatchModal) {
      openModal(ModalType.MATCH.id);
    } else if (isModalOpen(ModalType.MATCH.id)) closeModal();
  }, [matches, matchRejected]); // eslint-disable-line

  useEffect(() => {
    if (postCallSurvey) {
      openModal(ModalType.POST_CALL_SURVEY.id);
    } else if (isModalOpen(ModalType.POST_CALL_SURVEY.id)) closeModal();
  }, [postCallSurvey, openModal, isModalOpen, closeModal]);

  useEffect(() => {
    if (!callSetup && !activeCall) {
      document.body.classList.remove('hide-mobile-header');
    }
  }, [callSetup, activeCall]);

  const onAnswerCall = () => {
    dispatch(initCallSetup({ userId: activeCallRooms[0]?.partner?.id }));
    closeModal();
  };

  const onRejectCall = () => {
    dispatch(blockIncomingCall({ userId: activeCallRooms[0]?.partner?.id }));
    closeModal();
  };

  const closeMatchModal = () => {
    if (matchRejected) dispatch(setMatchRejected(false));
    closeModal();
  };

  const closePostCallSurvey = () => {
    dispatch(removePostCallSurvey());
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
  }) => {
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

      <Modal open={isModalOpen(ModalType.CALL_SETUP.id)} locked>
        <CallSetup onClose={closeModal} userPk={callSetup?.userId} />
      </Modal>

      <Modal
        open={isModalOpen(ModalType.POST_CALL_SURVEY.id)}
        onClose={submitPostCallSurvey}
      >
        <PostCallSurvey onSubmit={submitPostCallSurvey} />
      </Modal>
      <Modal
        open={isModalOpen(ModalType.INCOMING_CALL.id)}
        onClose={onRejectCall}
      >
        <IncomingCall
          matchesInfo={dashboardVisibleMatches}
          userPk={activeCall?.partner.id}
          userProfile={activeCall?.partner}
          onAnswerCall={onAnswerCall}
          onRejectCall={onRejectCall}
        />
      </Modal>

      <Modal
        open={isModalOpen(ModalType.MATCH.id)}
        onClose={closeMatchModal}
        locked={showNewMatch}
      >
        <MatchCardComponent
          showNewMatch={showNewMatch}
          matchId={
            matches?.proposed?.items?.length
              ? matches?.proposed.items[0].id
              : matches?.unconfirmed.items[0]?.id
          }
          profile={
            matches?.proposed?.items?.length
              ? matches?.proposed.items[0].partner
              : matches?.unconfirmed.items[0]?.partner
          }
          onClose={closeMatchModal}
        />
      </Modal>
    </Wrapper>
  );
};

export default FullAppLayout;
