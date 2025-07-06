import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import { fetchChats } from '../../api/chat.ts';
import { CHATS_ENDPOINT_SEPERATE, fetcher } from '../../features/swr/index.ts';
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
  const selectChat = (selectedChatId) => {
    setSelectedChat(selectedChatId);
    navigate(getAppRoute(`chat/${selectedChatId}`));
  };

  const { data: chats } = useSWR(CHATS_ENDPOINT_SEPERATE, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    setItems: newItems => {
      console.log('newItems', newItems);
      mutate(CHATS_ENDPOINT_SEPERATE, {
        ...chats,
        results: [...(chats?.results || []), ...newItems.results],
        page: newItems.page,
        pages_total: newItems.pages_total || 0
      }, false);
    },
    currentPage: chats?.page || 1,
    totalPages: chats?.pages_total || 0,
    items: chats?.results || [],
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
          chats={chats?.results || []}
          selectChat={selectChat}
          selectedChat={selectedChat}
          scrollRef={scrollRef}
        />
        <ChatWithUserInfo
          chatId={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={chats?.results?.find(item => item?.uuid === selectedChat)?.partner}
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
