import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchChats } from '../../api/chat';
import { updateChats } from '../../features/userData.js';
import useIniniteScroll from '../../hooks/useInfiniteScroll.tsx';
import PageHeader from '../atoms/PageHeader';
import { ChatWithUserInfo } from '../blocks/ChatCore/Chat';
import { ChatDashboard, ChatsPanel } from './Messages.styles';

const Messages = ({ openChatWithId }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(openChatWithId);
  const chats = useSelector(state => state.userData.chats);
  const dispatch = useDispatch();
  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: items => dispatch(updateChats(items)),
    items: chats,
  });

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <PageHeader text={t('chat_header')}></PageHeader>
      <ChatDashboard>
        <ChatsPanel
          chats={chats}
          selectChat={setSelectedChat}
          selectedChat={selectedChat}
          scrollRef={scrollRef}
        />
        <ChatWithUserInfo
          chatId={selectedChat || chats[0]?.uuid}
          isFullScreen={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={
            selectedChat
              ? chats?.find(item => item?.uuid === selectedChat)?.partner
              : chats[0]?.partner
          }
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
