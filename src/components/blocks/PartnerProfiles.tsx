import {
  CardDimensions,
  CardSizes,
  Modal,
  Text,
  TextTypes,
  pixelate,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import {
  COUNTRIES,
  LANGUAGES,
  LANGUAGE_LEVELS,
  USER_TYPES,
} from '../../constants/index.ts';
import { USER_ENDPOINT, getMatchEndpoint } from '../../features/swr/index.ts';
import PlusImage from '../../images/plus-with-circle.svg';
import LanguageLevelCard from './Cards/LanguageLevelCard.tsx';
import PartnerActionCard from './Cards/PartnerActionCard.jsx';
import ProfileCard, {
  PROFILE_CARD_HEIGHT,
  StyledProfileCard,
} from './Cards/ProfileCard.tsx';
import { SearchingCard } from './Cards/SearchingCard.tsx';
import UpdateSearchStateCard from './Cards/UpdateSearchStateCard.tsx';

const FindNewPartner = styled.button<{ $hasMatch: boolean }>`
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.color.border.selected};
  border-radius: 40px;
  border-width: 2px;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xxlarge} ${theme.spacing.large}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  order: ${({ $hasMatch }) => ($hasMatch ? 1 : 0)};

  > img {
    width: 115px;
    margin-bottom: ${({ theme }) => theme.spacing.large};
    height: 115px;
    cursor: pointer;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      width: ${pixelate(CardDimensions[CardSizes.Small])};
    }
    @media (min-width: ${theme.breakpoints.large}) {
      height: ${PROFILE_CARD_HEIGHT};
    }
  `};
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
  setShowCancel,
  currentPage,
}: {
  setShowCancel: (show: boolean) => void;
  currentPage: number;
}) {
  const { t } = useTranslation();

  const { data: matches, isLoading: matchesLoading } = useSWR(
    getMatchEndpoint(currentPage),
  );
  const confirmed = matches?.confirmed;
  const support = matches?.support;

  const getMatchesDisplay = () => {
    if (!confirmed || !support) {
      return [];
    }

    if (confirmed.page === 1) {
      return [...support.results, ...confirmed.results];
    }

    return [...confirmed.results];
  };

  const matchesDisplay = getMatchesDisplay();

  const { data: user } = useSWR(USER_ENDPOINT);
  const germanLevelInvalid = Boolean(
    user?.profile?.lang_skill?.find(
      (skill: any) =>
        skill.lang === LANGUAGES.german &&
        skill.level === LANGUAGE_LEVELS.level0,
    ),
  );
  const [partnerActionData, setPartnerActionData] = useState(null);
  const [showSearchConfirmModal, setShowSearchConfirmModal] = useState(false);
  const isLearnerOutsideGermany =
    user?.profile?.user_type === USER_TYPES.learner &&
    user?.profile?.country_of_residence !== COUNTRIES.DE;

  const onModalClose = () => {
    setPartnerActionData(null);
  };

  const renderStatusCard = () => {
    if (germanLevelInvalid) {
      return <LanguageLevelCard />;
    }

    if (user?.isSearching) {
      return <SearchingCard setShowCancel={setShowCancel} />;
    }

    return (
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
    );
  };

  if (!user) return null;

  return (
    <Matches>
      {matchesLoading ? (
        <StyledProfileCard width={CardSizes.Small} $loading />
      ) : (
        matchesDisplay?.map(match => (
          <ProfileCard
            key={match.partner.id}
            userPk={match.partner.id}
            profile={match.partner}
            isDeleted={match.partner.isDeleted}
            isSelf={false}
            isMatch={!match.partner.isSupport}
            matchId={match.id}
            openPartnerModal={setPartnerActionData}
            isOnline={match.partner.isOnline}
            isSupport={match.partner.isSupport}
            chatId={match.chatId}
          />
        ))
      )}
      {!isLearnerOutsideGermany && renderStatusCard()}

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
