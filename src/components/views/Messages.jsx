import React, { useEffect, useState } from 'react';
import 'react-chat-elements/dist/main.css';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

import { fetchChats, fetchMessage } from '../../api/chat';
import PageHeader from '../atoms/PageHeader';
import { ChatWithUserInfo } from '../blocks/ChatCore/Chat';
import { ChatDashboard, MessagesPanel } from './Messages.styles';

const Messages = ({ userPk, matchesInfo }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInFocus, setChatInFocus] = useState(false);

  const [messageList, setMessageList] = useState([]);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userWasSelected, setUserWasSelected] = useState(false);

  useEffect(() => {
    fetchChats().then(response => {
      console.log({ response });
      setMessageList(response.results);
      // setSelectedChat(response.results[0].uuid);
    });
  }, []);

  const clickUser = item => {
    selectDialog(item);
    setUserWasSelected(true);
    document.body.classList.add('hide-mobile-header');
  };

  const handleOnChatBackBtn = () => {
    setSelectedChat(null);
    setChatInFocus(false);
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
