import {
  ArrowLeftIcon,
  Button,
  ButtonSizes,
  ButtonVariations,
  Text,
  TextTypes,
  TickDoubleIcon,
  TickIcon,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { formatDistance } from 'date-fns';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { fetchChatMessages, sendMessage } from '../../../api/chat';
import { initCallSetup } from '../../../features/userData';
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
  NoMessages,
  Panel,
  SendButton,
  Time,
  TopSection,
  UserImage,
  UserInfo,
  WriteSection,
} from './Chat.styles.tsx';

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
      <Chat chatId={chatId} />
    </Panel>
  );
};
export const Chat = ({ chatId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onError = () => navigate(getAppRoute(MESSAGES_ROUTE));
  const {
    items: chatData,
    initialLoad,
    scrollRef,
  } = useInfiniteScroll({
    fetchItems: fetchChatMessages,
    fetchArgs: { id: chatId },
    fetchCondition: !!chatId,
    onError,
  });

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({ shouldUnregister: true });

  const onSubmitError = e => {
    setIsSubmitting(false);
    onFormError({ e, formFields: getValues(), setError, t });
  };

  const onSendMessage = ({ text }) => {
    setIsSubmitting(true);
    sendMessage({ text, chatId })
      .then(data => {
        console.log(data);
        reset();
        // @tbscode if message sending succeeds then it returns the message object
        dispatch(
          addMessage({
            message: data,
            chatId,
          }),
        );
        setIsSubmitting(false);
      })
      .catch(onSubmitError);
  };

  return (
    <ChatContainer>
      <Messages>
        {initialLoad &&
          (isEmpty(chatData) ? (
            <NoMessages type={TextTypes.Body4}>
              {t('chat.no_messages')}
            </NoMessages>
          ) : (
            <>
              {chatData?.map((message, index) => (
                <Message $isSelf={index % 2 === 0} key={message.uuid}>
                  <MessageText $isSelf={index % 2 === 0}>
                    {message.text}
                  </MessageText>
                  <Time type={TextTypes.Body6}>
                    {!message.read ? (
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
