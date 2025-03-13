import {
  Card,
  Text,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  textParser,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import { getCustomChatElements } from '../../../helpers/chat.ts';
import { formatTimeDistance } from '../../../helpers/date.ts';
import { useSelector } from '../../../hooks/index.ts';
import ProfileImage from '../../atoms/ProfileImage.jsx';

const Panel = styled(Card)<{ $selectedChat?: any }>`
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;
  box-shadow: none;

  ${({ theme, $selectedChat }) => css`
    display: ${$selectedChat ? 'none' : 'flex'};

    @media (min-width: ${theme.breakpoints.xlarge}) {
      display: flex;
      padding: ${theme.spacing.medium};
      width: 400px;
    }
  `}
`;

const Message = styled.button<{ $selected?: boolean }>`
  display: flex;
  position: relative;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  border-radius: 20px;
  border: 2px solid ${({ theme }) => theme.color.border.reversed};
  align-items: center;

  ${({ $selected, theme }) =>
    $selected &&
    `
    @media (min-width: ${theme.breakpoints.medium}) {
      border-color: ${theme.color.border.selected};
      background: ${theme.color.surface.secondary};
    }
      
  `}
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const UserImage = styled(ProfileImage)`
  flex-shrink: 0;
`;

const Time = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Preview = styled.div`
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

const PreviewText = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;

  button {
    display: none;
  }
`;

export const UnreadIndicator = styled.span`
  border-radius: 50%;
  height: 10px;
  width: 10px;
  background: ${({ theme }) => theme.color.gradient.orange10};
`;

interface ChatsPanelProps {
  chats: any[];
  selectChat: (uuid: string) => void;
  selectedChat: string | null;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatsPanel: React.FC<ChatsPanelProps> = ({
  chats,
  selectChat,
  selectedChat,
  scrollRef,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const userId = useSelector(state => state.userData.user?.id);
  const theme = useTheme();

  return (
    <Panel $selectedChat={selectedChat}>
      {chats?.map((message, index) => {
        const isSender = message.newest_message?.sender === userId;
        const customChatElements = message.newest_message?.parsable
          ? getCustomChatElements({ message, userId, isPreview: true })
          : [];

        return (
          <Message
            key={`chat_${message.uuid + index}`}
            $selected={message.uuid === selectedChat}
            onClick={() => selectChat(message.uuid)}
          >
            <UserImage
              circle
              image={
                message.partner.image_type === 'avatar'
                  ? message.partner.avatar_config
                  : message.partner.image
              }
              imageType={message.partner.image_type}
              size="xsmall"
            />
            <Details>
              <Top>
                <Text bold>{message.partner.first_name}</Text>
                {!!message?.newest_message?.created && (
                  <Time type={TextTypes.Body6}>
                    {formatTimeDistance(
                      message.newest_message.created,
                      new Date(),
                      language,
                    )}
                  </Time>
                )}
              </Top>
              <Preview>
                <PreviewText disableParser>
                  {textParser(
                    message.newest_message?.text ||
                      t('chat.no_messages_preview'),
                    { customElements: customChatElements },
                  )}
                </PreviewText>
                {isSender ? (
                  message.newest_message?.read ? (
                    <TickDoubleIcon
                      color={theme.color.status?.info || '#000'}
                      width="16px"
                      height="16px"
                      label="Read"
                      labelId="tick-double-icon"
                    />
                  ) : (
                    <TickIcon
                      width="16px"
                      height="16px"
                      label="Sent"
                      labelId="tick-icon"
                    />
                  )
                ) : message.unread_count ? (
                  <UnreadIndicator />
                ) : null}
              </Preview>
            </Details>
          </Message>
        );
      })}
      <div ref={scrollRef} />
    </Panel>
  );
};

export default ChatsPanel;
