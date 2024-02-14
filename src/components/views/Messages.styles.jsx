import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import styled from 'styled-components';

import ProfileImage from '../atoms/ProfileImage';

export const ChatDashboard = styled.div`
  display: flex;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  overflow-y: scroll;
`;

export const Panel = styled(Card)`
  width: 400px;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;
  flex-shrink: 0;
`;

export const Message = styled.div`
  display: flex;
  position: relative;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  border-radius: 20px;

  ${({ $selected, theme }) =>
    $selected &&
    `
    border: 2px solid ${theme.color.border.selected};
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

export const MessagesPanel = ({ messages }) => {
  const fakeDate = formatDistance(subDays(new Date(), 3), new Date(), {
    addSuffix: true,
  });

  return (
    <Panel>
      {messages?.map((message, index) => (
        <Message $selected={!index}>
          <UserImage circle imageType={'avatar'} size={'xsmall'} />
          <Details>
            <Top>
              <Text bold>{message.sender_username}</Text>
              <Time type={TextTypes.Body6}>{fakeDate}</Time>
            </Top>
            <Preview>{message.text}</Preview>
          </Details>
        </Message>
      ))}
    </Panel>
  );
};
