/* eslint-disable jsx-a11y/media-has-caption */
import $ from "jquery";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Chat from "./chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import "./i18n";
import Link from "./path-prepend";
import {
  getAudioTrack,
  getVideoTrack,
  joinRoom,
  removeActiveTracks,
  toggleLocalTracks,
} from "./twilio-helper";

import "./App.css";
import "./call.css";

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

const SetSideContext = createContext(() => {});

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

function ToggleButton({ id, text, alt, onChange, defaultChecked, disabled }) {
  return (
    <>
      <input type="checkbox" id={id} defaultChecked={defaultChecked} onChange={onChange} />
      <label htmlFor={id} className={disabled ? "disabled" : ""}>
        <div className="img" alt={alt} />
        {text && <span className="text">{text}</span>}
      </label>
    </>
  );
}

function VideoControls() {
  const { t } = useTranslation();

  const setSideSelection = useContext(SetSideContext);

  const showChat = () => {
    if (document.fullscreenElement) {
      toggleFullscreen(t);
    }
    setSideSelection("chat");
  };

  const audioMuted = localStorage.getItem("audio muted") === "true";
  const videoMuted = localStorage.getItem("video muted") === "true";

  return (
    <div className="video-controls">
      <ToggleButton
        id="audio-toggle"
        alt="mute/unmute mic"
        defaultChecked={audioMuted}
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <ToggleButton
        id="video-toggle"
        alt="enable/disable webcam"
        defaultChecked={videoMuted}
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
      />
      <ToggleButton
        id="fullscreen-toggle"
        text={t("vc_fs_btn_enter_fullscreen")}
        alt="toggle fullscreen"
        onChange={() => toggleFullscreen(t)}
      />
      <ToggleButton
        id="calendar-toggle"
        text={t("vc_fs_btn_appointment")}
        alt="calendar"
        disabled
      />
      <ToggleButton id="help-toggle" text={t("vc_fs_btn_mistake")} alt="mistake" disabled />
      <button type="button" className="chat-show" onClick={showChat}>
        <div className="img" alt="show chat" />
        <span className="text">{t("vc_fs_btn_chat")}</span>
      </button>
      <Timer />
      <Link to="/" className="end-call">
        <div className="img" alt="end call" />
        <span className="text">{t("vc_fs_btn_end_call")}</span>
      </Link>
    </div>
  );
}

function MobileVideoControlsTop({ selectedOverlay, setOverlay }) {
  const buttons = ["chat", "translate", "questions", "notes"];
  const disabled = ["questions", "notes"];

  return (
    <div className="video-controls top">
      {buttons.map((name) => (
        <button
          key={name}
          type="button"
          className={`show-${name}${selectedOverlay === name ? " selected" : ""}${
            disabled.includes(name) ? " disabled" : ""
          }`}
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

function TranslationDropdown({ side, selected, setter }) {
  const { t } = useTranslation();
  const languages = ["en", "de"];
  return (
    <select
      name={`${side}-language-select`}
      onChange={(e) => setter(e.target.value)}
      value={selected}
    >
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
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("de");
  const [isSwapped, setIsSwapped] = useState(false);

  const [leftText, setLeftText] = useState("");
  const [rigthText, setRightText] = useState("");

  const handleChangeLeft = (event) => {
    setLeftText(event.target.value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (leftText === "") return;
      $.ajax({
        type: "POST",
        url: `${BACKEND_URL}/api2/trans/`,
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        data: {
          src_lang: fromLang,
          dest_lang: toLang,
          text: leftText,
        },
      }).then((resp) => {
        setRightText(resp.trans);
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [leftText]);

  const swapLang = () => {
    const oldFromLang = fromLang;
    const oldToLang = toLang;
    setFromLang(oldToLang);
    setToLang(oldFromLang);
    const tmpLeftText = leftText;
    setRightText(tmpLeftText);
    setLeftText(rigthText);
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="translation-box">
      <div className="left">
        <TranslationDropdown side="left" selected={fromLang} setter={setFromLang} />
        <textarea
          placeholder={t("vc_translator_type_here")}
          value={leftText}
          onChange={handleChangeLeft}
        />
      </div>
      <button
        type="button"
        className={isSwapped ? "swap-languages swapped" : "swap-languages"}
        onClick={swapLang}
      >
        <img alt="swap languages" />
      </button>
      <div className="right">
        <TranslationDropdown side="right" selected={toLang} setter={setToLang} />
        <textarea placeholder={t("vc_translator_type_here")} readOnly value={rigthText} />
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

function VideoFrame({ video, audio }) {
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
        <div className="local-video-container inset">
          <video ref={video} />
          <audio ref={audio} />
        </div>
        <VideoControls />
        <MobileDrawer content={selectedOverlay} setOverlay={setOverlay} />
      </div>
    </div>
  );
}

function Sidebar({ sideSelection }) {
  const { t } = useTranslation();
  const location = useLocation();

  const { userPk } = location.state || {};
  const sidebarTopics = ["chat", "questions", "notes"];
  const setSideSelection = useContext(SetSideContext);
  const handleChange = (e) => setSideSelection(e.target.value);
  const disabled = ["questions", "notes"];

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
            <label
              htmlFor={`${topic}-radio`}
              className={disabled.includes(topic) ? "disabled" : ""}
            >
              {t(`vc_btn_${topic}`)}
            </label>
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
  const navigate = useNavigate();
  const location = useLocation();
  const { userPk, tracks } = location.state || {};
  const videoRef = useRef();
  const audioRef = useRef();

  /* remove the video stream from call-setup otherwise it can hang around after
   * returing to main page, causing webcam lights to remain on.
   */
  removeActiveTracks();

  useEffect(() => {
    if (!userPk) {
      navigate(`${BACKEND_PATH}/`);
    }
    const { videoId, audioId } = tracks || {};
    if (!(videoId && audioId)) {
      console.error("videoId audioId", videoId, audioId);
    }
    const videoMuted = localStorage.getItem("video muted") === "true";
    const audioMuted = localStorage.getItem("audio muted") === "true";
    getVideoTrack(videoId, videoMuted).then((track) => {
      track.attach(videoRef.current);
    });
    getAudioTrack(audioId, audioMuted).then((track) => {
      track.attach(audioRef.current);
    });
    joinRoom(userPk);
  }, [userPk, tracks]);

  document.body.style.overflow = ""; // unset after call overlay

  return (
    <div className="call-screen">
      <SetSideContext.Provider value={setSideSelection}>
        <div className="call-and-text">
          <VideoFrame video={videoRef} audio={audioRef} />
          <TranslationBox />
        </div>
        <Sidebar sideSelection={sideSelection} />
      </SetSideContext.Provider>
    </div>
  );
}

export default CallScreen;
