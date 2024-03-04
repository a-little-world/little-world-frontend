import {
  CardSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import { BACKEND_URL } from '../../ENVIRONMENT';
import userData, {
  selectMatchesDisplay,
  updateSearchState,
} from '../../features/userData';
import PlusImage from '../../images/plus-with-circle.svg';
import PartnerActionCard from './Cards/PartnerActionCard';
import ProfileCard, { PROFILE_CARD_HEIGHT } from './Cards/ProfileCard';
import { SearchingCard } from './Cards/SearchingCard';

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

function PartnerProfiles({
  setCallSetupPartner,
  setShowCancel,
  totalPaginations,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const matches = useSelector(state => state.userData.matches);
  const matchesDisplay = useSelector(selectMatchesDisplay);
  const user = useSelector(state => state.userData.user);
  const [partnerActionData, setPartnerActionData] = useState(null);

  function updateUserMatchingState() {
    const updatedState = 'searching';
    fetch(`${BACKEND_URL}/api/user/search_state/${updatedState}`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        console.error('server error', response.status, response.statusText);
        return false;
      })
      .then(response => {
        if (response) {
          // If this request works, we can safely update our state to 'searching'
          dispatch(updateSearchState(updatedState !== 'idle'));
        }
      })
      .catch(error => console.error(error));
  }

  const onModalClose = () => {
    setPartnerActionData(null);
  };
  console.log({ matchesDisplay });
  return (
    <Matches>
      {matchesDisplay.map(match => (
        <ProfileCard
          key={match.partner.id}
          userPk={match.partner.id}
          profile={match.partner}
          isSelf={false}
          openPartnerModal={setPartnerActionData}
          setCallSetupPartner={setCallSetupPartner}
          isOnline={match.partner.isOnline}
          isSupport={match.partner.isSupport}
          chatId={match.chatId}
        />
      ))}
      {user.isSearching ? (
        <SearchingCard
          setShowCancel={setShowCancel}
        />
      ) : (
        <FindNewPartner
          type="button"
          onClick={updateUserMatchingState}
          $hasMatch={user.hasMatch}
        >
          <img src={PlusImage} alt="change matching status icon" />
          <Text type={TextTypes.Body3}>
            {t('matching_state_not_searching_trans')}
          </Text>
          {/* matchState === "confirmed" && t("matching_state_found_confirmed_trans") */}
        </FindNewPartner>
      )}
      <Modal open={Boolean(partnerActionData)} onClose={onModalClose}>
        {!!partnerActionData && (
          <PartnerActionCard data={partnerActionData} onClose={onModalClose} />
        )}
      </Modal>
    </Matches>
  );
}

export default PartnerProfiles;
