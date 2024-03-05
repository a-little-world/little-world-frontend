import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { fetchChats } from '../../api/chat';
import PageHeader from '../atoms/PageHeader';
import { ChatWithUserInfo } from '../blocks/ChatCore/Chat';
import { ChatDashboard, ChatsPanel } from './Messages.styles';

const Messages = ({ openChatWithId }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(openChatWithId);

  const [chatsList, setChatsList] = useState([]);

  useEffect(() => {
    fetchChats().then(response => {
      setChatsList(response.results);
    });
  }, []);

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <PageHeader text={t('chat_header')}></PageHeader>
      <ChatDashboard>
        <ChatsPanel
          chats={chatsList}
          selectChat={setSelectedChat}
          selectedChat={selectedChat}
        />
        <ChatWithUserInfo
          chatId={selectedChat || chatsList[0]?.uuid}
          isFullScreen={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={
            selectedChat
              ? chatsList?.find(item => item?.uuid === selectedChat)?.partner
              : chatsList[0]?.partner
          }
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
