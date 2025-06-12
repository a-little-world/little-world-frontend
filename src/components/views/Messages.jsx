import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import { fetchChats } from '../../api/chat.ts';
import { CHATS_ENDPOINT, fetcher } from '../../features/swr/index.ts';
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
  const { data: chats } = useSWR(CHATS_ENDPOINT, fetcher);
  const items = chats?.results;
  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: newItems => mutate(CHATS_ENDPOINT), // TODO: can this be directly updated?
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
