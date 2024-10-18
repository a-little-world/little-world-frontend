import { Modal } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import CustomPagination from '../../CustomPagination.jsx';
import { updateMatchData } from '../../api/matches.ts';
import { initCallSetup, updateConfirmedData } from '../../features/userData.js';
import { COMMUNITY_EVENTS_ROUTE, getAppRoute } from '../../routes.ts';
import CancelSearchCard from '../blocks/Cards/CancelSearchCard';
import CommunityEvents from '../blocks/CommunityEvents/CommunityEvent.jsx';
import ContentSelector from '../blocks/ContentSelector.tsx';
import NotificationPanel from '../blocks/NotificationPanel.tsx';
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

type subpages = 'events' | 'conversation_partners';

const PAGE_ITEMS = 10;

function Main() {
  // for the case /call-setup/:userId?/
  const { userId } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelSearching, setShowCancelSearching] = useState(false);

  const handlePageChange = async (page: number) => {
    updateMatchData({
      page,
      pageItems: PAGE_ITEMS,
      onError: error => console.error(error),
      onSuccess: data => {
        dispatch(updateConfirmedData(data.data.confirmed_matches));
        setCurrentPage(page);
        window.scrollTo(0, 0);
      },
    });
  };

  const matches = useSelector(state => state.userData.matches);

  useEffect(() => {
    const totalItems =
      (matches?.confirmed?.totalItems ?? 1) +
      (matches?.support?.totalItems ?? 1);
    const totalPage = totalItems / PAGE_ITEMS;

    setTotalPages(Math.ceil(totalPage) || 1);
  }, [matches]);

  useEffect(() => {
    if (userId) {
      dispatch(initCallSetup({ userId }));
    }
  }, [userId]);

  const subpage =
    location.pathname === getAppRoute(COMMUNITY_EVENTS_ROUTE)
      ? 'events'
      : 'conversation_partners';

  const handleSubpageSelect = (page: subpages) => {
    const nextPath = page !== 'conversation_partners' ? page : '';
    navigate(getAppRoute(nextPath));
  };

  const onPageChange = (page: number) => {
    handlePageChange(page);
  };

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={handleSubpageSelect}
        use="main"
      />
      {subpage === 'events' ? (
        <CommunityEvents />
      ) : (
        <>
          <Home>
            <PartnerProfiles
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
      {showCancelSearching && (
        <Modal
          open={showCancelSearching}
          onClose={() => setShowCancelSearching(false)}
        >
          <CancelSearchCard onClose={() => setShowCancelSearching(false)} />
        </Modal>
      )}
    </>
  );
}

export default Main;
