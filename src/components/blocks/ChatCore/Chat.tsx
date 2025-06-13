import {
  AttachmentIcon,
  ButtonSizes,
  ButtonVariations,
  CloseIcon,
  PlusIcon,
  SendIcon,
  Text,
  TextAreaSize,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  textParser,
} from '@a-little-world/little-world-design-system';
import { isSameDay } from 'date-fns';
import { get, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import useSWR from 'swr';
import {
  fetchChat,
  fetchChatMessages,
  markChatMessagesReadApi,
  sendFileAttachmentMessage,
  sendMessage,
} from '../../../api/chat.ts';
import { CHATS_ENDPOINT, USER_ENDPOINT, fetcher, getChatEndpoint, getChatMessagesEndpoint } from '../../../features/swr/index.ts';
import {
  formatFileName,
  getCustomChatElements,
  messageContainsWidget,
} from '../../../helpers/chat.ts';
import { formatMessageDate, formatTime } from '../../../helpers/date.ts';
import {
  ROOT_SERVER_ERROR,
  onFormError,
  registerInput,
} from '../../../helpers/form.ts';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, getAppRoute } from '../../../router/routes.ts';
import UnreadDot from '../../atoms/UnreadDot.tsx';
import {
  Attachment,
  AttachmentButton,
  ChatContainer,
  Message,
  MessageBox,
  MessageGroup,
  MessageText,
  Messages,
  NoMessages,
  SendButton,
  StickyDateHeader,
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
  const messagesRef = useRef();
  const { data: user } = useSWR(USER_ENDPOINT, fetcher)
  const userId = user?.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: chat, mutate: mutateChat } = useSWR(getChatEndpoint(chatId), fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  })

  const { data: chats, mutate: mutateChats } = useSWR(CHATS_ENDPOINT, fetcher)
  const { data: chatMessages, mutate: mutateMessages } = useSWR(getChatMessagesEndpoint(chatId, 1), fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: true,
  })
  const activeChat = chats?.results?.find(chat => chat?.uuid === chatId)
  const messages = chatMessages?.results || []
  const messagesResult = messages

  console.log('chatMessages', chatMessages, messages)

  const [messagesSent, setMessagesSent] = useState(0);
  const onError = () => navigate(getAppRoute(MESSAGES_ROUTE));
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const { scrollRef } = useInfiniteScroll({
    fetchItems: fetchChatMessages,
    fetchArgs: { id: chatId },
    fetchCondition: !!chatId,
    items: messages,
    currentPage: chatMessages?.page,
    totalPages: chatMessages?.pages_total,
    setItems: items => {
      mutateMessages(prev => ({
        ...prev,
        results: [...prev.results, ...items],
      }), {
        revalidate: false,
      })
    },
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
      mutateChat(prev => ({
        ...prev,
        unread_count: 0,
      }), {
        revalidate: false,
      })

      mutateMessages(prev => ({
        ...prev,
        results: prev.results.map(message => ({
          ...message,
          read: true,
        })),
      }))

    });
  };

  useEffect(() => {
    // if activeChat === undefined we know the specific chat isn't loaded yet
    if (!activeChat && chatId) {
      fetchChat({ chatId }).then(data => {
        mutateChats(prev => ({
          ...prev,
          results: [...prev.results, data],
        }), {
          revalidate: false,
        })
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
      const fileWithMetadata = new File([file], formatFileName(file.name), {
        type: file.type,
        lastModified: file.lastModified,
      });
      setSelectedFile(fileWithMetadata);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    reset();
    fileInputRef.current.value = ''; // Reset file input
  };

  const onMessageSent = data => {
    reset();
    clearSelectedFile();
    mutateMessages(prev => ({
      ...prev,
      results: [data, ...prev.results],
    }), {
      revalidate: true,
    })
    setIsSubmitting(false);
    messagesRef.current.scrollTop = 0;
    setMessagesSent(curr => curr + 1);
  };

  const onSendMessage = ({ text }) => {
    setIsSubmitting(true);

    if (selectedFile) {
      sendFileAttachmentMessage({
        file: selectedFile,
        text,
        chatId,
        onError: onSubmitError,
        onSuccess: onMessageSent,
      });
    } else {
      sendMessage({
        text,
        chatId,
        onError: onSubmitError,
        onSuccess: onMessageSent,
      });
    }
  };

  const groupMessagesByDate = ungroupedMessages => {
    if (!ungroupedMessages) return [];

    return ungroupedMessages.reduce((groups, message) => {
      const messageDate = new Date(message.created);
      const prevGroup = groups[groups.length - 1];

      // If this is the first message or the date is different from the last group
      if (!prevGroup || !isSameDay(messageDate, prevGroup.date)) {
        groups.push({
          date: messageDate,
          formattedDate: formatMessageDate(messageDate, language, t),
          messages: [message],
        });
      } else {
        // Add message to existing group
        prevGroup.messages.unshift(message);
      }

      return groups;
    }, []);
  };

  const messageGroups = groupMessagesByDate(messagesResult);

  return (
    <ChatContainer>
      <Messages ref={messagesRef}>
        {chatMessages?.page &&
          (isEmpty(messagesResult) ? (
            <NoMessages type={TextTypes.Body4}>
              {t('chat.no_messages')}
            </NoMessages>
          ) : (
            <>
              {messageGroups.map((group, groupIndex) => (
                <MessageGroup key={group.date.toISOString()}>
                  <StickyDateHeader
                    $isSticky={groupIndex !== messageGroups.length - 1}
                  >
                    <Text type={TextTypes.Body6}>{group.formattedDate}</Text>
                  </StickyDateHeader>
                  {group.messages.map(message => {
                    const customChatElements = message?.parsable
                      ? getCustomChatElements({
                        //dispatch: (action) => {
                        //  console.log('action', action)
                        //},
                        message,
                        userId,
                        activeChat,
                      })
                      : [];

                    return (
                      <Message
                        $isSelf={message.sender === userId}
                        key={message.uuid}
                      >
                        <MessageText
                          {...(message.parsable &&
                            messageContainsWidget(message.text) && {
                            as: 'div',
                          })}
                          disableParser={!message.parsable}
                          $isSelf={message.sender === userId}
                          $isWidget={
                            message.parsable &&
                            messageContainsWidget(message.text)
                          }
                        >
                          {textParser(message.text, {
                            customElements: customChatElements,
                            onlyLinks: !message.parsable,
                          })}
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
                          {formatTime(new Date(message.created))}
                        </Time>
                      </Message>
                    );
                  })}
                </MessageGroup>
              ))}
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
          accept="application/pdf, .pdf,.doc,.docx,.txt,.rtf,.odt,
                    .jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,
                    .ppt,.pptx,.xls,.xlsx,.csv, image/*"
        />

        <MessageBox
          {...registerInput({
            register,
            name: 'text',
            options: { required: !selectedFile },
          })}
          key={`message ${messagesSent}`}
          id="text"
          error={t(get(errors, `${ROOT_SERVER_ERROR}.message`))}
          expandable
          placeholder={t('chat.text_area_placeholder')}
          onSubmit={() => handleSubmit(onSendMessage)()}
          size={TextAreaSize.Xsmall}
        />
        {!!selectedFile && (
          <Attachment>
            <AttachmentIcon
              label={`Selected file: ${selectedFile.name}`}
              height={40}
              width={40}
            />
            <UnreadDot count={1} height="18px" top="0px" right="22px" />
          </Attachment>
        )}
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
