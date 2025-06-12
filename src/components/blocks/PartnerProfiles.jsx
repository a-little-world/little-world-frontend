import {
  CardSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import {
  MATCHES_ENDPOINT,
  USER_ENDPOINT,
  fetcher,
} from '../../features/swr/index.ts';
import PlusImage from '../../images/plus-with-circle.svg';
import LanguageLevelCard from './Cards/LanguageLevelCard.tsx';
import PartnerActionCard from './Cards/PartnerActionCard';
import ProfileCard, { PROFILE_CARD_HEIGHT } from './Cards/ProfileCard';
import { SearchingCard } from './Cards/SearchingCard';
import UpdateSearchStateCard from './Cards/UpdateSearchStateCard.tsx';

const FindNewPartner = styled.button`
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.color.border.selected};
  border-radius: 40px;
  border-width: 2px;
  width: ${CardSizes.Small};
  padding: ${({ theme }) => `${theme.spacing.xxlarge} ${theme.spacing.large}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: ${PROFILE_CARD_HEIGHT};
  position: relative;
  order: ${({ $hasMatch }) => ($hasMatch ? 1 : 0)};

  > img {
    width: 115px;
    margin-bottom: ${({ theme }) => theme.spacing.large};
    height: 115px;
    cursor: pointer;
  }
`;

const Matches = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }
  `};
`;

function PartnerProfiles({ setShowCancel }) {
  const { t } = useTranslation();

  const { data: matches } = useSWR(MATCHES_ENDPOINT, fetcher);
  const confirmed = matches?.confirmed;
  const support = matches?.support;
  const matchesDisplay =
    !confirmed || !support
      ? []
      : confirmed.currentPage === 1
      ? [...support.items, ...confirmed.items]
      : [...confirmed.items];

  const { data: user } = useSWR(USER_ENDPOINT, fetcher);
  const germanLevelInvalid = Boolean(
    user?.profile?.lang_skill?.find(
      skill => skill.lang === 'german' && skill.level === 'level-0',
    ),
  );
  const [partnerActionData, setPartnerActionData] = useState(null);
  const [showSearchConfirmModal, setShowSearchConfirmModal] = useState(false);

  const onModalClose = () => {
    setPartnerActionData(null);
  };

  return (
    <Matches>
      {matchesDisplay?.map(match => (
        <ProfileCard
          key={match.partner.id}
          userPk={match.partner.id}
          profile={match.partner}
          isSelf={false}
          isMatch={!match.partner.isSupport}
          matchId={match.id}
          openPartnerModal={setPartnerActionData}
          isOnline={match.partner.isOnline}
          isSupport={match.partner.isSupport}
          chatId={match.chatId}
        />
      ))}
      {germanLevelInvalid ? (
        <LanguageLevelCard />
      ) : user?.isSearching ? (
        <SearchingCard setShowCancel={setShowCancel} />
      ) : (
        <FindNewPartner
          type="button"
          onClick={() => setShowSearchConfirmModal(true)}
          $hasMatch={user?.hasMatch}
        >
          <img src={PlusImage} alt="change matching status icon" />
          <Text type={TextTypes.Body3}>
            {t('matching_state_not_searching_trans')}
          </Text>
        </FindNewPartner>
      )}

      <Modal open={Boolean(partnerActionData)} onClose={onModalClose}>
        {!!partnerActionData && (
          <PartnerActionCard data={partnerActionData} onClose={onModalClose} />
        )}
      </Modal>
      <Modal
        open={showSearchConfirmModal}
        onClose={() => setShowSearchConfirmModal(false)}
      >
        <UpdateSearchStateCard
          onClose={() => setShowSearchConfirmModal(false)}
        />
      </Modal>
    </Matches>
  );
}

export default PartnerProfiles;
