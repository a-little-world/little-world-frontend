import { Modal } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import styled, { css } from 'styled-components';

import CustomPagination from './CustomPagination';
import { confirmMatch, partiallyConfirmMatch, updateMatchData } from './api';
import CallSetup, { IncomingCall } from './call-setup';
import './community-events.css';
import CancelSearchCard from './components/blocks/Cards/CancelSearchCard';
import ConfirmMatchCard from './components/blocks/Cards/ConfirmMatchCard';
import NewMatchCard from './components/blocks/Cards/NewMatchCard';
import CommunityEvents from './components/blocks/CommunityEvents/CommunityEvent';
import AppLayout from './components/blocks/Layout/AppLayout';
import NbtSelector from './components/blocks/NbtSelector';
import NotificationPanel from './components/blocks/NotificationPanel';
import PartnerProfiles from './components/blocks/PartnerProfiles';
import Help from './components/views/Help';
import Messages from './components/views/Messages';
import Notifications from './components/views/Notifications.tsx';
import Profile from './components/views/Profile';
import Settings from './components/views/Settings';
import {
  blockIncomingCall,
  cancelCallSetup,
  changeMatchCategory,
  initCallSetup,
  removeMatch,
  updateConfirmedData,
} from './features/userData';
import './i18n';
import './main.css';
import { APP_ROUTE } from './routes';
import { removeActiveTracks } from './twilio-helper';

const MatchCardComponent = ({ showNewMatch, matchId, profile }) => {
  const usesAvatar = profile.image_type === 'avatar';
  const dispatch = useDispatch();

  return showNewMatch ? (
    <NewMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onExit={() => {
        confirmMatch({ userHash: profile.id })
          .then(res => {
            if (res.ok) {
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: 'unconfirmed',
                  newCategory: 'confirmed',
                }),
              );
            }
          })
          .catch(error => console.error(error));
      }}
    />
  ) : (
    <ConfirmMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onConfirm={() => {
        partiallyConfirmMatch({ acceptDeny: true, matchId }).then(res => {
          if (res.ok) {
            res.json().then(() => {
              // Change 'proposed' to 'unconfirmed' so it will render the 'new match' popup next
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: 'proposed',
                  newCategory: 'unconfirmed',
                }),
              );
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({ acceptDeny: false, matchId }).then(res => {
          if (res.ok) {
            res.json().then(() => {
              dispatch(
                removeMatch({
                  category: 'proposed',
                  match: { id: matchId },
                }),
              );
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onExit={() => {
        // TODO IMPORTANT: Now it's impossible to 'ingnore' confirming a match
      }}
    />
  );
};

const Content = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0;
  padding-bottom: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  min-width: 0;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
      gap: ${theme.spacing.small};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      gap: ${theme.spacing.medium};
    }
  `};
`;

const Home = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: ${theme.spacing.medium};
      padding: 0;
    }
  `};
`;

const isViewportHeight = ['chat'];

function Main() {
  // for the case /call-setup/:userId?/ and /chat/:chatId/
  let { userId, chatId } = useParams();

  const location = useLocation();
  const { userPk } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // In order to define the frontent paginator numbers
  const pageItems = 10;
  const handlePageChange = async page => {
    // TODO: can be refactored using our redux stor
    const res = await updateMatchData(page, pageItems);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data) {
        dispatch(updateConfirmedData(data.data.confirmed_matches));
        setCurrentPage(page);
      }
    } else {
      console.error(
        `Cancelling match searching failed with error ${res.status}: ${res.statusText}`,
      );
    }
  };

  const user = useSelector(state => state.userData.user);
  const matches = useSelector(state => state.userData.matches);
  const incomingCalls = useSelector(state => state.userData.incomingCalls);
  const callSetup = useSelector(state => state.userData.callSetup);
  const activeCall = useSelector(state => state.userData.activeCall);

  const dashboardVisibleMatches = matches
    ? [...matches.support.items, ...matches.confirmed.items]
    : [];

  useEffect(() => {
    if (userId) {
      dispatch(initCallSetup({ userId }));
      navigate(`/${APP_ROUTE}/`); // Navigate back to base app route but with call setup open
    }
  }, [userId]);

  useEffect(() => {
    const totalPage =
      (matches?.confirmed?.totalItems + matches?.support?.totalItems) /
      pageItems;

    setTotalPages(Math.ceil(totalPage) || 1);
  }, [matches]);

  useEffect(() => {
    if (!callSetup && !activeCall) {
      removeActiveTracks();
      document.body.classList.remove('hide-mobile-header');
    }
  }, [callSetup, activeCall]);

  const [showCancelSearching, setShowCancelSearching] = useState(false);

  // Manage the top navbar & extra case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  const use = location.pathname.split('/')[2] || (userPk ? 'profile' : 'main');
  const [topSelection, setTopSelection] = useState(null);
  const selfProfile = user?.id === userPk || typeof userPk === 'undefined';
  const selectedProfile = dashboardVisibleMatches.find(
    match => match?.partner?.id === userPk,
  )?.partner;

  useEffect(() => {
    if (use === 'main') {
      setTopSelection('conversation_partners');
    }
    if (use === 'help') {
      setTopSelection('contact');
    }
  }, [location, use]);

  const onPageChange = page => {
    handlePageChange(page);
  };

  const setCallSetupPartner = partner => {
    dispatch(initCallSetup({ userId: partner }));
  };

  const onAnswerCall = () => {
    setCallSetupPartner(incomingCalls[0]?.userId);
  };

  const onRejectCall = () => {
    dispatch(blockIncomingCall({ userId: incomingCalls[0]?.userId }));
  };
  console.log({ use });
  return (
    <AppLayout page={use} isVH={isViewportHeight.includes(use)}>
      <ToastContainer />
      <Content>
        <NbtSelector
          selection={topSelection}
          setSelection={setTopSelection}
          use={use}
        />

        {use === 'main' &&
          (topSelection === 'community_calls' ? (
            <CommunityEvents />
          ) : (
            <>
              <Home className="content-area-main">
                <PartnerProfiles
                  setCallSetupPartner={setCallSetupPartner}
                  setShowCancel={setShowCancelSearching}
                  totalPaginations={totalPages}
                />
                <NotificationPanel />
              </Home>
              {totalPages > 1 && (
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                />
              )}
            </>
          ))}
        {use === 'chat' && (
          <Messages
            openChatWithId={chatId}
            matchesInfo={dashboardVisibleMatches}
            userPk={userPk}
            setCallSetupPartner={setCallSetupPartner}
          />
        )}
        {use === 'notifications' && <Notifications />}
        {use === 'profile' && (
          <Profile
            setCallSetupPartner={setCallSetupPartner}
            isSelf={selfProfile}
            profile={selfProfile ? user.profile : selectedProfile}
            userPk={selfProfile ? user.id : userPk}
          />
        )}
        {use === 'help' && <Help selection={topSelection} />}
        {use === 'settings' && <Settings />}
      </Content>

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
          matches?.unconfirmed?.items?.length) &&
          MatchCardComponent({
            showNewMatch: Boolean(!matches?.proposed?.items?.length),
            matchId: matches?.proposed?.items?.length
              ? matches?.proposed.items[0].id
              : matches?.unconfirmed.items[0].id,
            profile: matches?.proposed?.items?.length
              ? matches?.proposed.items[0].partner
              : matches?.unconfirmed.items[0].partner,
          })}
      </Modal>
    </AppLayout>
  );
}

export default Main;
