/* eslint-disable max-classes-per-file */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "react-chat-elements/dist/main.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./chat-override.css";
import { ToastContainer, toast } from "react-toastify";
import { MessageList, Input, Button, Navbar, SideBar, Popup } from "react-chat-elements";
import throttle from "lodash.throttle";
import { FaWindowClose } from "react-icons/fa";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Link } from "react-router-dom";
import {
  createNewDialogModelFromIncomingMessageBox,
  getSubtitleTextFromMessageBox,
  fetchSelfInfo,
  handleIncomingWebsocketMessage,
  sendOutgoingTextMessage,
  filterMessagesForDialog,
  fetchDialogs,
  fetchMessages,
  fetchUsersList,
  sendIsTypingMessage,
  markMessagesForDialogAsRead,
  sendMessageReadMessage,
} from "./chat.lib";
import ChatItem from "./ChatItem-override";
import ChatList from "./ChatList-override";
import { BACKEND_URL, DEVELOPMENT, PRODUCTION } from "../ENVIRONMENT";

const TYPING_TIMEOUT = 5000;
const chatItemSortingFunction = (a, b) => b.date - a.date;

function getCookie() {
  const name = "csrftoken";
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

class Chat extends Component {
  constructor(props) {
    super(props);
    // Refs
    this.textInput = null;
    this.clearTextInput = () => {
      if (this.textInput) {
        this.textInput.value = "";
      }
    };

    this.searchInput = null;

    this.clearSearchInput = () => {
      if (this.searchInput) this.searchInput.clear();
    };

    this.state = {
      socketConnectionState: 0,
      showNewChatPopup: false,
      newChatChosen: null,
      usersDataLoading: false,
      availableUsers: [],
      messageList: [],
      dialogList: [],
      filteredDialogList: [],
      typingPKs: [],
      onlinePKs: [],
      selfInfo: null,
      selectedDialog: null,
      socket: new ReconnectingWebSocket(
        `${PRODUCTION ? "wss" : "ws"}://${DEVELOPMENT ? BACKEND_URL.substring(7) : window.origin.split("//").pop() }/chat_ws`
      ) /* without the 'https://' */,
    };
    // some js magic
    this.performSendingMessage = this.performSendingMessage.bind(this);
    this.addMessage = this.addMessage.bind(this);
    this.replaceMessageId = this.replaceMessageId.bind(this);
    this.addPKToTyping = this.addPKToTyping.bind(this);
    this.changePKOnlineStatus = this.changePKOnlineStatus.bind(this);
    this.setMessageIdAsRead = this.setMessageIdAsRead.bind(this);
    this.newUnreadCount = this.newUnreadCount.bind(this);

    this.isTyping = throttle(() => {
      sendIsTypingMessage(this.state.socket);
    }, TYPING_TIMEOUT);

    this.localSearch = throttle(() => {
      const val = this.searchInput.input.value;
      console.log(`localSearch with '${val}'`);
      if (!val || val.length === 0) {
        this.setState((prevState) => ({ filteredDialogList: prevState.dialogList }));
      } else {
        this.setState((prevState) => ({
          filteredDialogList: prevState.dialogList.filter(function (el) {
            return el.title.toLowerCase().includes(val.toLowerCase());
          }),
        }));
      }
    }, 100);
  }

  componentDidMount() {
    this.textInput = document.getElementById("textInput");
    fetchMessages().then((r) => {
      if (r.tag === 0) {
        console.log("Fetched messages:");
        console.log(r.fields[0]);
        this.setState({ messageList: r.fields[0] });
      } else {
        console.log("Messages error:");
        toast.error(r.fields[0]);
      }
    });

    fetchDialogs().then((r) => {
      if (r.tag === 0) {
        console.log("Fetched dialogs:");
        console.log(r.fields[0]);
        this.setState({ dialogList: r.fields[0], filteredDialogList: r.fields[0] });
        this.selectDialog(r.fields[0][0]);
      } else {
        console.log("Dialogs error:");
        toast.error(r.fields[0]);
      }
    });
    fetchSelfInfo().then((r) => {
      if (r.tag === 0) {
        console.log("Fetched selfInfo:");
        console.log(r.fields[0]);
        this.setState({ selfInfo: r.fields[0] });
      } else {
        console.log("SelfInfo error:");
        toast.error(r.fields[0]);
      }
    });
    this.setState({ socketConnectionState: this.state.socket.readyState });
    const that = this;
    const { socket } = this.state;
    const toastOptions = {
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: false,
    };

    socket.onopen = function (e) {
      toast.success("Connected!", toastOptions);
      that.setState({ socketConnectionState: socket.readyState });
    };
    socket.onmessage = function (e) {
      that.setState({ socketConnectionState: socket.readyState });

      const errMsg = handleIncomingWebsocketMessage(socket, e.data, {
        addMessage: that.addMessage,
        replaceMessageId: that.replaceMessageId,
        addPKToTyping: that.addPKToTyping,
        changePKOnlineStatus: that.changePKOnlineStatus,
        setMessageIdAsRead: that.setMessageIdAsRead,
        newUnreadCount: that.newUnreadCount,
      });
      if (errMsg) {
        toast.error(errMsg);
      }
    };
    socket.onclose = function (e) {
      toast.info("Disconnected...", toastOptions);
      that.setState({ socketConnectionState: socket.readyState });
      console.log("websocket closed");
    };
  }

  setMessageIdAsRead(msg_id) {
    console.log(`Setting msg_id ${msg_id} as read`);
    this.setState((prevState) => ({
      messageList: prevState.messageList.map(function (el) {
        if (el.data.message_id.Equals(msg_id)) {
          return { ...el, status: "read" };
        }
        return el;
      }),
    }));
  }

  getSocketState() {
    if (this.state.socket.readyState === 0) {
      return "Connecting...";
    }
    if (this.state.socket.readyState === 1) {
      return "Connected";
    }
    if (this.state.socket.readyState === 2) {
      return "Disconnecting...";
    }
    if (this.state.socket.readyState === 3) {
      return "Disconnected";
    }
  }

  selectDialog(item) {
    console.log(`Selecting dialog ${item.id}`);
    this.setState({ selectedDialog: item });
    this.setState((prevState) => ({
      dialogList: prevState.dialogList.map((el) =>
        el.id === item.id
          ? { ...el, statusColorType: "encircle" }
          : { ...el, statusColorType: undefined }
      ),
    }));
    this.setState((prevState) => ({ filteredDialogList: prevState.dialogList }));
    markMessagesForDialogAsRead(
      this.state.socket,
      item,
      this.state.messageList,
      this.setMessageIdAsRead
    );
  }

  addPKToTyping(pk) {
    console.log(`Adding ${pk} to typing pk-s`);
    const l = this.state.typingPKs;
    l.push(pk);
    this.setState({ typingPKs: l });
    const that = this;
    setTimeout(() => {
      // We can't use 'l' here because it might have been changed in the meantime
      console.log(`Will remove ${pk} from typing pk-s`);
      const ll = that.state.typingPKs;
      const index = ll.indexOf(pk);
      if (index > -1) {
        ll.splice(index, 1);
      }
      that.setState({ typingPKs: ll });
    }, TYPING_TIMEOUT);
  }

  changePKOnlineStatus(pk, onoff) {
    console.log(`Setting ${pk} to ${onoff}` ? "online" : "offline" + " status");
    const onlines = this.state.onlinePKs;
    if (onoff) {
      onlines.push(pk);
    } else {
      const index = onlines.indexOf(pk);
      if (index > -1) {
        onlines.splice(index, 1);
      }
    }
    this.setState({ onlinePKs: onlines });
    this.setState((prevState) => ({
      dialogList: prevState.dialogList.map(function (el) {
        if (el.id === pk) {
          if (onoff) {
            return { ...el, statusColor: "lightgreen" };
          }
          return { ...el, statusColor: "" };
        }
        return el;
      }),
    }));
    this.setState((prevState) => ({ filteredDialogList: prevState.dialogList }));
  }

  addMessage(msg) {
    console.log("Calling addMessage for ");

    if (
      !msg.data.out &&
      msg.data.message_id > 0 &&
      this.state.selectedDialog &&
      this.state.selectedDialog.id === msg.data.dialog_id
    ) {
      sendMessageReadMessage(this.state.socket, msg.data.dialog_id, msg.data.message_id);
      msg.status = "read";
    }
    const list = this.state.messageList;
    list.push(msg);
    console.log(msg);
    this.setState({
      messageList: list,
    });
    let doesntNeedLastMessageSet = false;
    if (!msg.data.out) {
      const dialogs = this.state.dialogList;
      const hasDialogAlready = dialogs.some((e) => e.id === msg.data.dialog_id);
      if (!hasDialogAlready) {
        const d = createNewDialogModelFromIncomingMessageBox(msg);
        dialogs.push(d);
        doesntNeedLastMessageSet = true;
        this.setState({
          dialogList: dialogs,
        });
      }
    }
    if (!doesntNeedLastMessageSet) {
      this.setState((prevState) => ({
        dialogList: prevState.dialogList.map(function (el) {
          if (el.id === msg.data.dialog_id) {
            console.log(`Setting dialog ${msg.data.dialog_id} last message`);
            return { ...el, subtitle: getSubtitleTextFromMessageBox(msg) };
          }
          return el;
        }),
      }));
    }

    this.setState((prevState) => ({ filteredDialogList: prevState.dialogList }));
  }

  replaceMessageId(old_id, new_id) {
    console.log(`Replacing random id  ${old_id} with db_id ${new_id}`);
    this.setState((prevState) => ({
      messageList: prevState.messageList.map(function (el) {
        if (el.data.message_id.Equals(old_id)) {
          let new_status = "";
          if (el.data.out) {
            new_status = "sent";
          } else if (
            prevState.selectedDialog &&
            prevState.selectedDialog.id === el.data.dialog_id
          ) {
            sendMessageReadMessage(prevState.socket, el.data.dialog_id, new_id);
            new_status = "read";
          } else {
            new_status = "received";
          }
          return {
            ...el,
            data: {
              ...el.data,
              dialog_id: el.data.dialog_id,
              message_id: new_id,
              out: el.data.out,
            },
            status: new_status,
          };
        }
        return el;
      }),
    }));
  }

  newUnreadCount(dialog_id, count) {
    console.log(`Got new unread count ${count} for dialog ${dialog_id}`);
    this.setState((prevState) => ({
      dialogList: prevState.dialogList.map(function (el) {
        if (el.id === dialog_id) {
          console.log(`Setting new unread count ${count} for dialog ${dialog_id}`);
          return { ...el, unread: count };
        }
        return el;
      }),
    }));
    this.setState((prevState) => ({
      selectedDialog:
        prevState.selectedDialog && prevState.selectedDialog.id === dialog_id
          ? {
              ...prevState.selectedDialog,
              unread: count,
            }
          : prevState.selectedDialog,
    }));
    this.setState((prevState) => ({ filteredDialogList: prevState.dialogList }));
  }

  performSendingMessage() {
    if (this.state.selectedDialog) {
      const userPk = this.state.selectedDialog.id;
      const msgBox = sendOutgoingTextMessage(
        this.state.socket,
        this.textInput.value,
        userPk,
        this.state.selfInfo
      );
      this.clearTextInput();
      console.log("sendOutgoingTextMessage result:");
      console.log(msgBox);
      if (msgBox) {
        this.addMessage(msgBox);
      }
    }
  }

  render() {
    const { t } = this.props;

    const userPk = (this.state.selectedDialog || {}).title;

    return (
      <div className="container">
        <div className="chat-list">
          <SideBar
            type="light"
            top={
              <span className="chat-list">
                <h3 className="chat-header">{t("chat_header")}</h3>
                <Input
                  placeholder={t("chat_search")}
                  onKeyPress={(e) => {
                    if (e.charCode !== 13) {
                      this.localSearch();
                    }
                    if (e.charCode === 13) {
                      this.localSearch();
                      console.log(`search invoke with${this.searchInput.input.value}`);
                      e.preventDefault();
                      return false;
                    }
                  }}
                />

                <ChatList
                  onClick={(item, i, e) => this.selectDialog(item)}
                  dataSource={this.state.filteredDialogList.slice().sort(chatItemSortingFunction)}
                />
              </span>
            }
          />
        </div>
        <div className="right-panel">
          <ToastContainer />
          <Popup
            show={this.state.showNewChatPopup}
            header="New chat"
            headerButtons={[
              {
                type: "transparent",
                color: "black",
                text: "close",
                icon: {
                  component: <FaWindowClose />,
                  size: 18,
                },
                onClick: () => {
                  this.setState({ showNewChatPopup: false });
                },
              },
            ]}
            renderContent={() => {
              if (this.state.usersDataLoading) {
                return (
                  <div>
                    <p>Loading data...</p>
                  </div>
                );
              }
              if (this.state.availableUsers.length === 0) {
                return (
                  <div>
                    <p>No users available</p>
                  </div>
                );
              }
              return (
                <ChatList
                  onClick={(item, i, e) => {
                    this.setState({ showNewChatPopup: false });
                    this.selectDialog(item);
                  }}
                  dataSource={this.state.availableUsers}
                />
              );
            }}
          />
          <Navbar
            left={
              <ChatItem
                {...this.state.selectedDialog}
                date={null}
                unread={0}
                statusColor={
                  this.state.selectedDialog &&
                  this.state.onlinePKs.includes(this.state.selectedDialog.id)
                    ? "lightgreen"
                    : ""
                }
                subtitle={
                  this.state.selectedDialog &&
                  this.state.typingPKs.includes(this.state.selectedDialog.id)
                    ? "typing..."
                    : ""
                }
              />
            }
            right={
              <>
                <button type="button" className="free-appointments">
                  {t("chat_show_free_appointments")}
                </button>
                <button type="button" className="suggest-appointment">
                  {t("chat_suggest_appointment")}
                </button>
                <Link to="/call-setup" state={{ userPk }}>
                  <img className="call-start" alt="start call" />
                </Link>
                <Button
                  type="transparent"
                  color="black"
                  onClick={() => {
                    this.setState({ usersDataLoading: true });
                    fetchUsersList(this.state.dialogList).then((r) => {
                      this.setState({ usersDataLoading: false });
                      if (r.tag === 0) {
                        console.log("Fetched users:");
                        console.log(r.fields[0]);
                        this.setState({ availableUsers: r.fields[0] });
                      } else {
                        console.log("Users error:");
                        toast.error(r.fields[0]);
                      }
                    });
                    this.setState({ showNewChatPopup: true });
                  }}
                />
              </>
            }
          />
          <Core t={this.props.t} userPk={userPk} state={this.state} />
        </div>
      </div>
    );
  }
}

export class Core extends Chat {
  componentWillReceiveProps(nextProps) {
    if (nextProps.state) {
      this.state = nextProps.state;
    }
  }

  render() {
    const { t } = this.props;

    const handleTextUpdate = (evt) => {
      this.textInput = evt.target;
    };

    return (
      <div className="flex-container">
        <MessageList
          className="message-list"
          lockable
          onDownload={(x, i, e) => {
            console.log("onDownload from messageList");
            x.onDownload();
          }}
          downButtonBadge={
            this.state.selectedDialog && this.state.selectedDialog.unread > 0
              ? this.state.selectedDialog.unread
              : ""
          }
          dataSource={filterMessagesForDialog(this.state.selectedDialog, this.state.messageList)}
        />
        <Input
          placeholder={t("chat_input_text")}
          defaultValue=""
          id="textInput"
          multiline
          // buttonsFloat='left'
          onKeyPress={(e) => {
            if (e.charCode !== 13) {
              this.isTyping();
            }
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              if (this.state.socket.readyState === 1) {
                e.preventDefault();
                this.performSendingMessage();
              }
              return false;
            }
          }}
          onChange={handleTextUpdate}
          rightButtons={
            <Button
              text={t("chat_send")}
              disabled={this.state.socket.readyState !== 1}
              onClick={() => this.performSendingMessage()}
            />
          }
        />
      </div>
    );
  }
}

const ChatFull = withTranslation()(Chat);
const ChatCore = withTranslation()(Core);
export { ChatFull, ChatCore };
