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
  Popover,
  ProfileIcon,
  Text,
  TextTypes,
  Tooltip,
  VideoIcon,
  pixelate,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NiceAvatarProps } from 'react-nice-avatar';
import styled, { css, useTheme } from 'styled-components';

import { useCallSetupStore } from '../../../features/stores/index';
import {
  HELP_CONTACT_ROUTE,
  MESSAGES_ROUTE,
  PROFILE_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
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

export const PROFILE_CARD_HEIGHT = '408px';

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

  ${({ theme, $isSelf }) => css`
    min-height: ${$isSelf ? 'initial' : PROFILE_CARD_HEIGHT};

    @media (min-width: ${theme.breakpoints.medium}) {
      height: ${$isSelf ? 'initial' : PROFILE_CARD_HEIGHT};
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
    margin-bottom: ${theme.spacing.xxsmall};
  `};
`;

export const MatchMenuToggle = styled(Button)`
  position: absolute;

  ${({ theme }) => `
    top: ${theme.spacing.small};
    right: ${theme.spacing.small};
  `};
`;

export const PartnerMenuOption = styled.button`
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  padding-left: 0px;
  text-align: left;

  &:hover {
    filter: opacity(0.6);
  }

  &:first-of-type {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

export const Actions = styled.div<{ $onProfile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $onProfile }) =>
    $onProfile ? '1fr 1fr' : 'repeat(3, minmax(0, 1fr))'};
  column-gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 498px;
`;

export const NameContainer = styled.div<{ $isSelf: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isSelf }) => ($isSelf ? 'center' : 'space-between')};
`;

export const Description = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
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
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const usesAvatar = profile.image_type === 'avatar';
  const callSetup = useCallSetupStore();

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
        <NameContainer $isSelf={isSelf}>
          <Text type={TextTypes.Heading5} bold>
            {isDeleted ? t('profile.deleted_name') : profile.first_name}
          </Text>
          {isSupport && <SupportTag />}
        </NameContainer>

        {!onProfile && (
          <Description>
            {isSupport
              ? t('profile_card.support_description')
              : isDeleted
              ? t('profile.deleted_description')
              : profile.description}
          </Description>
        )}
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
        <Actions $onProfile={onProfile}>
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
    </StyledProfileCard>
  );
};

export default ProfileCard;
