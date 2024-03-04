import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Card,
  Text,
  TextArea,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { css, useTheme } from 'styled-components';

import { fetchChatMessages, sendMessage } from '../../../api/chat';
import { initCallSetup, setActiveChat } from '../../../features/userData';
import { onFormError, registerInput } from '../../../helpers/form';
import { MESSAGES_ROUTE, getAppRoute } from '../../../routes';
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
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.secondary};
  padding-left: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const WriteSection = styled.form`
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
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  overflow-y: scroll;
`;

const Message = styled.div`
  align-self: ${({ $isSelf }) => ($isSelf ? 'flex-end' : 'flex-start')};
  align-items: ${({ $isSelf }) => ($isSelf ? 'flex-end' : 'flex-start')};
  display: flex;
  flex-direction: column;
`;

const MessageText = styled(Text)`
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.xsmall}`};
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

const NoMessages = styled(Text)`
  height: 100%;
  background: ${({ theme }) => theme.color.surface.tertiary};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  padding: ${({ theme }) => theme.spacing.xxsmall};
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
  min-width: unset;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
  overflow-y: hidden;
`;

export const ChatWithUserInfo = ({
  chatId,
  isFullScreen,
  onBackButton,
  partner,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const callPartner = () => {
    dispatch(initCallSetup({ userId: partner?.id }));
  };
  console.log({ chatId });
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
            image={
              partner?.image_type === 'avatar'
                ? partner?.avatar_config
                : partner?.image
            }
            imageType={partner?.image_type}
          />
          <Text bold type={TextTypes.Body4}>
            {partner?.first_name}
          </Text>
        </UserInfo>
        <Button variation={ButtonVariations.Control} onClick={callPartner}>
          <VideoIcon
            circular
            width={24}
            height={24}
            color={theme.color.surface.secondary}
            backgroundColor={theme.color.gradient.orange}
            borderColor={theme.color.gradient.orange}
          />
        </Button>
      </TopSection>
      <Chat chatId={chatId} partner={partner} />
    </Panel>
  );
};
export const Chat = ({ chatId, partner }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [chatData, setChatData] = useState([]);
  const activeChat = useSelector(state => state.userData.activeChat);
  // console.log({ activeChat });
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({ shouldUnregister: true });

  useEffect(() => {
    if (chatId)
      fetchChatMessages({ id: chatId })
        .then(data => {
          // setChatData(data);
          dispatch(setActiveChat(data));
        })
        .catch(() => {
          navigate(getAppRoute(MESSAGES_ROUTE));
        });
  }, [chatId]);

  const onSubmitError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onSendMessage = ({ text }) => {
    setIsSubmitting(true);
    sendMessage({ text, chatId })
      .then(data => {
        console.log({ data });
        reset();
        setIsSubmitting(false);
      })
      .catch(onSubmitError);
  };

  return (
    <ChatContainer>
      <Messages>
        {activeChat?.results ? (
          activeChat?.results?.map((message, index) => (
            <Message $isSelf={index % 2 === 0} key={message.uuid}>
              <MessageText $isSelf={index % 2 === 0}>
                {message.text}
              </MessageText>
              <Time type={TextTypes.Body6}>
                {message.read ? (
                  <TickDoubleIcon width="12px" height="12px" />
                ) : (
                  <TickIcon width="12px" height="12px" />
                )}
                {formatDistance(message.created, new Date(), {
                  addSuffix: true,
                })}
              </Time>
            </Message>
          ))
        ) : (
          <NoMessages type={TextTypes.Body4}>
            You have no messages yet. Send a message now!
          </NoMessages>
        )}
      </Messages>
      <WriteSection onSubmit={handleSubmit(onSendMessage)}>
        <TextArea
          {...registerInput({
            register,
            name: 'text',
            options: { required: 'error.required' },
          })}
          id="text"
          error={t(errors?.text?.message)}
          maxLength={null}
          placeholder={t('chat.text_area_placeholder')}
        />
        <SendButton
          size={ButtonSizes.Small}
          type="submit"
          disabled={isSubmitting}
        >
          {t('chat.send_btn')}
        </SendButton>
      </WriteSection>
    </ChatContainer>
  );
};
