import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchChats } from '../../api/chat.ts';
import { updateChats } from '../../features/userData';
import useIniniteScroll from '../../hooks/useInfiniteScroll.tsx';
import { MESSAGES_ROUTE, getAppRoute } from '../../router/routes.ts';
import PageHeader from '../atoms/PageHeader.tsx';
import ChatWithUserInfo from '../blocks/ChatCore/ChatWithUserInfo.tsx';
import ChatsPanel from '../blocks/ChatCore/ChatsPanel.tsx';
import { ChatDashboard } from './Messages.styles';

const Messages = () => {
  const { chatId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(chatId);
  const chats = useSelector(state => state.userData.chats);
  const items = chats?.results;
  const dispatch = useDispatch();
  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: newItems => dispatch(updateChats(newItems)),
    currentPage: chats?.page,
    totalPages: chats?.pages_total,
    items,
  });

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
    navigate(getAppRoute(MESSAGES_ROUTE));
  };

  return (
    <>
      <PageHeader text={t('chat_header')} />
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
