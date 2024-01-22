import { Button } from '@a-little-world/little-world-design-system';
import { throttle } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Input, MessageList } from 'react-chat-elements';
import { useTranslation } from 'react-i18next';
import ReconnectingWebSocket from 'reconnecting-websocket';
import sanitizeHtml from 'sanitize-html';

import {
  BACKEND_URL,
  DEVELOPMENT,
  IS_CAPACITOR_BUILD,
  PRODUCTION,
} from '../../../ENVIRONMENT';
import {
  createNewDialogModelFromIncomingMessageBox,
  filterMessagesForDialog,
  getSubtitleTextFromMessageBox,
  sendIsTypingMessage,
  sendMessageReadMessage,
  sendOutgoingTextMessage,
} from '../../../chat/chat.lib';

const TYPING_TIMEOUT = 5000;

const ChatCore = ({ userPk, selectedDialog, setDialogList }) => {
  const { t } = useTranslation();
  let textInput;
  const [messageList, setMessageList] = useState([]);
  const [state, setState] = useState([
    {
      socketConnectionState: 0,
      showNewChatPopup: false,
      newChatChosen: null,
      userMatchPkMap: null,
      usersDataLoading: false,
      availableUsers: [],
      filteredDialogList: [],
      typingPKs: [],
      onlinePKs: [],
      selfInfo: null,
      socket: new ReconnectingWebSocket(
        `${PRODUCTION ? 'wss' : 'ws'}://${
          IS_CAPACITOR_BUILD
            ? BACKEND_URL.split('//').pop()
            : DEVELOPMENT
            ? BACKEND_URL.substring(7)
            : window.origin.split('//').pop()
        }/api/chat/ws`,
      ) /* without the 'https://' */,
      userWasSelected: !!userPk,
      open: false,
    },
  ]);

  useEffect(() => {
    textInput = document.getElementById('test-input').firstChild.firstChild;
  });

  const clearTextInput = () => {
    if (textInput) {
      textInput.value = '';
      textInput.style.height = '';
      // shrinks input box immediately after sending message, rather than
      // doing so on new text input
    }
  };

  const handleTextUpdate = e => {
    textInput = e.target;
  };

  const addMessage = msg => {
    if (
      !msg.data.out &&
      msg.data.message_id > 0 &&
      state.selectedDialog &&
      state.selectedDialog.id === msg.data.dialog_id
    ) {
      sendMessageReadMessage(
        state.socket,
        msg.data.dialog_id,
        msg.data.message_id,
      );
      msg.status = 'read';
    }
    const list = state.messageList;
    list.push(msg);

    setMessageList(list);
    let doesntNeedLastMessageSet = false;
    if (!msg.data.out) {
      const dialogs = state.dialogList;
      const hasDialogAlready = dialogs.some(e => e.id === msg.data.dialog_id);
      if (!hasDialogAlready) {
        const d = createNewDialogModelFromIncomingMessageBox(msg);
        dialogs.push(d);
        doesntNeedLastMessageSet = true;
        setState({
          dialogList: dialogs,
        });
      }
    }
    if (!doesntNeedLastMessageSet) {
      setDialogList(prevState => ({
        dialogList: prevState.dialogList.map(el => {
          if (el.id === msg.data.dialog_id) {
            return { ...el, subtitle: getSubtitleTextFromMessageBox(msg) };
          }
          return el;
        }),
      }));
    }

    setState(prevState => ({ filteredDialogList: prevState.dialogList }));
  };

  const performSendingMessage = () => {
    if (selectedDialog && (textInput || {}).value) {
      const msgBox = sendOutgoingTextMessage(
        state.socket,
        textInput.value,
        selectedDialog.id, // id is not always userPk as it stands
        state.selfInfo,
      );
      clearTextInput();

      if (msgBox) {
        addMessage(msgBox);
      }
    }
  };

  const isTyping = throttle(() => {
    sendIsTypingMessage(state.socket);
  }, TYPING_TIMEOUT);

  const chatRequest = false;
  const userName = (state.selectedDialog || {}).title;

  return (
    <div className="flex-container">
      {chatRequest && (
        <div className="partner-request">
          <div className="match-notify">
            <img className="match-celebrate" alt="" />
            <div className="text">
              {t('chat_success_message', { userName })}
            </div>
          </div>
          <div className="match-process">
            <div className="this-request">{t('chat_request_header')}</div>
            <div className="buttons">
              <button type="button" className="request-accept">
                {t('chat_request_accept')}
              </button>
              <button type="button" className="request-deny">
                {t('chat_request_decline')}
              </button>
              <button type="button" className="request-info">
                {t('chat_request_more_info')}
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
              x.onDownload();
            }}
            downButtonBadge={
              selectedDialog && selectedDialog.unread > 0
                ? selectedDialog.unread
                : ''
            }
            dataSource={filterMessagesForDialog(
              selectedDialog,
              messageList,
            ).map(msg => {
              return {
                ...msg,
                text: (
                  <div
                    className="styled-message-box"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(msg.text, {
                        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'button'],
                        allowedAttributes: {
                          a: ['href', 'target'],
                          button: ['data-cal-link', 'data-cal-config'],
                        },
                      }),
                    }}
                  />
                ),
              };
            })}
          />
          <div id="test-input">
            <Input
              placeholder={t('chat_input_text')}
              defaultValue=""
              id="textInput"
              multiline
              onKeyPress={e => {
                if (e.charCode !== 13) {
                  isTyping();
                }
                if (e.shiftKey && e.charCode === 13) {
                  if (state.socket?.readyState === 1) {
                    e.preventDefault();
                    performSendingMessage();
                  }
                  return false;
                }
                if (e.charCode === 13) {
                  /**
                      * TODO: in the future we want this to auto send on two enters on mobile maybe?
                      * Also we might want shift enter to make a new line on desktop instad of sending?
                      * https://app.clickup.com/t/863h7880p
                    if(e.target.value.endsWith("\n\n")){
                      if (this.state.socket.readyState === 1) {
                        e.preventDefault();
                        this.performSendingMessage();
                      }
                      return false;
                    } */

                  return true;
                }
              }}
              onChange={handleTextUpdate}
              rightButtons={
                <Button
                  disabled={state.socket?.readyState !== 1}
                  onClick={() => performSendingMessage()}
                >
                  {t('chat_send')}
                </Button>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatCore;
