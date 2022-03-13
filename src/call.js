import React, { useEffect } from "react";
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
      <input type="checkbox" id="call-time" />
      <label htmlFor="call-time">00:00</label>
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

function setSidebar(e) {
  const toShow = e.target.className;
}

function SidebarSelector() {
  const { t } = useTranslation();
  return (
    <div className="sidebar-selector">
      <button className="chat" onClick={setSidebar}>
        {t("vc_btn_chat")}
      </button>
      <button className="questions" onClick={setSidebar}>
        {t("vc_btn_questions")}
      </button>
      <button className="notes" onClick={setSidebar}>
        {t("vc_btn_notes")}
      </button>
    </div>
  );
}

function SidebarChat() {
  return <div className="chat">chat stuff goes here</div>;
}

function SidebarQuestions() {
  return <div className="questions">questions stuff goes here</div>;
}
function SidebarNotes() {
  return <div className="notes">notes stuff goes here</div>;
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
  return (
    <div className="translation-box">
      <TranslationDropdown side="left" />
      <button className="swap-languages" />
      <TranslationDropdown side="right" />
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
      <div className="call-sidebar">
        <SidebarSelector />
        <div className="sidebar-contents">
          <SidebarChat />
          <SidebarQuestions />
          <SidebarNotes />
        </div>
      </div>
    </div>
  );
}

export default CallScreen;
