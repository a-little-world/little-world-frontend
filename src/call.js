import React from "react";
import "./App.css";
import "./call.css";
import "./i18n";
import { useTranslation } from "react-i18next";

console.log("call.js running");

function toggleLocalTracks(isOn, trackType) {
  console.log(32, activeTracks);
  const track = activeTracks[trackType];
  if (isOn) {
    track.enable();
  } else {
    track.disable();
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
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
      <input
        type="checkbox"
        id="fullscreen-toggle"
        onChange={(e) => toggleFullscreen(e.target.checked)}
      />
      <label htmlFor="fullscreen-toggle">
        <img alt="" />
        {t("vc_fs_btn_end_fullscreen")}
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
  return <VideoFrame />;
}

export default ActiveCall;
