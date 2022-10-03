import throttle from "lodash.throttle";
import React, { Component } from "react";
import { Button, Input, MessageList, Navbar, SideBar } from "react-chat-elements";
import { withTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import ReconnectingWebSocket from "reconnecting-websocket";

import { BACKEND_URL, DEVELOPMENT, PRODUCTION } from "../ENVIRONMENT";
import Link from "../path-prepend";
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
} from "./chat.lib";
import ChatItem from "./ChatItem-override";
import ChatList from "./ChatList-override";

import "react-chat-elements/dist/main.css";
import "react-toastify/dist/ReactToastify.css";

import "./chat-override.css";

// Monkey path, disables only sucess toast, on if not in DEVELOPMENT
// We like to keep the error messages (if any), so in that case we can help users to debug
const origSucessFunc = toast.success;
const successShowOnlyIfDevelopment = function () {
  // eslint-disable-next-line prefer-spread, prefer-rest-params
  if (DEVELOPMENT) return origSucessFunc.apply(null, arguments);
  return null;
};
toast.success = successShowOnlyIfDevelopment;

const TYPING_TIMEOUT = 5000;
const chatItemSortingFunction = (a, b) => b.date - a.date;

const defaultArcivedChatAvatar = {
  sex: "man",
  faceColor: "#000",
  earSize: "big",
  eyeStyle: "circle",
  noseStyle: "long",
  mouthStyle: "smile",
  shirtStyle: "short",
  glassesStyle: "round",
  hairColor: "#000",
  hairStyle: "thick",
  hatStyle: "none",
  hatColor: "#000",
  eyeBrowStyle: "up",
  shirtColor: "#000",
  bgColor: "#fff",
};

/* add image source and user's name to dialogList, which is used by chatList/item */
const addMatchesInfo = (dialogList, matchesInfo) => {
  if (matchesInfo) {
    const result = dialogList.map((dialog) => {
      const matchInfo = matchesInfo.filter(({ userPk }) => userPk === dialog.alt)[0];
      console.log("INFO", matchInfo, dialog);
      if (matchInfo === undefined) {
        return Object.assign(dialog, {
          avatar: defaultArcivedChatAvatar,
          title: "Old Chat ( not matched anymore)",
        });
      }

      /* we have to modify the original dialog object and not create a new
       * one with object speader so that the object prototype is not altered
       */
      return Object.assign(dialog, {
        avatar: matchInfo.usesAvatar ? matchInfo.avatarConfig : matchInfo.imgSrc,
        title: `${matchInfo.firstName} ${matchInfo.lastName}`,
      });
    });
    return result;
  }
  return dialogList;
};

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
      userMatchPkMap: null,
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
        `${PRODUCTION ? "wss" : "ws"}://${
          DEVELOPMENT ? BACKEND_URL.substring(7) : window.origin.split("//").pop()
        }/chat_ws`
      ) /* without the 'https://' */,
      userWasSelected: !!this.props.userPk,
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
      const tmpMatchIdMap = {};
      for (let i = 0; i < r.fields[0].length; i++) {
        tmpMatchIdMap[r.fields[0][i].id] = r.fields[0][i].alt;
      }
      if (this.props.userPkMappingCallback !== undefined) {
        this.props.userPkMappingCallback(tmpMatchIdMap);
      }
      this.setState({ userMatchPkMap: tmpMatchIdMap });
      if (r.tag === 0) {
        const { userPk, matchesInfo } = this.props;

        const dialogList = addMatchesInfo(r.fields[0], matchesInfo); // add name and imgSrc
        this.setState({ dialogList, filteredDialogList: dialogList });

        // set selected dialog to match the userPk if supplied, otherwise use first
        if (userPk) {
          const userDialog = dialogList.filter(({ alt }) => alt === userPk)[0];
          this.selectDialog(userDialog);
        } else {
          this.selectDialog(dialogList[0]);
        }
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
        performAdminCallBackAction: (action) => {
          that.props.adminActionCallback(action);
        },
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

  componentDidUpdate() {
    // scroll message box to bottom when messages are updated
    const scrollEl = document.querySelector(".rce-mlist");
    scrollEl.scrollTop = scrollEl.scrollHeight;
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

    // do nothing when clicking on the already-selected chat
    // prevents styling of user name in top bar
    const prevId = (this.state.selectedDialog || {}).id;
    if (prevId === item.id) {
      return;
    }

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
    console.log("online", `Setting ${pk} to ${onoff}`);
    const onlines = this.state.onlinePKs;
    const stateMapping = this.state.userMatchPkMap[pk];
    console.log("online Mapping", stateMapping);
    if (onoff) {
      onlines.push(pk);
      this.props.updateMatchesOnlineStates(stateMapping, true);
    } else {
      const index = onlines.indexOf(pk);
      if (index > -1) {
        onlines.splice(index, 1);
      }
      this.props.updateMatchesOnlineStates(stateMapping, false);
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
    console.log("STATE", this.state);
  }

  addMessage(msg) {
    console.log("Calling addMessage for ");
    console.log("state", this.state);

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
    if (this.state.selectedDialog && (this.textInput || {}).value) {
      const msgBox = sendOutgoingTextMessage(
        this.state.socket,
        this.textInput.value,
        this.state.selectedDialog.id, // id is not always userPk as it stands
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

  Core = () => {
    const { t } = this.props;

    const handleTextUpdate = (e) => {
      this.textInput = e.target;
    };

    const chatRequest = false;
    const userName = (this.state.selectedDialog || {}).title;

    return (
      <div className="flex-container">
        {chatRequest && (
          <div className="partner-request">
            <div className="match-notify">
              <img className="match-celebrate" alt="" />
              <div className="text">{t("chat_success_message", { userName })}</div>
            </div>
            <div className="match-process">
              <div className="this-request">{t("chat_request_header")}</div>
              <div className="buttons">
                <button type="button" className="request-accept">
                  {t("chat_request_accept")}
                </button>
                <button type="button" className="request-deny">
                  {t("chat_request_decline")}
                </button>
                <button type="button" className="request-info">
                  {t("chat_request_more_info")}
                </button>
              </div>
            </div>
          </div>
        )}
        {!chatRequest && (
          <>
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
              dataSource={filterMessagesForDialog(
                this.state.selectedDialog,
                this.state.messageList
              )}
            />
            <Input
              placeholder={t("chat_input_text")}
              defaultValue=""
              id="textInput"
              multiline
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
          </>
        )}
      </div>
    );
  };

  render() {
    const { t } = this.props;
    const userPk = (this.state.selectedDialog || {}).alt;
    const { Core } = this;
    const pending = false; /* set this to change when request sent/pending */

    if (this.props.userPk && !userPk) {
      // this happens when clicking "message" button on a user profile
      document.body.classList.add("hide-mobile-header");
    }

    if (this.props.userPk && !this.props.matchesInfo) {
      /* if we send userPk as a prop but not matches info, early exit
       * and only show the chat with specified user, without selector etc.
       * For sidebar chat.
       */
      return <Core />;
    }
    const clickUser = (item) => {
      this.selectDialog(item);
      this.setState({ userWasSelected: true });
      document.body.classList.add("hide-mobile-header");
    };

    return (
      <>
        <div className="header">
          <span className="text">{t("chat_header")}</span>
        </div>
        <div className={this.props.showChat ? "container" : "container disable-chat"}>
          <div
            className={
              this.state.userWasSelected ? "chat-list-box" : "chat-list-box active-panel-mobile"
            }
          >
            <SideBar
              type="light"
              top={
                <div className="chat-list">
                  <ToastContainer />
                  <h3 className="chat-header"></h3>
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
                    onClick={clickUser}
                    dataSource={this.state.filteredDialogList.slice().sort(chatItemSortingFunction)}
                  />
                </div>
              }
            />
            <div className="new-partner">
              {!pending && (
                <Link className="find-partner">
                  <img className="plus" alt="add" />
                  {t("chat_find_new_person")}
                </Link>
              )}
              {pending && (
                <div className="waiting">
                  <div className="content">
                    <img className="searching" alt="Search in progress" />
                    <div className="text">
                      <div className="header">{t("chat_search_running_header")}</div>
                      {t("chat_search_running_text")}
                    </div>
                  </div>
                  <div className="buttons">
                    <button type="button" className="cancel">
                      {t("chat_search_cancel")}
                    </button>
                    <button type="button" className="change">
                      {t("chat_search_change")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={
              this.state.userWasSelected ? "right-panel active-panel-mobile" : "right-panel"
            }
          >
            <Navbar
              left={
                <>
                  <button
                    type="button"
                    className="chat-back"
                    onClick={() => {
                      console.log("back");
                      document.body.classList.remove("hide-mobile-header");
                      this.setState({ userWasSelected: false });
                    }}
                  >
                    <img alt="return to chat partner selection" />
                  </button>
                  <Link to="/" state={{ userPk }} className="profile">
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
                  </Link>
                </>
              }
              right={
                <>
                  <button type="button" className="free-appointments disabled">
                    <span className="text">{t("chat_show_free_appointments")}</span>
                  </button>
                  <button type="button" className="suggest-appointment disabled">
                    <span className="text">{t("chat_suggest_appointment")}</span>
                  </button>
                  <button
                    type="button"
                    className="call-start"
                    onClick={() => this.props.setCallSetupPartner(userPk)}
                  >
                    <img alt="start call" />
                  </button>
                </>
              }
            />
            <div className="buttons-mobile">
              <button type="button" className="free-appointments disabled">
                <span className="text">{t("chat_show_free_appointments")}</span>
              </button>
              <button type="button" className="suggest-appointment disabled">
                <span className="text">{t("chat_suggest_appointment")}</span>
              </button>
            </div>
            <Core />
          </div>
        </div>
      </>
    );
  }
}

export default withTranslation()(Chat);
