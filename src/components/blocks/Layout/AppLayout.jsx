import { Modal } from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { initCallSetup } from '../../../features/userData';
import CallSetup from '../Calls/CallSetup.tsx';
import IncomingCall from '../Calls/IncomingCall.tsx';
import CancelSearchCard from '../Cards/CancelSearchCard';
import { MatchCardComponent } from '../Cards/MatchCard.tsx';
import MobileNavBar from '../MobileNavBar';
import Sidebar from '../Sidebar';
import { removeActiveTracks } from './helpers/video.ts';

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

// const AppLayout = ({ children, isVH, page }) => {
//   const [showSidebarMobile, setShowSidebarMobile] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     setShowSidebarMobile(false);
//   }, [location]);

//   return (
//     <Wrapper className={page ? `main-page show-${page}` : null} $isVH={isVH}>
//       <Sidebar
//         sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
//       />
//       <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
//       {children || <Outlet />}
//     </Wrapper>
//   );
// };

export const FullAppLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const page = location.pathname.split('/')[2] || 'main';
  const isVH = isViewportHeight.includes(page);
  const matches = useSelector(state => state.userData.matches);
  const activeCallRooms = useSelector(state => state.userData.activeCallRooms);
  const callSetup = useSelector(state => state.userData.callSetup);
  const activeCall = useSelector(state => state.userData.activeCall);

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [showCancelSearching, setShowCancelSearching] = useState(false);

  const dashboardVisibleMatches = matches
    ? [...matches.support.items, ...matches.confirmed.items]
    : [];

  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    if (!callSetup && !activeCall) {
      removeActiveTracks();
      document.body.classList.remove('hide-mobile-header');
    }
  }, [callSetup, activeCall]);

  const setCallSetupPartner = partner => {
    dispatch(initCallSetup({ userId: partner }));
  };

  const onAnswerCall = () => {
    setCallSetupPartner(activeCallRooms[0]?.partner?.id);
  };

  const onRejectCall = () => {
    dispatch(blockIncomingCall({ userId: activeCallRooms[0]?.partner?.id }));
  };

  return (
    <Wrapper className={page ? `main-page show-${page}` : null} $isVH={isVH}>
      <Sidebar
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />

      <Content $isVH={isVH}>{children || <Outlet />}</Content>

      <Modal open={callSetup} locked>
        <CallSetup
          userPk={callSetup?.userId}
          removeCallSetupPartner={() => {
            dispatch(cancelCallSetup());
            removeActiveTracks();
          }}
        />
      </Modal>
      <Modal
        open={incomingCalls[0]?.userId && !callSetup}
        onClose={onRejectCall}
      >
        <IncomingCall
          matchesInfo={dashboardVisibleMatches}
          userPk={incomingCalls[0]?.userId}
          onAnswerCall={onAnswerCall}
          onRejectCall={onRejectCall}
        />
      </Modal>
      {showCancelSearching && (
        <Modal
          open={showCancelSearching}
          onClose={() => setShowCancelSearching(false)}
        >
          <CancelSearchCard onClose={() => setShowCancelSearching(false)} />
        </Modal>
      )}
      <Modal
        open={
          matches?.proposed?.items?.length ||
          matches?.unconfirmed?.items?.length
        }
        locked={false}
        onClose={() => {}}
      >
        {(matches?.proposed?.items?.length ||
          matches?.unconfirmed?.items?.length) && (
          <MatchCardComponent
            showNewMatch={Boolean(!matches?.proposed?.items?.length)}
            matchId={
              matches?.proposed?.items?.length
                ? matches?.proposed.items[0].id
                : matches?.unconfirmed.items[0].id
            }
            profile={
              matches?.proposed?.items?.length
                ? matches?.proposed.items[0].partner
                : matches?.unconfirmed.items[0].partner
            }
          />
        )}
      </Modal>
    </Wrapper>
  );
};

export default FullAppLayout;
