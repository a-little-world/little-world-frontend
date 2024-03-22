import {
  Card,
  Text,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
} from '@a-little-world/little-world-design-system';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled, { css, useTheme } from 'styled-components';

import ProfileImage from '../atoms/ProfileImage';

export const ChatDashboard = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;

export const Panel = styled(Card)`
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;
  box-shadow: none;

  ${({ theme, $selectedChat }) => css`
    display: ${$selectedChat ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.medium}) {
      display: flex;
      width: 400px;
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding: ${theme.spacing.medium};
    }
  `}
`;

export const Message = styled.button`
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

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const UserImage = styled(ProfileImage)`
  flex-shrink: 0;
`;

export const Time = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const Preview = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const UnreadIndicator = styled.span`
  border-radius: 50%;
  height: 10px;
  width: 10px;
  background: ${({ theme }) => theme.color.gradient.orange};
`;

export const ChatsPanel = ({ chats, selectChat, selectedChat, scrollRef }) => {
  const { t } = useTranslation();
  const userId = useSelector(state => state.userData.user?.id);
  const theme = useTheme();

  return (
    <Panel $selectedChat={selectedChat}>
      {chats?.map((message, index) => (
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
            size={'xsmall'}
          />
          <Details>
            <Top>
              <Text bold>{message.partner.first_name}</Text>
              {!!message?.newest_message?.created && (
                <Time type={TextTypes.Body6}>
                  {formatDistance(message.newest_message.created, new Date(), {
                    addSuffix: true,
                  })}
                </Time>
              )}
            </Top>
            <Preview>
              {message.newest_message?.text || t('chat.no_messages_preview')}
              {message.newest_message?.sender === userId &&
                (message.newest_message?.read ? (
                  <TickDoubleIcon
                    color={theme.color.status.info}
                    width="16px"
                    height="16px"
                  />
                ) : (
                  <TickIcon width="16px" height="16px" />
                ))}
              {!!message.unread_count && <UnreadIndicator />}
            </Preview>
          </Details>
        </Message>
      ))}
      <div ref={scrollRef} />
    </Panel>
  );
};
