import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Gradients,
  GroupChatIcon,
  SendIcon,
  Text,
  TextAreaSize,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import {
  fetchChat,
  fetchChatMessages,
  markChatMessagesReadApi,
  sendMessage,
} from '../../../api/chat';
import {
  getChatByChatId,
  getMessagesByChatId,
  initCallSetup,
  insertChat,
  markChatMessagesRead,
  updateMessages,
} from '../../../features/userData';
import { addMessage } from '../../../features/userData';
import { formatTimeDistance } from '../../../helpers/date.ts';
import { onFormError, registerInput } from '../../../helpers/form.ts';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, PROFILE_ROUTE, getAppRoute } from '../../../routes.ts';
import {
  BackButton,
  ChatContainer,
  Message,
  MessageBox,
  MessageText,
  Messages,
  NoChatSelected,
  NoMessages,
  Panel,
  ProfileLink,
  SendButton,
  Time,
  TopSection,
  UserImage,
  UserInfo,
  WriteSection,
} from './Chat.styles.tsx';

export const Chat = ({ chatId }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesRef = useRef();
  const userId = useSelector(state => state.userData.user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messages = useSelector(state =>
    getMessagesByChatId(state.userData.messages, chatId, state),
  );
  const messagesResult = messages?.results;
  const activeChat = useSelector(state =>
    getChatByChatId(state.userData.chats, chatId),
  );
  const [messagesSent, setMessagesSent] = useState(0);
  const onError = () => navigate(getAppRoute(MESSAGES_ROUTE));

  const { scrollRef } = useInfiniteScroll({
    fetchItems: fetchChatMessages,
    fetchArgs: { id: chatId },
    fetchCondition: !!chatId,
    items: messagesResult,
    currentPage: messages?.page,
    totalPages: messages?.pages_total,
    setItems: items => dispatch(updateMessages({ chatId, items })),
    onError,
  });

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setFocus,
  } = useForm({ shouldUnregister: true });

  const onSubmitError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onMarkMessagesRead = () => {
    markChatMessagesReadApi({ chatId }).then(() => {
      dispatch(
        markChatMessagesRead({
          chatId,
          userId,
          actorIsSelf: true,
        }),
      );
    });
  };

  useEffect(() => {
    // if activeChat === undefined we know the specific chat isn't loaded yet
    if (!activeChat && chatId) {
      fetchChat({ chatId }).then(data => {
        dispatch(insertChat(data));
      });
    }
    // 'unread_messages_count' also updates when new message are added
    if (activeChat?.unread_count > 0 && !isEmpty(messagesResult)) {
      onMarkMessagesRead();
    }
  }, [activeChat, chatId, isEmpty(messagesResult)]);

  useEffect(() => {
    setFocus('text');
  }, [setFocus]);

  const onSendMessage = ({ text }) => {
    setIsSubmitting(true);
    sendMessage({ text, chatId })
      .then(data => {
        reset();
        dispatch(
          addMessage({
            message: data,
            chatId,
            senderIsSelf: true,
          }),
        );
        setIsSubmitting(false);
        messagesRef.current.scrollTop = 0;
        setMessagesSent(curr => curr + 1);
      })
      .catch(onSubmitError);
  };

  return (
    <ChatContainer>
      <Messages ref={messagesRef}>
        {messages.page &&
          (isEmpty(messagesResult) ? (
            <NoMessages type={TextTypes.Body4}>
              {t('chat.no_messages')}
            </NoMessages>
          ) : (
            <>
              {messagesResult?.map(message => (
                <Message $isSelf={message.sender === userId} key={message.uuid}>
                  <MessageText
                    $isSelf={message.sender === userId}
                    disableParser={!message.parsable}
                  >
                    {message.text}
                  </MessageText>
                  <Time type={TextTypes.Body6}>
                    {message.read ? (
                      <TickDoubleIcon
                        labelId="messageReadIcon"
                        label="message read icon"
                        color={theme.color.status.info}
                        width="16px"
                        height="16px"
                      />
                    ) : (
                      <TickIcon
                        labelId="messageUnreadIcon"
                        label="message unread icon"
                        width="16px"
                        height="16px"
                      />
                    )}
                    {formatTimeDistance(message.created, new Date(), language)}
                  </Time>
                </Message>
              ))}
              <div ref={scrollRef} />
            </>
          ))}
      </Messages>
      <WriteSection onSubmit={handleSubmit(onSendMessage)}>
        <MessageBox
          {...registerInput({
            register,
            name: 'text',
            options: { required: 'error.required' },
          })}
          key={`message ${messagesSent}`}
          id="text"
          error={t(errors?.text?.message)}
          expandable
          placeholder={t('chat.text_area_placeholder')}
          onSubmit={() => handleSubmit(onSendMessage)()}
          size={TextAreaSize.Xsmall}
        />
        <SendButton
          size={ButtonSizes.Large}
          type="submit"
          disabled={isSubmitting}
          variation={ButtonVariations.Circle}
          backgroundColor={theme.color.gradient.orange10}
        >
          <SendIcon
            label={t('chat.send_btn')}
            labelId="send_icon"
            color={theme.color.text.reversed}
            width="20"
            height="20"
          />
        </SendButton>
      </WriteSection>
    </ChatContainer>
  );
};

export const ChatWithUserInfo = ({ chatId, onBackButton, partner }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const callPartner = () => {
    dispatch(initCallSetup({ userId: partner?.id }));
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

          <ProfileLink to={getAppRoute(`${PROFILE_ROUTE}/${partner?.id}`)}>
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
              {partner?.first_name}
            </Text>
          </ProfileLink>
        </UserInfo>
        <Button
          variation={ButtonVariations.Circle}
          onClick={callPartner}
          size={ButtonSizes.Large}
          backgroundColor={theme.color.gradient.orange10}
        >
          <VideoIcon
            color={theme.color.surface.secondary}
            width={24}
            height={24}
          />
        </Button>
      </TopSection>
      <Chat chatId={chatId} />
    </Panel>
  ) : (
    <NoChatSelected>
      <GroupChatIcon gradient={Gradients.Blue} width="144px" height="144px" />
      <Text type={TextTypes.Body4}>{t('chat.not_selected')}</Text>
    </NoChatSelected>
  );
};
