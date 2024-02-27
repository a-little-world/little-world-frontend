import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import styled, { css } from 'styled-components';

import ProfileImage from '../atoms/ProfileImage';

export const ChatDashboard = styled.div`
  position: relative;
  display: flex;
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
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;
  flex-shrink: 0;
  width: 100%;

  ${({ theme, $selectedChat }) => css`
    display: ${$selectedChat ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.medium}) {
      display: flex;
      width: 400px;
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
  transition: 0.25s;

  ${({ $selected, theme }) =>
    $selected &&
    `
      border-color: ${theme.color.border.selected};
      background: ${theme.color.surface.secondary};
  `}
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  justify-content: center;
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
`;

export const MessagesPanel = ({ messages, selectChat, selectedChat }) => {
  return (
    <Panel $selectedChat={selectedChat}>
      {messages?.map((message, index) => (
        <Message
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
              <Time type={TextTypes.Body6}>
                {formatDistance(message.created, new Date(), {
                  addSuffix: true,
                })}
              </Time>
            </Top>
            <Preview>{message.text}</Preview>
          </Details>
        </Message>
      ))}
    </Panel>
  );
};
