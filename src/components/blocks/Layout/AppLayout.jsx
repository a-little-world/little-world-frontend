import { Modal } from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  blockIncomingCall,
  initCallSetup,
  setMatchRejected,
} from '../../../features/userData';
import { useSelector } from '../../../hooks/index.ts';
import '../../../main.css';
import CallSetup from '../Calls/CallSetup.tsx';
import IncomingCall from '../Calls/IncomingCall.tsx';
import { MatchCardComponent } from '../Cards/MatchCard.tsx';
import MobileNavBar from '../MobileNavBar';
import PostCallSurvey from '../PostCallSurvey/PostCallSurvey.tsx';
import Sidebar from '../Sidebar';

const isViewportHeight = ['chat'];

const Wrapper = styled.div`
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

const Content = styled.section`
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

export const FullAppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const page = location.pathname.split('/')[2] || 'main';
  const isVH = isViewportHeight.includes(page);
  const matches = useSelector(state => state.userData.matches);
  const matchRejected = useSelector(state => state.userData.matchRejected);
  const activeCallRooms = useSelector(state => state.userData.activeCallRooms);
  const callSetup = useSelector(state => state.userData.callSetup);
  const postCallSurvey = useSelector(state => state.userData.postCallSurvey);
  const activeCall = useSelector(state => state.userData.activeCall);
  const [matchModalOpen, setMatchModalOpen] = useState(
    Boolean(
      matches?.proposed?.items?.length ||
        matches?.unconfirmed?.items?.length ||
        matchRejected,
    ),
  );

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
    setMatchModalOpen(
      Boolean(
        matches?.proposed?.items?.length ||
          matches?.unconfirmed?.items?.length ||
          matchRejected,
      ),
    );
  }, [matches, matchRejected]);

  useEffect(() => {
    if (!callSetup && !activeCall) {
      document.body.classList.remove('hide-mobile-header');
    }
  }, [callSetup, activeCall]);

  const onAnswerCall = () => {
    dispatch(initCallSetup({ userId: activeCallRooms[0]?.partner?.id }));
  };

  const onRejectCall = () => {
    dispatch(blockIncomingCall({ userId: activeCallRooms[0]?.partner?.id }));
  };

  const closeMatchModal = () => {
    if (matchRejected) dispatch(setMatchRejected(false));
    setMatchModalOpen(false);
  };

  return (
    <Wrapper $isVH={isVH}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />

      <Content $isVH={isVH}>{children || <Outlet />}</Content>

      <Modal open={callSetup} locked>
        <CallSetup userPk={callSetup?.userId} />
      </Modal>
      {/* need to still add close / onsubmit logic here */}
      <Modal open={postCallSurvey} onClose={() => null}>
        <PostCallSurvey onSubmit={() => null} />
      </Modal>
      <Modal
        open={activeCallRooms[0]?.uuid && !callSetup}
        onClose={onRejectCall}
      >
        <IncomingCall
          matchesInfo={dashboardVisibleMatches}
          userPk={activeCallRooms[0]?.partner.id}
          userProfile={activeCallRooms[0]?.partner}
          onAnswerCall={onAnswerCall}
          onRejectCall={onRejectCall}
        />
      </Modal>

      <Modal
        open={matchModalOpen}
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
