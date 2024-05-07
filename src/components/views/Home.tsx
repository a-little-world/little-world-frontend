import { Modal } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import CustomPagination from '../../CustomPagination.jsx';
import { updateMatchData } from '../../api/index.js';
import CallSetup, { IncomingCall } from '../../call-setup.jsx';
import '../../community-events.css';
import {
  blockIncomingCall,
  cancelCallSetup,
  initCallSetup,
  updateConfirmedData,
} from '../../features/userData.js';
import '../../main.css';
import { APP_ROUTE } from '../../routes.jsx';
import { removeActiveTracks } from '../../twilio-helper.js';
import CancelSearchCard from '../blocks/Cards/CancelSearchCard.jsx';
import CommunityEvents from '../blocks/CommunityEvents/CommunityEvent.jsx';
import NbtSelector from '../blocks/NbtSelector.jsx';
import NotificationPanel from '../blocks/NotificationPanel.jsx';
import PartnerProfiles from '../blocks/PartnerProfiles.jsx';

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

function Main() {
  // for the case /call-setup/:userId?/
  const { userId } = useParams();

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

  const matches = useSelector(state => state.userData.matches);
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

  const [subpage, setSubpage] = useState('conversation_partners');

  const onPageChange = page => {
    handlePageChange(page);
  };

  const setCallSetupPartner = partner => {
    dispatch(initCallSetup({ userId: partner }));
  };

  return (
    <>
      <NbtSelector selection={subpage} setSelection={setSubpage} use={'main'} />
      {subpage === 'community_calls' ? (
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
      )}
    </>
  );
}

export default Main;
