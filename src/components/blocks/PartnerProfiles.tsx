import { useState } from 'react';

import {
  CardDimensions,
  CardSizes,
  Modal,
  pixelate,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { getMatchEndpoint, USER_ENDPOINT } from '../../api/endpoints';
import {
  COUNTRIES,
  LANGUAGE_LEVELS,
  LANGUAGES,
  USER_TYPES,
} from '../../constants';
import type { NudgeKey } from '../../constants/matchNudges';
import useSystemModalBlocker from '../../hooks/useSystemModalBlocker';
import PlusImage from '../../images/plus-with-circle.svg';
import CoursePromoCard from './Cards/CoursePromoCard';
import LanguageLevelCard from './Cards/LanguageLevelCard';
import PartnerActionCard from './Cards/PartnerActionCard';
import ProfileCard, {
  PROFILE_CARD_HEIGHT,
  StyledProfileCard,
} from './Cards/ProfileCard';
import { SearchingCard } from './Cards/SearchingCard';
import UpdateSearchStateCard from './Cards/UpdateSearchStateCard';

/** Temporary: one copy of the first partner card per nudge. Remove after review. */
const NUDGE_PREVIEWS: { nudge: NudgeKey; minutes: number }[] = [
  { nudge: 'stale', minutes: 90 },
  { nudge: 'recent_hour', minutes: 90 },
  { nudge: 'recent_long', minutes: 150 },
  { nudge: 'goal', minutes: 0 },
  { nudge: 'schedule', minutes: 0 },
  { nudge: 'short_call', minutes: 15 },
  ...Array.from({ length: 10 }, (_, i) => ({
    nudge: `band_${i + 1}` as NudgeKey,
    minutes: (i + 1) * 30 + (i === 0 ? 15 : 0),
  })),
  { nudge: 'beyond_goal', minutes: 330 },
];

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
      return confirmed.results.length > 0
        ? [...confirmed.results, ...support.results]
        : [...support.results];
    }

    return [...confirmed.results];
  };

  const matchesDisplay = getMatchesDisplay();

  const { data: user } = useSWR(USER_ENDPOINT);
  const germanLevelInvalid =
    !user?.forceMatchEligible &&
    Boolean(
      user?.profile?.lang_skill?.find(
        (skill: any) =>
          skill.lang === LANGUAGES.german &&
          skill.level === LANGUAGE_LEVELS.level0,
      ),
    );
  const [partnerActionData, setPartnerActionData] = useState(null);
  const [showSearchConfirmModal, setShowSearchConfirmModal] = useState(false);
  useSystemModalBlocker(
    Boolean(partnerActionData) || showSearchConfirmModal,
    'partner-profiles-modal',
  );
  const isLearnerOutsideGermany =
    !user?.forceMatchEligible &&
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

  const previewMatch = matchesDisplay?.find(
    match => !match.partner.isSupport && !match.partner.isDeleted,
  );

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
            bothActiveCallMinutes={match.both_active_call_minutes}
            successMinutes={match.success_minutes}
            progressNudge={match.progress_nudge}
            unreadCount={match.chat?.unread_count}
          />
        ))
      )}
      {previewMatch &&
        NUDGE_PREVIEWS.map(preview => (
          <ProfileCard
            key={`nudge-preview-${preview.nudge}`}
            userPk={previewMatch.partner.id}
            profile={previewMatch.partner}
            isDeleted={false}
            isSelf={false}
            isMatch
            matchId={previewMatch.id}
            openPartnerModal={setPartnerActionData}
            isOnline={previewMatch.partner.isOnline}
            isSupport={false}
            chatId={previewMatch.chatId}
            bothActiveCallMinutes={preview.minutes}
            successMinutes={previewMatch.success_minutes ?? 300}
            progressNudge={preview.nudge}
            forceProgressPanel
          />
        ))}
      {!isLearnerOutsideGermany && renderStatusCard()}
      {currentPage === 1 && <CoursePromoCard />}

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
