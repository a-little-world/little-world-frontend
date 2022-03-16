import React, { useEffect, useState } from "react";
import "./App.css";
import "./call.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { addTracks, joinRoom, toggleLocalTracks } from "./twilio-helper";

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
  return (
    <div className="video-controls">
      <input
        type="checkbox"
        id="audio-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <label htmlFor="audio-toggle">
        <img alt="mute/unmute mic" />
      </label>
      <input
        type="checkbox"
        id="video-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
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
  useEffect(() => {
    addTracks();
    joinRoom();
  });
  return <VideoFrame />;
}

function SidebarChat() {
  const { t } = useTranslation();
  const dummyData = [
    {
      id: 213,
      sender: "foreign",
      text: "Hello Richard how are you doing?",
    },
    {
      id: 217,
      sender: "local",
      text: "Let's talk about a new topic. How about...",
    },
    {
      id: 218,
      sender: "local",
      text: "We discussed",
    },
  ];

  return (
    <div className="chat">
      <div className="chat-messages">
        {dummyData.map(({ id, sender, text }) => {
          return (
            <div key={id} className={`message ${sender}`}>
              {text}
            </div>
          );
        })}
      </div>
      <div className="chat-compose">
        <input type="text" />
        <button className="send" type="submit">
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

  let dummyData = {
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
  const languages = ["en", "de"];
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
