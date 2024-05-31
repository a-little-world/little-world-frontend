import { Modal } from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import CustomPagination from '../../CustomPagination.jsx';
import { updateMatchData } from '../../api/index.js';
import '../../community-events.css';
import { initCallSetup, updateConfirmedData } from '../../features/userData.js';
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

function Main() {
  // for the case /call-setup/:userId?/
  const { userId } = useParams();
  const dispatch = useDispatch();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelSearching, setShowCancelSearching] = useState(false);

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
        window.scrollTo(0, 0);
      }
    } else {
      console.error(
        `Cancelling match searching failed with error ${res.status}: ${res.statusText}`,
      );
    }
  };

  const matches = useSelector(state => state.userData.matches);

  useEffect(() => {
    const totalPage =
      (matches?.confirmed?.totalItems + matches?.support?.totalItems) /
      pageItems;

    setTotalPages(Math.ceil(totalPage) || 1);
  }, [matches]);

  useEffect(() => {
    if (userId) {
      dispatch(initCallSetup({ userId }));
    }
  }, [userId]);

  const [subpage, setSubpage] = useState('conversation_partners');

  const onPageChange = page => {
    handlePageChange(page);
  };

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={setSubpage}
        use={'main'}
      />
      {subpage === 'community_calls' ? (
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
