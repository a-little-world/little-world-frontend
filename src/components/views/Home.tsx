import { Modal } from '@a-little-world/little-world-design-system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR, { mutate } from 'swr';

import CustomPagination from '../../CustomPagination';
import { updateMatchData } from '../../api/matches';
import { useCallSetupStore } from '../../features/stores/index';
import { USER_ENDPOINT, getMatchEndpoint } from '../../features/swr/index';
import {
  COMMUNITY_EVENTS_ROUTE,
  RANDOM_CALLS_ROUTE,
  getAppRoute,
} from '../../router/routes';
import UpdateSearchStateCard from '../blocks/Cards/UpdateSearchStateCard';
import CommsBanner from '../blocks/CommsBanner';
import CommunityEvents from '../blocks/CommunityEvents/CommunityEvent';
import ContentSelector from '../blocks/ContentSelector';
import NotificationPanel from '../blocks/NotificationPanel';
import PartnerProfiles from '../blocks/PartnerProfiles';
import RandomCalls from './RandomCalls/RandomCalls';

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

type subpages = 'events' | 'conversation_partners' | 'random_calls';

const PAGE_ITEMS = 10;

function Main() {
  // for the case /call-setup/:userId?/
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const callSetup = useCallSetupStore();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelSearching, setShowCancelSearching] = useState(false);

  const handlePageChange = async (page: number) => {
    updateMatchData({
      page,
      pageItems: PAGE_ITEMS,
      onError: error => console.error(error),
      onSuccess: _data => {
        setCurrentPage(page);
        mutate(getMatchEndpoint(page));
        window.scrollTo(0, 0);
      },
    });
  };

  const { data: matches } = useSWR(getMatchEndpoint(currentPage));
  const { data: user } = useSWR(USER_ENDPOINT);
  const hasRandomCallAccess = user?.hasRandomCallAccess ?? false;

  useEffect(() => {
    const totalItems =
      (matches?.confirmed?.results_total ?? 1) +
      (matches?.support?.results_total ?? 1);
    const totalPage = totalItems / PAGE_ITEMS;

    setTotalPages(Math.ceil(totalPage) || 1);
  }, [matches]);

  useEffect(() => {
    if (userId) {
      callSetup.initCallSetup({ userId });
    }
  }, [userId]);

  const getSubpage = (): subpages => {
    if (location.pathname === getAppRoute(COMMUNITY_EVENTS_ROUTE)) {
      return 'events';
    }
    if (location.pathname === getAppRoute(RANDOM_CALLS_ROUTE)) {
      return 'random_calls';
    }
    return 'conversation_partners';
  };

  const subpage = getSubpage();

  useEffect(() => {
    // Redirect away from random_calls route if user doesn't have access
    if (subpage === 'random_calls' && !hasRandomCallAccess) {
      navigate(getAppRoute(''));
    }
  }, [subpage, hasRandomCallAccess, navigate]);

  const handleSubpageSelect = (page: subpages) => {
    const nextPath = page !== 'conversation_partners' ? page : '';
    navigate(getAppRoute(nextPath.replace('_', '-')));
  };

  const onPageChange = (page: number) => {
    handlePageChange(page);
  };

  return (
    <>
      <ContentSelector
        selection={subpage}
        setSelection={(selection: string) =>
          handleSubpageSelect(selection as subpages)
        }
        use="main"
        excludeTopics={!hasRandomCallAccess ? ['random_calls'] : undefined}
      />
      <CommsBanner />
      {subpage === 'events' && <CommunityEvents />}
      {subpage === 'random_calls' && hasRandomCallAccess && <RandomCalls />}
      {subpage === 'conversation_partners' && (
        <>
          <Home>
            <PartnerProfiles
              currentPage={currentPage}
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
          <UpdateSearchStateCard
            onClose={() => setShowCancelSearching(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default Main;
