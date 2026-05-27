import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Gradients,
  GroupChatIcon,
  Link,
  Tag,
  TagAppearance,
  TagSizes,
  Text,
  TextAreaSize,
  TextTypes,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { useCallSetupStore } from '../../../features/stores/index';
import { USER_ENDPOINT, getChatEndpoint } from '../../../features/swr/index';
import { PROFILE_ROUTE, getAppRoute } from '../../../router/routes';
import { CircleImageLoading, LoadingLine } from '../../atoms/Loading';
import SupportTag from '../../atoms/SupportTag';
import Chat from './Chat';
import {
  BackButton,
  MessageBox,
  MessagesSkeleton,
  NoChatSelected,
  Panel,
  ProfileLink,
  TopSection,
  UserImage,
  UserInfo,
} from './Chat.styles';

interface Partner {
  id: string;
  first_name: string;
  image: string;
  image_type: string;
  avatar_config: object;
}

interface ChatWithUserInfoProps {
  chatId?: string;
  isLoading?: boolean;
  isSupportChat?: boolean;
  onBackButton?: () => void;
  partner?: Partner;
}

const ChatWithUserInfo: React.FC<ChatWithUserInfoProps> = ({
  chatId,
  isLoading: isLoadingProp,
  isSupportChat,
  onBackButton,
  partner,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: user } = useSWR(USER_ENDPOINT);
  const loggedInAsSupport = user?.isSupport;
  const { data: activeChat, isLoading: isChatLoading } = useSWR(
    chatId ? getChatEndpoint(chatId) : null,
  );
  const unmatched = activeChat?.is_unmatched;

  const callSetup = useCallSetupStore();

  const callPartner = () => {
    callSetup.initCallSetup({ userId: partner?.id });
  };

  if (isLoadingProp || (chatId && (!partner || isChatLoading))) {
    return (
      <Panel>
        <TopSection>
          <UserInfo>
            <CircleImageLoading $size="xsmall" />
            <LoadingLine $width="120px" $height="16px" />
          </UserInfo>
        </TopSection>
        <MessagesSkeleton />
        <MessageBox disabled size={TextAreaSize.Xsmall} />
      </Panel>
    );
  }

  return chatId ? (
    <Panel>
      <TopSection>
        <UserInfo>
          <BackButton
            variation={ButtonVariations.Icon}
            onClick={onBackButton}
            $show={!!onBackButton}
          >
            <ArrowLeftIcon label="return to profile" width="16" height="16" />
          </BackButton>

          <ProfileLink
            as={unmatched || isSupportChat ? 'div' : RouterLink}
            to={getAppRoute(`${PROFILE_ROUTE}/${partner?.id}`)}
          >
            <UserImage
              circle
              image={
                partner?.image_type === 'avatar'
                  ? partner?.avatar_config
                  : partner?.image
              }
              imageType={partner?.image_type}
              size="xsmall"
            />
            <Text bold type={TextTypes.Body4}>
              {unmatched ? t('chat.unmatched_user') : partner?.first_name}
            </Text>
          </ProfileLink>
          {loggedInAsSupport && (
            <Link
              href={`${window?.origin}/matching/user/${partner?.id}`}
              target="_blank"
            >
              Admin Profile
            </Link>
          )}
        </UserInfo>
        {unmatched ? (
          <Tag size={TagSizes.small} appearance={TagAppearance.error}>
            {t('chat.inactive_match')}
          </Tag>
        ) : isSupportChat ? (
          <SupportTag />
        ) : (
          <Button
            variation={ButtonVariations.Circle}
            onClick={callPartner}
            size={ButtonSizes.Large}
          >
            <VideoIcon
              label="Video Call Icon"
              color={theme.color.surface.secondary}
              width={24}
              height={24}
            />
          </Button>
        )}
      </TopSection>
      <Chat chatId={chatId} />
    </Panel>
  ) : (
    <NoChatSelected $isSupportChat={isSupportChat}>
      <GroupChatIcon
        label="Chat Icon"
        gradient={Gradients.Blue}
        width="144px"
        height="144px"
      />
      <Text type={TextTypes.Body4}>
        {isSupportChat ? t('chat.support_unavailable') : t('chat.not_selected')}
      </Text>
    </NoChatSelected>
  );
};

export default ChatWithUserInfo;
