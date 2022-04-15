import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "./call.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { addAudioTrack, addVideoTrack, joinRoom, toggleLocalTracks } from "./twilio-helper";
import {
    uploadFile,
    sendOutgoingFileMessage,
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
    sendMessageReadMessage
} from "./chat/chat.lib"
import $ from "jquery";
import { BACKEND_URL } from "./ENVIRONMENT";
import Cookies from "js-cookie";

import {ToastContainer, toast} from 'react-toastify';

import ReconnectingWebSocket from 'reconnecting-websocket';


function toggleFullscreen(t) {
  const videoContainer = document.querySelector(".foreign-video-container");
  const fullScreenTextEl = document.querySelector("label[for=fullscreen-toggle] .text");
  // would be nice to do text in CSS but we need translation support

  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
    fullScreenTextEl.innerHTML = t("vc_fs_btn_exit_fullscreen");
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    fullScreenTextEl.innerHTML = t("vc_fs_btn_enter_fullscreen");
  }
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  });

  const remainder = seconds % 60;
  const minutes = (seconds - remainder) / 60;

  const two = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div id="call-time">
      {two(minutes)}:{two(remainder)}
    </div>
  );
}

function VideoControls() {
  const { t } = useTranslation();
  const location = useLocation();
  const { videoId, audioId } = (location.state || {}).tracks || {};

  return (
    <div className="video-controls">
      <input
        type="checkbox"
        id="audio-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio", audioId)}
      />
      <label htmlFor="audio-toggle">
        <img alt="mute/unmute mic" />
      </label>
      <input
        type="checkbox"
        id="video-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "video", videoId)}
      />
      <label htmlFor="video-toggle">
        <img alt="enable/disable webcam" />
      </label>
      <input type="checkbox" id="fullscreen-toggle" onChange={() => toggleFullscreen(t)} />
      <label htmlFor="fullscreen-toggle">
        <img alt="" />
        <span className="text">{t("vc_fs_btn_enter_fullscreen")}</span>
      </label>
      <input type="checkbox" id="calendar-toggle" />
      <label htmlFor="calendar-toggle">
        <img alt="" />
        {t("vc_fs_btn_appointment")}
      </label>
      <input type="checkbox" id="help-toggle" />
      <label htmlFor="help-toggle">
        <img alt="" />
        {t("vc_fs_btn_mistake")}
      </label>
      <input type="checkbox" id="chat-toggle" />
      <label htmlFor="chat-toggle">
        <img alt="" />
        {t("vc_fs_btn_chat")}
      </label>
      <Timer />
      <input type="checkbox" id="end-call" />
      <label htmlFor="end-call">{t("vc_fs_btn_end_call")}</label>
    </div>
  );
}

function VideoFrame() {
  return (
    <div className="foreign-video-container">
      <div id="foreign-container" className="video-frame" alt="video" />
      <div className="local-video-container inset" />
      <VideoControls />
    </div>
  );
}

function ActiveCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPk, tracks } = location.state || {};

  useEffect(() => {
    if (!userPk) {
      navigate("/");
    }
    const { videoId, audioId } = tracks || {};
    if (!(videoId && audioId)) {
      navigate("/call-setup", { state: { userPk } });
    }
    addVideoTrack(videoId);
    addAudioTrack(audioId);
    joinRoom(userPk);
  }, [userPk, tracks]);

  return <VideoFrame />;
}

function SidebarChat() {

  let toastOptions = {
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: false,
  };

  const location = useLocation();
  const { userPk, tracks } = location.state || {};

  let [chatMessages, setChatMessages] = useState([]);

  let [messageList, setMessageList] = useState([]);

  let [selectedDialog, setSelectedDialog] = useState([]);

  let [chatState, setChatState] = useState({
            socketConnectionState: 0,
            showNewChatPopup: false,
            newChatChosen: null,
            usersDataLoading: false,
            availableUsers: [],
            dialogList: [],
            filteredDialogList: [],
            typingPKs: [],
            onlinePKs: [],
            selfInfo: null,
            selectedDialog: null,
            socket: new ReconnectingWebSocket('wss://' + 'littleworld.ngrok.io' + '/chat_ws')
        });

  let [textInput, setTextInput] = useState("");

  let handleTextUpdate = (evt) => {
    setTextInput(evt.target.value);
  }
  
  let performSendMessage = () => {
          let text = textInput;
          let user_pk = selectedDialog.id;
          //this.clearTextInput();
          let msgBox = sendOutgoingTextMessage(chatState.socket, text, user_pk, chatState.selfInfo);
          console.log("sendOutgoingTextMessage result:")
          console.log(msgBox)
  }

  // Yet unhandled callbacks
  let addMessage = () => {}
  let replaceMessageId = () => {}
  let addPKToTyping = () => {}
  let changePKOnlineStatus = () => {}
  let setMessageIdAsRead = () => {}
  let newUnreadCount = () => {}

  useEffect(() => {
    fetchMessages().then((r) => {
        if (r.tag === 0) {
            console.log("Fetched messages:");
            console.log(r.fields[0]);
            setChatState({messageList: r.fields[0]});
            setMessageList(r.fields[0]);
        } else {
            console.log("Messages error:")
            console.log(r.fields[0])
        }
    })

    fetchDialogs().then((r) => {
        if (r.tag === 0) {
            console.log("Fetched dialogs:")
            console.log(r.fields[0]);
            let dialogs = r.fields[0];
            const index = dialogs.findIndex(item => item.title === userPk); // Find the dialog with that use
            console.log("index", index);

            setChatState({selectedDialog: dialogs[index]})
            setSelectedDialog(dialogs[index]);
            //setChatState({dialogList: r.fields[0], filteredDialogList: r.fields[0]})
            //setChatState({selectedDialog: item}) // select the dialog, where username = user_h256_pk
        } else {
            console.log("Dialogs error:")
            console.log(r.fields[0])
        }
    })

    fetchSelfInfo().then((r) => {
        if (r.tag === 0) {
            console.log("Fetched selfInfo:")
            console.log(r.fields[0])
            setChatState({selfInfo: r.fields[0]})
        } else {
            console.log("SelfInfo error:")
            toast.error(r.fields[0])
        }
    })


    setChatState({socketConnectionState: chatState.socket.readyState});
    let socket = chatState.socket;

    // the socket stuff doen't handle all we need yet
    socket.onopen = function (e) {
        toast.success("Connected!", toastOptions)
        setChatState({socketConnectionState: socket.readyState});
    }
    socket.onmessage = function (e) {
        setChatState({socketConnectionState: socket.readyState});

        let errMsg = handleIncomingWebsocketMessage(socket, e.data, {
            addMessage: addMessage,
            replaceMessageId: replaceMessageId,
            addPKToTyping: addPKToTyping,
            changePKOnlineStatus: changePKOnlineStatus,
            setMessageIdAsRead: setMessageIdAsRead,
            newUnreadCount: newUnreadCount
        });
        if (errMsg) {
            toast.error(errMsg)
        }
    };
    socket.onclose = function (e) {
        toast.info("Disconnected...", toastOptions)
        setChatState({socketConnectionState: socket.readyState});
        console.log("websocket closed")
    }

  },[]);

  useEffect(() => {
      // Logic is basicly, when the messageList updated OR the selectedDialog Updated we have to update the chatMessage-state
      console.log(messageList, selectedDialog, '- Have changed')
      let msgs = []
      messageList.filter((m) => (m.data.dialog_id === selectedDialog.id)).forEach((e, i) => {
        msgs.push(
          {
            id : i,
            sender : e.position == 'right' ? 'foreign' : 'local',
            text : e.text
          }
        )
      })
      setChatMessages(msgs)
  },[messageList, selectedDialog]);

  const { t } = useTranslation();

  return (
    <div className="chat">
      <div className="chat-messages">
        {chatMessages.map(({ id, sender, text }) => {
          return (
            <div key={id} className={`message ${sender}`}>
              {text}
            </div>
          );
        })}
      </div>
      <div className="chat-compose">
        <input type="text" onChange={evt => handleTextUpdate(evt)}/>
        <button className="send" type="submit" onClick={e => performSendMessage()}>
          Send
        </button>
      </div>
    </div>
  );
}

function SidebarQuestions() {
  const { t } = useTranslation();
  const [selectedTopic, setTopic] = useState("Jokes");
  const [selectedQuestionId, setQuestionId] = useState(null);

  const dummyData = {
    Jokes: [
      {
        id: 1,
        text: "How much wood would a wood chucker chuck if a woodchucker could chuck wood?",
      },
      {
        id: 2,
        text: "What is the air speed velocity of an unladen swallow?",
      },
    ],
    Oliver: [
      {
        id: 3,
        text: "Where is Oliver from?",
      },
      {
        id: 4,
        text: "Which part of Berlin?",
      },
      {
        id: 5,
        text: "Where did he get those glasses?",
      },
    ],
    "Another Topic": [
      {
        id: 6,
        text: "nothing to see here",
      },
    ],
    "Yet Another Topic": [
      {
        id: 7,
        text: "what did you expect?",
      },
    ],
  };

  const [questionsData, setQuestions] = useState(dummyData);

  const questionsTopics = Object.keys(questionsData);

  const removeQuestion = () => {
    // needs to go to backend
    const questionIdx = questionsData[selectedTopic].findIndex(
      (item) => item.id === selectedQuestionId
    );
    questionsData[selectedTopic].splice(questionIdx, 1);
    setQuestionId(questionsData);
  };

  const changeScroll = (direction) => {
    const element = document.querySelector(".questions-categories .categories");
    const scrollVelocity = {
      right: 100,
      left: -100,
    };
    element.scrollLeft += scrollVelocity[direction];
  };

  return (
    <div className="questions">
      <div className="questions-categories">
        <img alt="show left" className="questions-left" onClick={() => changeScroll("left")} />
        <div className="categories">
          {questionsTopics.map((topic) => (
            <span key={topic}>
              <input
                type="radio"
                id={`${topic}-radio`}
                value={topic}
                checked={selectedTopic === topic}
                name="questionsTopics"
                onChange={(e) => setTopic(e.target.value)}
              />
              <label htmlFor={`${topic}-radio`}>{topic}</label>
            </span>
          ))}
        </div>
        <img alt="show right" className="questions-right" onClick={() => changeScroll("right")} />
      </div>
      <div className="questions-content">
        {questionsData[selectedTopic].map(({ id, text }) => (
          <span key={id}>
            <input
              type="radio"
              id={`question-${id}`}
              value={id}
              checked={selectedQuestionId === id}
              name={selectedTopic}
              onChange={() => setQuestionId(id)}
            />
            <label htmlFor={`question-${id}`}>
              {text}
              {selectedQuestionId === id && (
                <div className="question-action">
                  <img className="yes" alt="accept question" />
                  <img className="edit" alt="edit question" />
                  <img className="no" alt="reject question" onClick={removeQuestion} />
                </div>
              )}
            </label>
          </span>
        ))}
      </div>
    </div>
  );
}
function SidebarNotes() {
  return <div className="notes">notes stuff goes here</div>;
}

function Sidebar() {
  const { t } = useTranslation();
  const sidebarTopics = ["chat", "questions", "notes"];
  const [sideSelection, setSideSelection] = useState("questions");
  const handleChange = (e) => setSideSelection(e.target.value);

  return (
    <div className="call-sidebar">
      <div className="sidebar-selector">
        {sidebarTopics.map((topic) => (
          <span key={topic}>
            <input
              type="radio"
              id={`${topic}-radio`}
              value={topic}
              checked={sideSelection === topic}
              name="sidebar"
              onChange={handleChange}
            />
            <label htmlFor={`${topic}-radio`}>{t(`vc_btn_${topic}`)}</label>
          </span>
        ))}
      </div>
      <div className="sidebar-content">
        {sideSelection === "chat" && <SidebarChat />}
        {sideSelection === "questions" && <SidebarQuestions />}
        {sideSelection === "notes" && <SidebarNotes />}
      </div>
    </div>
  );
}

function TranslationDropdown({ side }) {
  const { t } = useTranslation();
  const languages = [
    "en",
    "sa",
    "bg",
    "ma",
    "ca",
    "fr",
    "gr",
    "in",
    "it",
    "kr",
    "ir",
    "pl",
    "ru",
    "es",
    "tr",
    "ua",
    "vn",
    "de",
  ];
  return (
    <select name={`${side}-language-select`}>
      {languages.map((code) => (
        <option key={code} value={code}>
          {t(`lang-${code}`)}
        </option>
      ))}
    </select>
  );
}

function TranslationBox() {
  const { t } = useTranslation();
  return (
    <div className="translation-box">
      <div className="left">
        <TranslationDropdown side="left" />
        <textarea placeholder={t("vc_translator_type_here")} />
      </div>
      <img className="swap-languages" alt="swap languages" />
      <div className="right">
        <TranslationDropdown side="right" />
        <textarea placeholder={t("vc_translator_type_here")} />
      </div>
    </div>
  );
}

function CallScreen() {
  return (
    <div className="call-screen">
      <div className="call-and-text">
        <ActiveCall />
        <TranslationBox />
      </div>
      <Sidebar />
    </div>
  );
}

export default CallScreen;
