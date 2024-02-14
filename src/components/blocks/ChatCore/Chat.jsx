import {
  Button,
  ButtonVariations,
  Card,
  PhoneIcon,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import styled from 'styled-components';

import ProfileImage from '../../atoms/ProfileImage';

export const Panel = styled(Card)`
  flex-grow: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.xsmall};
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

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

export const WriteSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Messages = styled.div`
  height: 100%;
  border: 2px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  overflow-y: scroll;
`;

const Message = styled.div`
  align-self: ${({ $isSelf }) => ($isSelf ? 'flex-end' : 'flex-start')};
`;

const MessageText = styled(Text)`
  padding: ${({ theme }) => theme.spacing.xxsmall};
  ${({ $isSelf, theme }) =>
    $isSelf &&
    `
   background: ${theme.color.surface.message};
`}
`;

export const MessageBox = styled(TextArea)`
  height: 36px;
  border-radius: 100px;
  background: ${({ theme }) => theme.color.surface.secondary};
`;

export const Preview = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Chat = ({ messages }) => {
  const fakeDate = formatDistance(subDays(new Date(), 3), new Date(), {
    addSuffix: true,
  });

  return (
    <Panel>
      <TopSection>
        <div>
          <UserImage circle imageType={'avatar'} size={'xsmall'} />
          <Text bold>Sean</Text>
        </div>
        <Button variation={ButtonVariations.Icon}>
          <PhoneIcon circular />
        </Button>
      </TopSection>
      <Messages>
        {messages?.map((message, index) => (
          <Message $isSelf={index % 2 === 0}>
            <MessageText $isSelf={index % 2 === 0}>{message.text}</MessageText>
            <Time type={TextTypes.Body6}>{fakeDate}</Time>
          </Message>
        ))}
      </Messages>
      <WriteSection>
        <MessageBox maxLength={null} />
        <Button>Send</Button>
      </WriteSection>
    </Panel>
  );
};
