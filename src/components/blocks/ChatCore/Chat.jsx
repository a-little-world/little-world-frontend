import {
  ArrowLeftIcon,
  AttachmentIcon,
  AttachmentWidget,
  Button,
  ButtonSizes,
  ButtonVariations,
  CallWidget,
  Gradients,
  GroupChatIcon,
  Link,
  SendIcon,
  Tag,
  TagAppearance,
  TagSizes,
  Text,
  TextAreaSize,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  VideoIcon,
  textParser,
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
  addMessage,
  getChatByChatId,
  getMessagesByChatId,
  initCallSetup,
  insertChat,
  markChatMessagesRead,
  updateMessages,
} from '../../../features/userData';
import { formatTimeDistance } from '../../../helpers/date.ts';
import { onFormError, registerInput } from '../../../helpers/form.ts';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, PROFILE_ROUTE, getAppRoute } from '../../../routes.ts';
import {
  AttachmentButton,
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

const getCustomChatElements = (message, userId, activeChat) => {
  const customChatElements = [
    {
      Component: CallWidget,
      tag: 'MissedCallWidget',
      props: { 
        isMissed: true,
        header: message.sender !== userId ? 'Anruf Verpasst' : 'Nicht beantwortet',
        description: message.sender !== userId ? 'Zurück Rufen' : 'Erneut anrufen',
        isOutgoing: message.sender === userId,
        returnCallLink: `/call-setup/${message.sender === userId ? activeChat?.partner?.id : message.sender}`
      },
    },
    {
      Component: CallWidget,
      tag: 'CallWidget',
      props: { 
        isMissed: false,
        header: 'Video Anruf',
        isOutgoing: message.sender === userId,
        returnCallLink: `/call-setup/${message.sender === userId ? activeChat?.partner?.id : message.sender}`
      },
    },
    {
      Component: AttachmentWidget,
      tag: 'AttachmentWidget',
      props: {
        attachmentTitle: "Hello there",
        attachmentLink: "https://www.google.com",
        imageSrc: "https://www.google.com",
      },
    }
  ];
  return customChatElements;
}

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
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      reset(); // Clear any existing message text
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = ''; // Reset file input
  };

  console.log("Active chat", activeChat);

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
              {messagesResult?.map(message => {
                const customChatElements = message?.parsable ? getCustomChatElements(message, userId, activeChat) : [];
                return (
                  <Message
                    $isSelf={message.sender === userId}
                    key={message.uuid}
                  >
                    <MessageText
                      $isSelf={message.sender === userId}
                      disableParser={!message.parsable}
                    >
                      {message.parsable
                        ? textParser(message.text, customChatElements)
                        : message.text}
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
                      {formatTimeDistance(
                        message.created,
                        new Date(),
                        language,
                      )}
                    </Time>
                  </Message>
                );
              })}
              <div ref={scrollRef} />
            </>
          ))}
      </Messages>
      <WriteSection onSubmit={handleSubmit(onSendMessage)}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,application/pdf"
        />
        <MessageBox
          {...registerInput({
            register,
            name: 'text',
            options: { required: !selectedFile },
          })}
          key={`message ${messagesSent}`}
          id="text"
          error={t(errors?.text?.message)}
          expandable
          placeholder={selectedFile 
            ? `Selected file: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
            : t('chat.text_area_placeholder')
          }
          disabled={!!selectedFile}
          onSubmit={() => handleSubmit(onSendMessage)()}
          size={TextAreaSize.Xsmall}
        />
        <Button
          size={ButtonSizes.Large}
          type="button"
          variation={ButtonVariations.Circle}
          backgroundColor={selectedFile ? theme.color.status.error : theme.color.gradient.orange10}
          onClick={selectedFile ? clearSelectedFile : handleAttachmentClick}
        >
          <AttachmentIcon
            label={selectedFile ? t('attachment.remove_btn') : t('attachment.upload_btn')}
            labelId="attachment_icon"
            color={theme.color.text.reversed}
            width="20"
            height="20"
          />
        </Button>
        <SendButton
          size={ButtonSizes.Large}
          type="submit"
          disabled={isSubmitting || activeChat?.is_unmatched}
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
  const isSupport = useSelector(state => state.userData.user?.isSupport);
  const activeChat = useSelector(state =>
    getChatByChatId(state.userData.chats, chatId),
  );
  const unmatched = activeChat?.is_unmatched;

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
      <GroupChatIcon gradient={Gradients.Blue} width="144px" height="144px" />
      <Text type={TextTypes.Body4}>{t('chat.not_selected')}</Text>
    </NoChatSelected>
  );
};
