import {
  Button,
  ButtonVariations,
  Modal,
  PhoneIcon,
  Text,
} from '@a-little-world/little-world-design-system';
import throttle from 'lodash.throttle';
import React, { Component, useEffect, useState } from 'react';
import { Input, MessageList, Navbar, SideBar } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import { withTranslation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReconnectingWebSocket from 'reconnecting-websocket';
import sanitizeHtml from 'sanitize-html';

import {
  BACKEND_URL,
  DEVELOPMENT,
  IS_CAPACITOR_BUILD,
  PRODUCTION,
} from '../../ENVIRONMENT';
import { fetchChats, fetchMessage } from '../../api/chat';
import ChatItem from '../../chat/ChatItem-override';
import ChatList from '../../chat/ChatList-override';
import '../../chat/chat-override.css';
import {
  createNewDialogModelFromIncomingMessageBox,
  fetchDialogs,
  fetchMessages,
  fetchSelfInfo,
  filterMessagesForDialog,
  getSubtitleTextFromMessageBox,
  handleIncomingWebsocketMessage,
  markMessagesForDialogAsRead,
  sendIsTypingMessage,
  sendMessageReadMessage,
  sendOutgoingTextMessage,
} from '../../chat/chat.lib';
import AppointmentsLayout from '../../layout/layout';
import Link from '../../path-prepend';
import { getAppRoute } from '../../routes';
import PageHeader from '../atoms/PageHeader';
import { Chat } from '../blocks/ChatCore/Chat';
import ChatCore from '../blocks/ChatCore/ChatCore';
import { ChatDashboard, MessagesPanel } from './Messages.styles';

const chatItemSortingFunction = (a, b) => b.date - a.date;

const addMatchesInfo = (dialogList, matchesInfo) => {
  if (matchesInfo) {
    const result = dialogList.map(dialog => {
      console.log('MATCHINFO', matchesInfo);
      const matchInfo = matchesInfo.filter(
        ({ partner }) => partner.id === dialog.alt,
      )[0];
      console.log('FOUND INFO', matchInfo);
      if (matchInfo === undefined) {
        return Object.assign(dialog, {
          avatar: defaultArcivedChatAvatar,
          title: 'Could not retrieve user info',
        });
      }

      /* we have to modify the original dialog object and not create a new
       * one with object speader so that the object prototype is not altered
       */
      const matchProfile = matchInfo.partner;
      const usesAvatar = matchProfile.image_type === 'avatar';
      let avatarImgOrDefault = usesAvatar
        ? matchProfile.avatar_config
        : matchProfile.image;
      if (
        matchProfile.image === null &&
        Object.keys(matchProfile.avatar_config).length === 0
      ) {
        avatarImgOrDefault = defaultArcivedChatAvatar;
      }
      return Object.assign(dialog, {
        avatar: avatarImgOrDefault,
        title: `${matchProfile.first_name}`,
      });
    });
    return result;
  }
  return dialogList;
};

const Messages = ({ userPk, setCallSetupPartner, matchesInfo }) => {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(null);

  const dispatch = useDispatch();
  const chats = useSelector(state => state.chats);
  const user = useSelector(state => state.user);
  const messages = useSelector(state => state.messages);
  //   const [selectedDialog, setSelectedDialog] = useState(null);
  const [messageList, setMessageList] = useState([]);
  //   const [dialogList, setDialogList] = useState([]);
  //   const [filteredDialogList, setFilteredDialogList] = useState([]);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userWasSelected, setUserWasSelected] = useState(false);
  //   const [pending, setPending] = useState(false);
  //   const [onlinePKs, setOnlinePks] = useState([]);
  //   const [typingPKs, setTypingPks] = useState([]);
  let searchInput;

  // console.log({ dialogList, messageList });

  const selectDialog = item => {
    // do nothing when clicking on the already-selected chat
    // prevents styling of user name in top bar
    const prevId = (selectedDialog || {}).id;
    if (prevId === item.id) {
      return;
    }

    setSelectedDialog(item);
    setDialogList(prevState =>
      prevState.map(el =>
        el.id === item.id
          ? { ...el, statusColorType: 'encircle' }
          : { ...el, statusColorType: undefined },
      ),
    );
    // this.setState(prevState => ({ filteredDialogList: prevState.dialogList }));
    // markMessagesForDialogAsRead(
    //   this.state.socket,
    //   item,
    //   this.state.messageList,
    //   this.setMessageIdAsRead,
    // );
  };

  useEffect(() => {
    fetchChats().then(response => {
      console.log({ response });
      setMessageList(response.results);
      setSelectedChat(response.results[0].uuid);
    });

    fetchDialogs().then(r => {
      const tmpMatchIdMap = {};
      for (let i = 0; i < r.fields[0].length; i++) {
        tmpMatchIdMap[r.fields[0][i].id] = r.fields[0][i].alt;
      }

      if (r.tag === 0) {
        return dialogList;
      }
      const list = addMatchesInfo(r.fields[0], matchesInfo); // add name and imgSrc
      setDialogList(list);
      setFilteredDialogList(list);

      // set selected dialog to match the userPk if supplied, otherwise use first
      if (userPk) {
        const userDialog = dialogList.filter(({ alt }) => alt === userPk)[0];
        selectDialog(userDialog);
      } else {
        selectDialog(list[0]);
      }
    });
    //   this.setState({ socketConnectionState: this.state.socket.readyState });
    //   const that = this;
    //   const { socket } = this.state;
    //   const toastOptions = {
    //     autoClose: 1500,
    //     hideProgressBar: true,
    //     closeOnClick: false,
    //     pauseOnHover: false,
    //     pauseOnFocusLoss: false,
    //     draggable: false,
    //   };

    //   socket.onopen = function (e) {
    //     toast.success('Connected!', toastOptions);
    //     that.setState({ socketConnectionState: socket.readyState });
    //   };
    //   socket.onmessage = function (e) {
    //     that.setState({ socketConnectionState: socket.readyState });

    //     const errMsg = handleIncomingWebsocketMessage(socket, e.data, {
    //       addMessage: that.addMessage,
    //       replaceMessageId: that.replaceMessageId,
    //       addPKToTyping: that.addPKToTyping,
    //       changePKOnlineStatus: that.changePKOnlineStatus,
    //       setMessageIdAsRead: that.setMessageIdAsRead,
    //       newUnreadCount: that.newUnreadCount,
    //       performAdminCallBackAction: action => {
    //         that.props.adminActionCallback(action);
    //       },
    //     });
    //     if (errMsg) {
    //       toast.error(errMsg);
    //     }
    //   };
    //   socket.onclose = function (e) {
    //     toast.info('Disconnected...', toastOptions);
    //     that.setState({ socketConnectionState: socket.readyState });
    //   };
  }, []);

  const localSearch = throttle(() => {
    const val = searchInput.input.value;

    if (!val || val.length === 0) {
      //   this.setState(prevState => ({
      //     filteredDialogList: prevState.dialogList,
      //   }));
    } else {
      //   this.setState(prevState => ({
      //     filteredDialogList: prevState.dialogList.filter(function (el) {
      //       return el.title.toLowerCase().includes(val.toLowerCase());
      //     }),
      //   }));
    }
  }, 100);

  const clickUser = item => {
    selectDialog(item);
    setUserWasSelected(true);
    document.body.classList.add('hide-mobile-header');
  };
  console.log({ chats, messages, messageList });
  return (
    <>
      <PageHeader text={t('chat_header')}></PageHeader>
      <ChatDashboard>
        <MessagesPanel messages={messageList} selectChat={setSelectedChat} />
        <Chat messages={messageList} chatId={selectedChat} />
      </ChatDashboard>
    </>
  );

  return (
    <>
      <Modal open={appointmentsOpen}>
        <AppointmentsLayout
          setClose={() => setAppointmentsOpen(false)}
          id={userPk}
        />
      </Modal>

      <ChatHeader>
        <Text>{t('chat_header')}</Text>
      </ChatHeader>
      <div className={showChat ? 'container' : 'container disable-chat'}>
        <div
          className={
            userWasSelected
              ? 'chat-list-box'
              : 'chat-list-box active-panel-mobile'
          }
        >
          <SideBar
            type="light"
            data={{
              className: '',
              top: (
                <div className="chat-list">
                  <ToastContainer />
                  <Text tag="h3" className="chat-header" />
                  <Input
                    placeholder={t('chat_search')}
                    onKeyPress={e => {
                      if (e.charCode !== 13) {
                        localSearch();
                      }
                      if (e.charCode === 13) {
                        localSearch();

                        e.preventDefault();
                        return false;
                      }
                    }}
                  />

                  <ChatList
                    className="chat-list"
                    onClick={clickUser}
                    dataSource={filteredDialogList
                      .slice()
                      .sort(chatItemSortingFunction)}
                  />
                </div>
              ),
            }}
          />
          <div className="new-partner">
            {!pending && (
              <Link className="find-partner">
                <img className="plus" alt="add" />
                {t('chat_find_new_person')}
              </Link>
            )}
            {pending && (
              <div className="waiting">
                <div className="content">
                  <img className="searching" alt="Search in progress" />
                  <div className="text">
                    <div className="header">
                      {t('chat_search_running_header')}
                    </div>
                    {t('chat_search_running_text')}
                  </div>
                </div>
                <div className="buttons">
                  <Button type="button" className="cancel">
                    {t('chat_search_cancel')}
                  </Button>
                  <Button type="button" className="change">
                    {t('chat_search_change')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={
            userWasSelected ? 'right-panel active-panel-mobile' : 'right-panel'
          }
        >
          <Navbar
            left={
              <>
                <button
                  type="button"
                  className="chat-back"
                  onClick={() => {
                    document.body.classList.remove('hide-mobile-header');
                    setUserWasSelected(false);
                  }}
                >
                  <img alt="return to chat partner selection" />
                </button>
                <Link to={getAppRoute()} state={{ userPk }} className="profile">
                  <ChatItem
                    {...selectedDialog}
                    date={null}
                    unread={0}
                    statusColor={
                      selectedDialog && onlinePKs.includes(selectedDialog.id)
                        ? 'lightgreen'
                        : ''
                    }
                    subtitle={
                      selectedDialog && typingPKs.includes(selectedDialog.id)
                        ? 'typing...'
                        : ''
                    }
                  />
                </Link>
              </>
            }
            right={
              <>
                {/* <Button
                          onClick={() => this.setOpen(true)}
                        >
                          {t("chat_suggest_appointment")}
                        </Button> */}
                <Button
                  variation={ButtonVariations.Icon}
                  onClick={() => setCallSetupPartner(userPk)}
                >
                  <PhoneIcon circular />
                </Button>
              </>
            }
          />
          {/* <div className="buttons-mobile">
            <button type="button" className="free-appointments disabled">
              <span className="text">{t('chat_show_free_appointments')}</span>
            </button>
            <button type="button" className="suggest-appointment disabled">
              <span className="text">{t('chat_suggest_appointment')}</span>
            </button>
          </div> */}
          <ChatCore
            setDialogList={setDialogList}
            userPk={userPk}
            selectedDialog={selectedDialog}
          />
        </div>
      </div>
    </>
  );
};

export default Messages;
