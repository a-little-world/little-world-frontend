import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Gradients,
  GroupChatIcon,
  SendIcon,
  Text,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { formatDistance } from 'date-fns';
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
import { onFormError, registerInput } from '../../../helpers/form';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, getAppRoute } from '../../../routes';
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
  SendButton,
  Time,
  TopSection,
  UserImage,
  UserInfo,
  WriteSection,
} from './Chat.styles.tsx';

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
      <Chat chatId={chatId} />
    </Panel>
  ) : (
    <NoChatSelected>
      <GroupChatIcon
        gradient={Gradients.Blue}
        width={'144px'}
        height={'144px'}
      />
      <Text type={TextTypes.Body4}>{t('chat.not_selected')}</Text>
    </NoChatSelected>
  );
};
export const Chat = ({ chatId }) => {
  const { t } = useTranslation();
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

  const onError = () => navigate(getAppRoute(MESSAGES_ROUTE));

  const { scrollRef } = useInfiniteScroll({
    fetchItems: fetchChatMessages,
    fetchArgs: { id: chatId },
    fetchCondition: !!chatId,
    items: messagesResult,
    currentPage: messages?.currentPage,
    totalPages: messages?.totalPages,
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
    if (activeChat?.unread_count > 0) {
      onMarkMessagesRead();
    }
  }, [activeChat, chatId]);

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
      })
      .catch(onSubmitError);
  };

  return (
    <ChatContainer>
      <Messages ref={messagesRef}>
        {messages.currentPage &&
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
                        color={theme.color.status.info}
                        width="16px"
                        height="16px"
                      />
                    ) : (
                      <TickIcon width="16px" height="16px" />
                    )}
                    {formatDistance(message.created, new Date(), {
                      addSuffix: true,
                    })}
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
          id="text"
          error={t(errors?.text?.message)}
          maxLength={null}
          placeholder={t('chat.text_area_placeholder')}
          onSubmit={() => handleSubmit(onSendMessage)()}
        />
        <SendButton
          size={ButtonSizes.Small}
          type="submit"
          disabled={isSubmitting}
          variation={ButtonVariations.Icon}
        >
          <SendIcon
            label={t('chat.send_btn')}
            labelId={'send_icon'}
            circular
            width="20"
            height="20"
            color={theme.color.text.reversed}
            backgroundColor={theme.color.gradient.orange}
          />
        </SendButton>
      </WriteSection>
    </ChatContainer>
  );
};
