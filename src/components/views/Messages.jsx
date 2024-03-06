import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchChats } from '../../api/chat';
import useIniniteScroll from '../../hooks/useInfiniteScroll.tsx';
import PageHeader from '../atoms/PageHeader';
import { ChatWithUserInfo } from '../blocks/ChatCore/Chat';
import { ChatDashboard, ChatsPanel } from './Messages.styles';

const Messages = ({ openChatWithId }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(openChatWithId);
  const { items, scrollRef } = useIniniteScroll({ fetchItems: fetchChats });

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
          chatId={selectedChat || items[0]?.uuid}
          isFullScreen={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={
            selectedChat
              ? items?.find(item => item?.uuid === selectedChat)?.partner
              : items[0]?.partner
          }
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
