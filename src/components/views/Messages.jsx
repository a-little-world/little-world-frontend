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

  const { data: chats, mutate: mutateChats } = useSWR(CHATS_ENDPOINT_SEPERATE, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const { scrollRef } = useIniniteScroll({
    fetchItems: fetchChats,
    fetchCondition: (() => {
      console.log('Full chats object:', chats);
      // Allow fetching if we have initial chats data and either:
      // 1. We're not on the last page, OR
      // 2. We're on the last page but haven't loaded all results yet
      const hasInitialData = !!chats && chats.results?.length > 0;
      const notOnLastPage = chats?.page < chats?.pages_total;
      const onLastPageButIncomplete = chats?.page >= chats?.pages_total && chats?.results?.length < chats?.results_total;
      const condition = hasInitialData && (notOnLastPage || onLastPageButIncomplete);

      console.log('Fetch condition:', condition, {
        chats: !!chats,
        page: chats?.page,
        pages_total: chats?.pages_total,
        results_length: chats?.results?.length,
        results_total: chats?.results_total,
        hasInitialData,
        notOnLastPage,
        onLastPageButIncomplete
      });
      return true;
    })(),
    setItems: newItems => {
      console.log('newItems', newItems);
      mutateChats(prev => {
        // Filter out duplicates by UUID
        const existingUuids = new Set(prev?.results?.map(chat => chat.uuid) || []);
        const newResults = newItems.results.filter(chat => !existingUuids.has(chat.uuid));

        return {
          ...prev,
          results: [...(prev?.results || []), ...newResults],
          page: newItems.page,
          pages_total: newItems.pages_total || 1
        };
      }, {
        revalidate: false,
      });
    },
    currentPage: chats?.page ? chats.page : 0,
    totalPages: chats?.pages_total || 1,
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
