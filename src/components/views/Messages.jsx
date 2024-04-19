import React, { useState } from 'react';
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
  const items = chats?.results;
  const dispatch = useDispatch();
  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: items => dispatch(updateChats(items)),
    currentPage: chats?.currentPage,
    totalPages: chats?.totalPages,
    items,
  });

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <PageHeader text={t('chat_header')}></PageHeader>
      <ChatDashboard>
        <ChatsPanel
          chats={items}
          selectChat={setSelectedChat}
          selectedChat={selectedChat}
          scrollRef={scrollRef}
        />
        <ChatWithUserInfo
          chatId={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={items?.find(item => item?.uuid === selectedChat)?.partner}
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
