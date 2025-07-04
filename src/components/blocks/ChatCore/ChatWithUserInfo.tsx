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
  TextTypes,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { useCallSetupStore } from '../../../features/stores/index.ts';
import {
  USER_ENDPOINT,
  fetcher,
  getChatEndpoint
} from '../../../features/swr/index.ts';
import { PROFILE_ROUTE, getAppRoute } from '../../../router/routes.ts';
import {
  BackButton,
  NoChatSelected,
  Panel,
  ProfileLink,
  TopSection,
  UserImage,
  UserInfo,
} from './Chat.styles.tsx';
import Chat from './Chat.tsx';

interface Partner {
  id: string;
  first_name: string;
  image: string;
  image_type: string;
  avatar_config: object;
}

interface ChatWithUserInfoProps {
  chatId: string;
  onBackButton?: () => void;
  partner: Partner;
}

const ChatWithUserInfo: React.FC<ChatWithUserInfoProps> = ({
  chatId,
  onBackButton,
  partner,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { data: user } = useSWR(USER_ENDPOINT, fetcher);
  const isSupport = user?.isSupport;
  const { data: activeChat } = useSWR(chatId ? getChatEndpoint(chatId) : null, fetcher)

  const unmatched = activeChat?.is_unmatched;

  const callSetup = useCallSetupStore();

  const callPartner = () => {
    callSetup.initCallSetup({ userId: partner?.id });
  };

  return chatId ? (
    <Panel>
      <TopSection>
        <UserInfo>
          <BackButton
            variation={ButtonVariations.Icon}
            onClick={onBackButton}
            $show={!!onBackButton}
          >
            <ArrowLeftIcon
              labelId="return to profile"
              label="return to profile"
              width="16"
              height="16"
            />
          </BackButton>

          <ProfileLink
            to={
              unmatched ? null : getAppRoute(`${PROFILE_ROUTE}/${partner?.id}`)
            }
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
          {isSupport && (
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
        ) : (
          <Button
            variation={ButtonVariations.Circle}
            onClick={callPartner}
            size={ButtonSizes.Large}
            backgroundColor={theme.color.gradient.orange10}
          >
            <VideoIcon
              label="Video Call Icon"
              labelId="VideoCallIcon"
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
    <NoChatSelected>
      <GroupChatIcon
        label="Chat Icon"
        labelId="ChatIcon"
        gradient={Gradients.Blue}
        width="144px"
        height="144px"
      />
      <Text type={TextTypes.Body4}>{t('chat.not_selected')}</Text>
    </NoChatSelected>
  );
};

export default ChatWithUserInfo;
