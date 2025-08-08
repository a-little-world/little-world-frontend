import {
  Button,
  ButtonVariations,
  Card,
  CardDimensions,
  CardSizes,
  DotsIcon,
  Gradients,
  Logo,
  MessageIcon,
  PencilIcon,
  Popover,
  ProfileIcon,
  Tag,
  TagSizes,
  Text,
  TextTypes,
  VideoIcon,
  pixelate,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import { useCallSetupStore } from '../../../features/stores/index';
import {
  MESSAGES_ROUTE,
  PROFILE_ROUTE,
  getAppRoute,
  getAppSubpageRoute,
} from '../../../router/routes';
import { shimmerStyles } from '../../atoms/Loading';
import MenuLink from '../../atoms/MenuLink';
import OnlineIndicator from '../../atoms/OnlineIndicator';
import ProfileImage from '../../atoms/ProfileImage';
import {
  PARTNER_ACTION_REPORT,
  PARTNER_ACTION_UNMATCH,
} from './PartnerActionCard';

export const PROFILE_CARD_HEIGHT = '408px';

interface Profile {
  first_name: string;
  description: string;
  image: string;
  image_type: string;
  avatar_config?: any;
}

interface ProfileCardProps {
  chatId: string;
  matchId?: string;
  userPk: string;
  profile: Profile;
  isSelf: boolean;
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
  order: 1;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ $unconfirmedMatch }) =>
    $unconfirmedMatch &&
    css`
      background-color: rgb(252, 224, 172);
    `};

  ${({ $onProfile }) =>
    $onProfile &&
    css`
      max-width: ${pixelate(CardDimensions[CardSizes.Small])};
      width: unset;
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
    padding: ${theme.spacing.xxxsmall} ${theme.spacing.xxsmall};
    top: ${theme.spacing.xsmall};
    right: ${theme.spacing.xsmall};
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
    $onProfile ? '1fr 1fr' : '1fr 1fr 1fr'};
  column-gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 498px;
`;

export const NameContainer = styled.div<{ $isSelf: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $isSelf }) => ($isSelf ? 'center' : 'space-between')};
`;

export const TagText = styled.span`
  font-family: revert;
`;

export const Description = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

const ProfileCard: React.FC<ProfileCardProps> = ({
  chatId,
  matchId,
  userPk,
  profile,
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

      {isMatch && (
        <Popover
          width={PopoverSizes.Large}
          showCloseButton
          trigger={
            <MatchMenuToggle type="button" variation={ButtonVariations.Icon}>
              <DotsIcon
                circular
                height="16px"
                width="16px"
                color="#7c7b7b"
                borderColor="#7c7b7b"
                label="menu options"
              />
            </MatchMenuToggle>
          }
        >
          <PartnerMenuOption
            onClick={() =>
              openPartnerModal?.({
                type: PARTNER_ACTION_REPORT,
                userPk,
                userName: profile.first_name,
                matchId,
              })
            }
          >
            {t('cp_menu_report')}
          </PartnerMenuOption>
          <PartnerMenuOption
            onClick={() =>
              openPartnerModal?.({
                type: PARTNER_ACTION_UNMATCH,
                userPk,
                userName: profile.first_name,
                matchId,
              })
            }
          >
            {t('cp_menu_unmatch')}
          </PartnerMenuOption>
        </Popover>
      )}
      <OnlineIndicator isOnline={isOnline} />
      <ProfileInfo>
        <NameContainer $isSelf={isSelf}>
          <Text type={TextTypes.Body3} bold>
            {profile.first_name}
          </Text>
          {isSupport && (
            <Tag color={theme.color.status.info} bold size={TagSizes.small}>
              <TagText>{t('profile_card.support_user')}</TagText>
              <Logo height="16" width="16" label="support logo" />
            </Tag>
          )}
        </NameContainer>

        {!onProfile && (
          <Description>
            {isSupport ?
              t('profile_card.support_description') :
              profile.description}
          </Description>
        )}
      </ProfileInfo>
      {!isSelf && (
        <Actions $onProfile={onProfile}>
          {!onProfile && (
            <MenuLink to={getAppRoute(`${PROFILE_ROUTE}/${userPk}`)}>
              <ProfileIcon gradient={Gradients.Orange} label="visit profile" />
              {t('cp_profile')}
            </MenuLink>
          )}
          <MenuLink
            to={getAppSubpageRoute(MESSAGES_ROUTE, chatId)}
            state={{ userPk }}
          >
            <MessageIcon gradient={Gradients.Orange} label="chat icon" />
            {t('cp_message')}
          </MenuLink>
          <Button
            type="button"
            variation={ButtonVariations.Option}
            onClick={() => callSetup.initCallSetup({ userId: userPk })}
          >
            <VideoIcon
              gradient={Gradients.Orange}
              label="call icon"
              width={38}
            />
            {t('cp_call')}
          </Button>
        </Actions>
      )}
    </StyledProfileCard>
  );
};

export default ProfileCard;
