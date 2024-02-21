import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Card,
  PhoneIcon,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { fetchChatMessages } from '../../../api/chat';
import ProfileImage from '../../atoms/ProfileImage';

export const Panel = styled(Card)`
  flex-grow: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.small}`};
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme, $isFullScreen }) =>
    $isFullScreen
      ? css`
          display: flex;
          @media (min-width: ${theme.breakpoints.medium}) {
            position: relative;
          }
        `
      : css`
          display: none;
          @media (min-width: ${theme.breakpoints.medium}) {
            display: flex;
          }
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
  padding-left: ${({ theme }) => theme.spacing.small};
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
`;

export const WriteSection = styled.div`
  display: flex;
  align-items: flex-start;
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
  padding: ${({ theme }) => theme.spacing.xsmall};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};

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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Preview = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const BackButton = styled(Button)`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  color: ${({ theme }) => theme.color.text.link};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;

const SendButton = styled(Button)`
  height: 36px;
`;

export const Chat = ({ chatId, isFullScreen, onBackButton, partner }) => {
  const { t } = useTranslation();
  const [chatData, setChatData] = useState(null);
  const fakeDate = formatDistance(subDays(new Date(), 3), new Date(), {
    addSuffix: true,
  });

  useEffect(() => {
    if (chatId)
      fetchChatMessages({ id: chatId }).then(data => {
        setChatData(data);
      });
  }, [chatId]);

  return (
    <Panel $isFullScreen={isFullScreen}>
      <TopSection>
        <UserInfo>
          <BackButton
            variation={ButtonVariations.Icon}
            onClick={onBackButton}
            $show={isFullScreen && !!onBackButton}
          >
            <ArrowLeftIcon
              labelId="return to profile"
              label="return to profile"
              width="16"
              height="16"
            />
          </BackButton>
          <UserImage
            circle
            size={'xsmall'}
            image={partner?.image}
            imageType={partner?.image_type}
          />
          <Text bold type={TextTypes.Body4}>
            {partner?.first_name}
          </Text>
        </UserInfo>
        <Button variation={ButtonVariations.Icon}>
          <PhoneIcon circular />
        </Button>
      </TopSection>
      <Messages>
        {chatData?.results?.map((message, index) => (
          <Message $isSelf={index % 2 === 0} key={message.uuid}>
            <MessageText $isSelf={index % 2 === 0}>{message.text}</MessageText>
            <Time type={TextTypes.Body6}>{fakeDate}</Time>
          </Message>
        ))}
      </Messages>
      <WriteSection>
        <MessageBox
          maxLength={null}
          placeholder={t('chat.text_area_placeholder')}
        />
        <SendButton size={ButtonSizes.Small}>Send</SendButton>
      </WriteSection>
    </Panel>
  );
};
