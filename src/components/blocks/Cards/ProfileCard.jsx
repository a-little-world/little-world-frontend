import {
  Button,
  ButtonVariations,
  Card,
  CardSizes,
  DotsIcon,
  Gradients,
  MessageIcon,
  PhoneIcon,
  Popover,
  ProfileIcon,
  Text,
  designTokens,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { CHAT_ROUTE, getAppRoute } from '../../../routes';
import MenuLink from '../../atoms/MenuLink';
import ProfileImage from '../../atoms/ProfileImage';
import {
  PARTNER_ACTION_REPORT,
  PARTNER_ACTION_UNMATCH,
} from './PartnerActionCard';

export const StyledCard = styled(Card)`
  align-items: center;
  margin: 0 auto;
  align-items: center;
  position: relative;
  ${({ $unconfirmedMatch }) =>
    $unconfirmedMatch &&
    css`
      background-color: rgb(252, 224, 172);
    `}
`;

export const ProfileInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => `
  gap: ${theme.spacing.small};
  margin-bottom: ${theme.spacing.xsmall};
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

function ProfileCard({
  userPk,
  profile,
  isSelf,
  isOnline,
  openPartnerModal,
  setCallSetupPartner,
  type,
}) {
  const { t } = useTranslation();
  const usesAvatar = profile.image_type === 'avatar';

  return (
    <StyledCard
      width={CardSizes.Small}
      $unconfirmedMatch={type === 'unconfirmed'}
    >
      <ProfileImage
        image={usesAvatar ? profile.avatar_config : profile.image}
        imageType={profile.image_type}
      />
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
      <div
        className={isOnline ? 'online-indicator online' : 'online-indicator'}
      >
        online <span className="light" />
      </div>
      <ProfileInfo className="profile-info">
        <Text className="name">{`${profile.first_name}`}</Text>
        <Text className="text">{profile.description}</Text>
      </ProfileInfo>
      {!isSelf && (
        <Actions>
          <MenuLink to={getAppRoute('')} state={{ userPk }}>
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
