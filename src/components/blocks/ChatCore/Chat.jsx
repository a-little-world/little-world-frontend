import {
  ButtonSizes,
  ButtonVariations,
  CloseIcon,
  PlusIcon,
  SendIcon,
  TextAreaSize,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
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
  sendFileAttachmentMessage,
  sendMessage,
} from '../../../api/chat.ts';
import {
  addMessage,
  getChatByChatId,
  getMessagesByChatId,
  insertChat,
  markChatMessagesRead,
  updateMessages,
} from '../../../features/userData';
import {
  getCustomChatElements,
  messageContainsWidget,
} from '../../../helpers/chat.ts';
import { formatTimeDistance } from '../../../helpers/date.ts';
import { onFormError, registerInput } from '../../../helpers/form.ts';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, getAppRoute } from '../../../routes.ts';
import {
  AttachmentButton,
  ChatContainer,
  Message,
  MessageBox,
  MessageText,
  Messages,
  NoMessages,
  SendButton,
  Time,
  WriteSection,
} from './Chat.styles.tsx';

const Chat = ({ chatId }) => {
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
    console.log({ e });
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

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      // Create a new File object with explicit metadata
      const fileWithMetadata = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      setSelectedFile(fileWithMetadata);
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

  const onSendMessage = ({ text }) => {
    setIsSubmitting(true);

    if (selectedFile) {
      console.log('Sending file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      sendFileAttachmentMessage({
        file: selectedFile,
        chatId,
        onError: onSubmitError,
        onSuccess: data => {
          reset();
          clearSelectedFile();
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
        },
      });
    } else {
      sendMessage({
        text,
        chatId,
        onError: onSubmitError,
        onSuccess: data => {
          reset();
          clearSelectedFile();
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
        },
      });
    }
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
              {messagesResult?.map(message => {
                const customChatElements = message?.parsable
                  ? getCustomChatElements({ message, userId, activeChat })
                  : [];
                return (
                  <Message
                    $isSelf={message.sender === userId}
                    key={message.uuid}
                  >
                    <MessageText
                      disableParser={!message.parsable}
                      $isSelf={message.sender === userId}
                      $isWidget={
                        message.parsable && messageContainsWidget(message.text)
                      }
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
          placeholder={
            selectedFile
              ? `Selected file: ${selectedFile.name} (${(
                  selectedFile.size / 1024
                ).toFixed(1)} KB)`
              : t('chat.text_area_placeholder')
          }
          disabled={!!selectedFile}
          onSubmit={() => handleSubmit(onSendMessage)()}
          size={TextAreaSize.Xsmall}
        />
        <AttachmentButton
          size={ButtonSizes.Large}
          type="button"
          variation={ButtonVariations.Circle}
          backgroundColor={
            selectedFile
              ? theme.color.status.error
              : theme.color.surface.primary
          }
          borderColor={theme.color.text.title}
          color={
            selectedFile ? theme.color.text.reversed : theme.color.text.title
          }
          onClick={selectedFile ? clearSelectedFile : handleAttachmentClick}
        >
          {selectedFile ? (
            <CloseIcon
              label={t('attachment.remove_btn')}
              labelId="remove_attachment"
              onClick={clearSelectedFile}
              width="20"
              height="20"
            />
          ) : (
            <PlusIcon
              label={t('attachment.upload_btn')}
              labelId="attachment_icon"
              width="20"
              height="20"
            />
          )}
        </AttachmentButton>
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

export default Chat;
