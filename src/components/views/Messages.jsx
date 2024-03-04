import React, { useEffect, useState } from 'react';
import 'react-chat-elements/dist/main.css';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

import { fetchChats, fetchMessage } from '../../api/chat';
import PageHeader from '../atoms/PageHeader';
import { ChatWithUserInfo } from '../blocks/ChatCore/Chat';
import { ChatDashboard, MessagesPanel } from './Messages.styles';

const Messages = ({ userPk, matchesInfo, openChatWithId }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(openChatWithId);

  const [messageList, setMessageList] = useState([]);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);

  useEffect(() => {
    fetchChats().then(response => {
      console.log({ response });
      setMessageList(response.results);
    });
  }, []);

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <PageHeader text={t('chat_header')}></PageHeader>
      <ChatDashboard>
        <MessagesPanel
          messages={messageList}
          selectChat={setSelectedChat}
          selectedChat={selectedChat}
        />
        <ChatWithUserInfo
          chatId={selectedChat || messageList[0]?.uuid}
          isFullScreen={selectedChat}
          onBackButton={handleOnChatBackBtn}
          partner={
            selectedChat
              ? messageList?.find(item => item?.uuid === selectedChat)?.partner
              : messageList[0]?.partner
          }
        />
      </ChatDashboard>
    </>
  );
};

export default Messages;
