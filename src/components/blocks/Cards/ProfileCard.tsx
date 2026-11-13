import React, { useMemo } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Card,
  CardDimensions,
  CardSizes,
  DotsIcon,
  Gradients,
  Link,
  MessageIcon,
  PencilIcon,
  pixelate,
  Popover,
  PopoverSizes,
  ProfileIcon,
  Text,
  TextTypes,
  Tooltip,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { NiceAvatarProps } from 'react-nice-avatar';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';
import useSWR from 'swr';

import { CHATS_ENDPOINT } from '../../../api/endpoints';
import { useCallSetupStore } from '../../../features/stores/index';
import {
  getAppRoute,
  getAppSubpageRoute,
  HELP_CONTACT_ROUTE,
  MESSAGES_ROUTE,
  PROFILE_ROUTE,
} from '../../../router/routes';
import { shimmerStyles } from '../../atoms/Loading';
import MenuLink, { MenuLinkText } from '../../atoms/MenuLink';
import OnlineIndicator from '../../atoms/OnlineIndicator';
import ProfileImage from '../../atoms/ProfileImage';
import SupportTag from '../../atoms/SupportTag';
import {
  REPORT_TYPE_PARTNER,
  REPORT_TYPE_UNMATCH,
} from '../ReportForm/constants';
import ProgressPanel from './ProgressPanel';

export const PROFILE_CARD_HEIGHT = '456px';

interface Profile {
  first_name: string;
  description: string;
  image: string;
  image_type: string;
  avatar_config?: NiceAvatarProps;
}

interface ProfileCardProps {
  chatId: string;
  matchId?: string;
  userPk: string;
  profile: Profile;
  isSelf: boolean;
  isDeleted?: boolean;
  isOnline: boolean;
  isMatch: boolean;
  isSupport: boolean;
  onProfile: boolean;
  openPartnerModal?: (params: {
    type: string;
    userPk: string;
    userName: string;
    matchId?: string;
  }) => void;
  openEditImage?: () => void;
  type?: string;
  loading?: boolean;
  unreadCount?: number;
  bothActiveCallMinutes?: number;
  successMinutes?: number;
  progressNudge?: string | null;
}

export const StyledProfileCard = styled(Card)<{
  $isSelf?: boolean;
  $onProfile?: boolean;
  $unconfirmedMatch?: boolean;
  $loading?: boolean;
}>`
  align-items: center;
  border-color: ${({ theme }) => theme.color.border.subtle};
  align-items: center;
  position: relative;
  text-align: ${({ $isSelf }) => ($isSelf ? 'center' : 'left')};
  gap: ${({ theme }) => theme.spacing.small};

  ${({ $unconfirmedMatch }) =>
    $unconfirmedMatch &&
    css`
      background-color: rgb(252, 224, 172);
    `};

  ${({ $onProfile }) =>
    $onProfile
      ? css`
          max-width: ${pixelate(CardDimensions[CardSizes.Small])};
          width: unset;
        `
      : css`
          order: 1;
        `};

  ${({ theme, $isSelf, $onProfile }) => css`
    min-height: ${$isSelf || $onProfile ? 'initial' : PROFILE_CARD_HEIGHT};

    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
      height: ${$isSelf || $onProfile ? 'initial' : PROFILE_CARD_HEIGHT};
    }
  `};

  ${({ $loading }) =>
    $loading &&
    css`
      ${shimmerStyles}
    `};
`;

export const ProfileImageButton = styled.button`
  position: relative;
  transition: filter 0.5s;

  &:hover {
    filter: brightness(0.9);
  }
`;

export const EditIcon = styled(PencilIcon)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xxsmall};
  right: ${({ theme }) => theme.spacing.xxsmall};
  width: fit-content;
  color: ${({ theme }) => theme.color.text.accent};
  border: 2px solid ${({ theme }) => theme.color.text.accent};
`;

export const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
    padding-left: ${theme.spacing.xxxsmall};
    gap: ${theme.spacing.xxsmall};
  `};
`;

export const MatchMenuToggle = styled(Button)`
  position: absolute;

  ${({ theme }) => `
    top: ${theme.spacing.small};
    right: ${theme.spacing.small};
  `};
`;

const partnerMenuOptionStyles = css`
  display: block;
  width: 100%;
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  padding-left: 0;
  text-align: left;
  color: inherit;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    filter: opacity(0.6);
  }

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

export const PartnerMenuOption = styled.button`
  ${partnerMenuOptionStyles}
`;

export const PartnerMenuLink = styled(RouterLink)`
  ${partnerMenuOptionStyles}
`;

export const Actions = styled.div<{
  $onProfile: boolean;
  $showPanel?: boolean;
}>`
  display: grid;
  grid-template-columns: ${({ $onProfile }) =>
    $onProfile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))'};
  column-gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 498px;
  margin-top: ${({ $showPanel }) => ($showPanel ? 0 : 'auto')};
`;

export const NameContainer = styled.div<{ $isSelf: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isSelf }) => ($isSelf ? 'center' : 'space-between')};
`;

export const Description = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  white-space: pre-line;
  overflow-wrap: break-word;
`;

export const SupportChatLink = styled(Link)`
  margin-top: auto;
`;

const ProfileCard: React.FC<ProfileCardProps> = ({
  chatId,
  matchId,
  userPk,
  profile,
  isDeleted,
  isSelf,
  isOnline,
  isMatch,
  isSupport,
  onProfile,
  openPartnerModal,
  openEditImage,
  type,
  loading = false,
  unreadCount: unreadCountProp,
  bothActiveCallMinutes,
  successMinutes,
  progressNudge,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const usesAvatar = profile.image_type === 'avatar';
  const callSetup = useCallSetupStore();
  const { data: chats } = useSWR(chatId ? CHATS_ENDPOINT : null);
  const unreadCount = useMemo(() => {
    const fromChatList = chats?.results?.find(
      (chat: { uuid?: string; unread_count?: number }) =>
        String(chat.uuid) === String(chatId),
    )?.unread_count;
    return fromChatList ?? unreadCountProp ?? 0;
  }, [chatId, chats, unreadCountProp]);
  const { description: profileDescription } = profile;
  const displayName = isDeleted
    ? t('profile.deleted_name')
    : profile.first_name;
  let description = profileDescription;
  if (isSupport) description = t('profile_card.support_description');
  else if (isDeleted) description = t('profile.deleted_description');
  const callMinutes = Math.max(0, Math.round(bothActiveCallMinutes ?? 0));
  const showPanel = Boolean(
    isMatch && !isSupport && !isDeleted && !isSelf && !onProfile,
  );

  return (
    <StyledProfileCard
      width={CardSizes.Small}
      $isSelf={isSelf}
      $onProfile={onProfile}
      $unconfirmedMatch={type === 'unconfirmed'}
      $loading={loading}
    >
      {isSelf && openEditImage ? (
        <ProfileImageButton onClick={openEditImage} type="button">
          <ProfileImage
            circle
            image={usesAvatar ? profile.avatar_config : profile.image}
            imageType={profile.image_type}
          />
          <EditIcon
            circular
            height="16px"
            width="16px"
            label="edit profile image"
          />
        </ProfileImageButton>
      ) : (
        <ProfileImage
          image={usesAvatar ? profile.avatar_config : profile.image}
          imageType={profile.image_type}
          size={onProfile ? 'large' : 'medium'}
        />
      )}
      {isMatch && !isDeleted && (
        <Popover
          width={PopoverSizes.Large}
          showCloseButton
          trigger={
            <MatchMenuToggle
              variation={ButtonVariations.Circle}
              appearance={ButtonAppearance.Secondary}
              size={ButtonSizes.Medium}
              backgroundColor={theme.color.surface.secondary}
              color={theme.color.text.tertiary}
            >
              <Tooltip
                text={t('profile_card.user_actions')}
                trigger={
                  <div style={{ display: 'flex' }}>
                    <DotsIcon height="16px" width="16px" label="menu options" />
                  </div>
                }
              />
            </MatchMenuToggle>
          }
        >
          {/* Only entry point to Match Overview; hidden until that page launches.
          {matchId && (
            <PartnerMenuLink to={getMatchOverviewRoute(matchId)}>
              {t('partner_profile.match_stats')}
            </PartnerMenuLink>
          )} */}
          <PartnerMenuOption
            onClick={() =>
              openPartnerModal?.({
                type: REPORT_TYPE_PARTNER,
                userPk,
                userName: profile.first_name,
                matchId,
              })
            }
          >
            {t('partner_profile.report')}
          </PartnerMenuOption>
          <PartnerMenuOption
            onClick={() =>
              openPartnerModal?.({
                type: REPORT_TYPE_UNMATCH,
                userPk,
                userName: profile.first_name,
                matchId,
              })
            }
          >
            {t('partner_profile.unmatch')}
          </PartnerMenuOption>
        </Popover>
      )}
      <OnlineIndicator isOnline={isOnline} position="absolute" />
      <ProfileInfo>
        {!onProfile && (
          <NameContainer $isSelf={isSelf}>
            <Text type={TextTypes.Heading5} bold>
              {displayName}
            </Text>
            {isSupport && <SupportTag />}
          </NameContainer>
        )}
        {!onProfile && !showPanel && <Description>{description}</Description>}
      </ProfileInfo>
      {isSelf ? null : isSupport ? (
        <SupportChatLink
          to={getAppRoute(HELP_CONTACT_ROUTE)}
          buttonAppearance={ButtonAppearance.Primary}
          buttonSize={ButtonSizes.Stretch}
        >
          {t('profile_card.support_chat')}
        </SupportChatLink>
      ) : (
        <Actions $onProfile={onProfile} $showPanel={showPanel}>
          {!onProfile && (
            <Tooltip
              text={t('profile_card.view_profile')}
              trigger={
                <div>
                  <MenuLink
                    to={getAppRoute(`${PROFILE_ROUTE}/${userPk}`)}
                    disabled={isDeleted}
                    Icon={ProfileIcon}
                    iconGradient={Gradients.Orange}
                    iconLabel="visit profile"
                    text={t('partner_profile.profile')}
                  />
                </div>
              }
            />
          )}
          <Tooltip
            text={t('profile_card.message')}
            trigger={
              <div>
                <MenuLink
                  to={getAppSubpageRoute(MESSAGES_ROUTE, chatId)}
                  state={{ userPk }}
                  Icon={MessageIcon}
                  iconGradient={Gradients.Orange}
                  iconLabel="chat icon"
                  unreadCount={unreadCount}
                  text={t(
                    isDeleted
                      ? 'partner_profile.messages'
                      : 'partner_profile.message',
                  )}
                  order={isDeleted ? -1 : undefined}
                />
              </div>
            }
          />

          <Tooltip
            text={t('profile_card.call')}
            trigger={
              <Button
                type="button"
                variation={ButtonVariations.Stacked}
                onClick={() => callSetup.initCallSetup({ userId: userPk })}
                disabled={isDeleted}
              >
                <VideoIcon
                  gradient={isDeleted ? undefined : Gradients.Orange}
                  color={isDeleted ? theme.color.text.disabled : undefined}
                  label="call icon"
                  width={38}
                  height={32}
                />
                <MenuLinkText>{t('partner_profile.call')}</MenuLinkText>
              </Button>
            }
          />
        </Actions>
      )}
      {showPanel && (
        <ProgressPanel
          minutes={callMinutes}
          max={successMinutes}
          nudgeKey={progressNudge}
        />
      )}
    </StyledProfileCard>
  );
};

export default ProfileCard;
