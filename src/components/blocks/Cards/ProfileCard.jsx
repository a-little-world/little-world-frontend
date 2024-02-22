import {
  Button,
  ButtonVariations,
  Card,
  CardSizes,
  DotsIcon,
  Gradients,
  Logo,
  MessageIcon,
  PencilIcon,
  PhoneIcon,
  Popover,
  ProfileIcon,
  Text,
  TextTypes,
  designTokens,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { CHAT_ROUTE, getAppRoute } from '../../../routes';
import MenuLink from '../../atoms/MenuLink';
import OnlineIndicator from '../../atoms/OnlineIndicator';
import ProfileImage from '../../atoms/ProfileImage';
import {
  PARTNER_ACTION_REPORT,
  PARTNER_ACTION_UNMATCH,
} from './PartnerActionCard';

export const PROFILE_CARD_HEIGHT = '408px';

export const StyledCard = styled(Card)`
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

  ${({ theme, $isSelf }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      height: ${({ $isSelf }) => ($isSelf ? 'initial' : PROFILE_CARD_HEIGHT)};
    }
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
  color: ${({ theme }) => theme.color.surface.bold};
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

export const PartnerMenuOption = styled(Button)`
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  padding-left: 0px;

  &:not(:last-of-type) {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 498px;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Tag = styled(Text)`
  width: 104px;
  height: 34px;
  font-family: revert;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${({ theme }) => theme.color.text.reverse};
  background-color: ${({ theme }) => theme.color.surface.primary};
  border-radius: 30px;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  color: ${({ theme }) => theme.color.text.heading};
  border: 2px solid ${({ theme }) => theme.color.border.bold};
  filter: drop-shadow(0px 1px 3px rgb(0 0 0 / 22%));
  line-height: 1.1;
`;

export const Description = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

function ProfileCard({
  userPk,
  profile,
  isSelf,
  isOnline,
  isSupport,
  openPartnerModal,
  openEditImage,
  setCallSetupPartner,
  type,
}) {
  const { t } = useTranslation();
  const usesAvatar = profile.image_type === 'avatar';

  return (
    <StyledCard
      width={CardSizes.Small}
      $isSelf={isSelf}
      $unconfirmedMatch={type === 'unconfirmed'}
    >
      {isSelf && openEditImage ? (
        <ProfileImageButton onClick={openEditImage} type="button">
          <ProfileImage
            circle
            image={usesAvatar ? profile.avatar_config : profile.image}
            imageType={profile.image_type}
          />
          <EditIcon circular height="16px" width="16px" />
        </ProfileImageButton>
      ) : (
        <ProfileImage
          image={usesAvatar ? profile.avatar_config : profile.image}
          imageType={profile.image_type}
        />
      )}

      {/* temp disabled type === "match" */}
      {false && (
        <Popover
          width={PopoverSizes.Large}
          showCloseButton
          trigger={
            <MatchMenuToggle type="button" variation={ButtonVariations.Icon}>
              <DotsIcon
                circular
                height="16px"
                width="16px"
                color={designTokens.color.theme.light.text.tertiary}
              />
            </MatchMenuToggle>
          }
        >
          <PartnerMenuOption
            variation={ButtonVariations.Inline}
            onClick={() =>
              openPartnerModal({
                type: PARTNER_ACTION_REPORT,
                userPk,
                userName: profile.first_name,
              })
            }
          >
            {t('cp_menu_report')}
          </PartnerMenuOption>
          <PartnerMenuOption
            variation={ButtonVariations.Inline}
            onClick={() =>
              openPartnerModal({
                type: PARTNER_ACTION_UNMATCH,
                userPk,
                userName: profile.first_name,
              })
            }
          >
            {t('cp_menu_unmatch')}
          </PartnerMenuOption>
        </Popover>
      )}
      <OnlineIndicator isOnline={isOnline} />
      <ProfileInfo>
        <NameContainer>
          <Text type={'Body3'} bold>
            {profile.first_name}
          </Text>
          {isSupport && (
            <Tag type={TextTypes.Body6} bold>
              {t('profile_card.support_user')}
              <Logo height="12px" width="12px" />
            </Tag>
          )}
        </NameContainer>

        <Description>
          {isSupport
            ? t('profile_card.support_description')
            : profile.description}
        </Description>
      </ProfileInfo>
      {!isSelf && (
        <Actions>
          <MenuLink to={getAppRoute()} state={{ userPk }}>
            <ProfileIcon
              gradient={Gradients.Orange}
              label="visit profile"
              labelId="visit_profile"
            />
            {t('cp_profile')}
          </MenuLink>
          <MenuLink to={getAppRoute(CHAT_ROUTE)} state={{ userPk }}>
            <MessageIcon
              gradient={Gradients.Orange}
              label="chat icon"
              labelId="chat_icon"
            />
            {t('cp_message')}
          </MenuLink>
          <Button
            type="button"
            variation={ButtonVariations.Option}
            onClick={() => setCallSetupPartner(userPk)}
          >
            <PhoneIcon
              gradient={Gradients.Orange}
              label="call icon"
              labelId="call_icon"
            />
            {t('cp_call')}
          </Button>
        </Actions>
      )}
    </StyledCard>
  );
}

export default ProfileCard;
