import React, { useEffect, useState, createContext, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./App.css";
import "./call.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { addAudioTrack, addVideoTrack, joinRoom, toggleLocalTracks } from "./twilio-helper";
import { BACKEND_PATH } from "./ENVIRONMENT";
import Chat from "./chat/chat-full-view";

function toggleFullscreen(t) {
  const videoContainer = document.querySelector(".video-container");
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

const SidebarContext = createContext({ sideSelection: null, setSideSelection: () => {} });

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
    <div className="call-time">
      <span className="text">
        {two(minutes)}:{two(remainder)}
      </span>
    </div>
  );
}

function ToggleButton({ id, text, alt, onChange }) {
  return (
    <>
      <input type="checkbox" id={id} defaultChecked={false} onChange={onChange} />
      <label htmlFor={id}>
        <div className="img" alt={alt} />
        {text && <span className="text">{text}</span>}
      </label>
    </>
  );
}

function VideoControls() {
  const { t } = useTranslation();
  const location = useLocation();
  const { videoId, audioId } = (location.state || {}).tracks || {};

  const { setSideSelection } = useContext(SidebarContext);

  const showChat = () => {
    if (document.fullscreenElement) {
      toggleFullscreen(t);
    }
    setSideSelection("chat");
  };

  return (
    <div className="video-controls">
      <ToggleButton
        id="audio-toggle"
        alt="mute/unmute mic"
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <ToggleButton
        id="video-toggle"
        alt="enable/disable webcam"
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
      />
      <ToggleButton
        id="fullscreen-toggle"
        text={t("vc_fs_btn_enter_fullscreen")}
        alt="toggle fullscreen"
        onChange={() => toggleFullscreen(t)}
      />
      <ToggleButton id="calendar-toggle" text={t("vc_fs_btn_appointment")} alt="calendar" />
      <ToggleButton id="help-toggle" text={t("vc_fs_btn_mistake")} alt="mistake" />
      <button type="button" className="chat-show" onClick={showChat}>
        <div className="img" alt="show chat" />
        <span className="text">{t("vc_fs_btn_chat")}</span>
      </button>
      <Timer />
      <Link to="/">
        <button type="button" className="end-call">
          <div className="img" alt="end call" />
          <span className="text">{t("vc_fs_btn_end_call")}</span>
        </button>
      </Link>
    </div>
  );
}

function MobileVideoControlsTop({ selectedOverlay, setOverlay }) {
  const buttons = ["chat", "translate", "questions", "notes"];

  return (
    <div className="video-controls top">
      {buttons.map((name) => (
        <button
          key={name}
          type="button"
          className={selectedOverlay === name ? `show-${name} selected` : `show-${name}`}
          onClick={() => setOverlay(name)}
        >
          <img alt={`show-${name}`} />
        </button>
      ))}
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
        <button type="button" className="questions-left" onClick={() => changeScroll("left")}>
          <img alt="show left" />
        </button>
        <div className="categories">
          {questionsTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              className={selectedTopic === topic ? `${topic}-radio selected` : `${topic}-radio`}
              value={topic}
              onClick={() => setTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <button type="button" className="questions-right" onClick={() => changeScroll("right")}>
          <img alt="show right" />
        </button>
      </div>
      <div className="questions-content">
        {questionsData[selectedTopic].map(({ id, text }) => (
          <div
            key={id}
            className={selectedQuestionId === id ? `question-${id} selected` : `question-${id}`}
          >
            <button
              type="button"
              className={selectedQuestionId === id ? "selected" : ""}
              onClick={() => setQuestionId(id)}
            >
              {text}
            </button>
            {selectedQuestionId === id && (
              <div className="question-action">
                <button type="button" className="yes">
                  <img alt="accept question" />
                </button>
                <button type="button" className="edit">
                  <img alt="edit question" />
                </button>
                <button type="button" className="no" onClick={removeQuestion}>
                  <img alt="reject question" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarNotes() {
  return <div className="notes">notes stuff goes here</div>;
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

function MobileDrawer({ content, setOverlay }) {
  const location = useLocation();
  const { userPk } = location.state || {};

  return (
    <div className={`call-drawer-container ${content}`}>
      <div className="call-drawer">
        <button className="arrow-down" type="button" onClick={() => setOverlay(null)}>
          <img alt="hide drawer" />
        </button>
        <div className="drawer-content">
          {content === "chat" && <Chat userPk={userPk} />}
          {content === "translate" && <TranslationBox />}
          {content === "questions" && <SidebarQuestions />}
          {content === "notes" && <SidebarNotes />}
        </div>
      </div>
    </div>
  );
}

function VideoFrame() {
  const [selectedOverlay, setOverlay] = useState(null);

  return (
    <div className="video-border">
      <div className="video-container">
        <MobileVideoControlsTop selectedOverlay={selectedOverlay} setOverlay={setOverlay} />
        <div
          id="foreign-container"
          className={selectedOverlay ? "video-frame blur" : "video-frame"}
          alt="video"
        />
        <div className="local-video-container inset" />
        <VideoControls />
        <MobileDrawer content={selectedOverlay} setOverlay={setOverlay} />
      </div>
    </div>
  );
}

function ActiveCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userPk, tracks } = location.state || {};

  useEffect(() => {
    if (!userPk) {
      navigate(`${BACKEND_PATH}/`);
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

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  const { userPk } = location.state || {};
  const sidebarTopics = ["chat", "questions", "notes"];
  const { sideSelection, setSideSelection } = useContext(SidebarContext);
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
        {sideSelection === "chat" && <Chat userPk={userPk} />}
        {sideSelection === "questions" && <SidebarQuestions />}
        {sideSelection === "notes" && <SidebarNotes />}
      </div>
    </div>
  );
}

function CallScreen() {
  const [sideSelection, setSideSelection] = useState("chat");

  return (
    <div className="call-screen">
      <SidebarContext.Provider value={{ sideSelection, setSideSelection }}>
        <div className="call-and-text">
          <ActiveCall />
          <TranslationBox />
        </div>
        <Sidebar />
      </SidebarContext.Provider>
    </div>
  );
}

export default CallScreen;
