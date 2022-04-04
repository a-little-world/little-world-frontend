import React, { useEffect, useState } from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { addTracks, toggleLocalTracks } from "./twilio-helper";

import signalWifi from "./images/signal-wifi.svg";

function SignalIndicator({ signalQuality, signalQualityText, signalUpdateText }) {
  const signalQualityImage = {
    good: signalWifi,
  };
  return (
    <button type="button" className="signal-button">
      <img id="signalQuality" alt={signalQualityText} src={signalQualityImage[signalQuality]} />
      {`${signalQualityText} `}
      <span className="signal-update">{signalUpdateText}</span>
    </button>
  );
}

function VideoControls({ signalInfo }) {
  return (
    <div className="video-controls">
      <SignalIndicator
        signalQuality={signalInfo.quality}
        signalQualityText={signalInfo.qualityText}
        signalUpdateText={signalInfo.updateText}
      />
      <input
        type="checkbox"
        id="audio-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <label htmlFor="audio-toggle">
        <img alt="toggle audio" />
      </label>
      <input
        type="checkbox"
        id="video-toggle"
        defaultChecked="checked"
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
      />
      <label htmlFor="video-toggle">
        <img alt="toggle video" />
      </label>
    </div>
  );
}

function VideoFrame() {
  const { t } = useTranslation();
  const quality = "good";
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t("pcs_signal_update");
  const signalInfo = { quality, qualityText, updateText };

  return (
    <div className="local-video-container">
      <div id="container" className="video-frame" alt="video" />
      <VideoControls signalInfo={signalInfo} />
    </div>
  );
}

function VideoInputSelect() {
  const { t } = useTranslation();
  const [videoInDevices, setVideoInDevices] = useState([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const devices = deviceList
        .filter((deviceInfo) => deviceInfo.kind === "videoinput")
        .filter((deviceInfo) => deviceInfo.deviceId !== "default");
      setVideoInDevices(devices);
    });
  });
  return (
    <div className="">
      <label htmlFor="webcam-select">{t("pcs_camera_label")}</label>
      <select name="webcam-select">
        {videoInDevices.map((deviceInfo) => {
          return (
            <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
              {deviceInfo.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function AudioInputSelect() {
  const { t } = useTranslation();
  const [audioInDevices, setAudioInDevices] = useState([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const devices = deviceList
        .filter((deviceInfo) => deviceInfo.kind === "audioinput")
        .filter((deviceInfo) => deviceInfo.deviceId !== "default");
      setAudioInDevices(devices);
    });
  });

  return (
    <div className="">
      <label htmlFor="mic-select">{t("pcs_mic_label")}</label>
      <select name="mic-select">
        {audioInDevices.map((deviceInfo) => {
          return (
            <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
              {deviceInfo.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function AudioOutputSelect() {
  const { t } = useTranslation();
  const [audioOutDevices, setAudioOutDevices] = useState([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const devices = deviceList
        .filter((deviceInfo) => deviceInfo.kind === "audiooutput")
        .filter((deviceInfo) => deviceInfo.deviceId !== "default");
      setAudioOutDevices(devices);
    });
  });

  return (
    <div className="">
      <label htmlFor="speaker-select">{t("pcs_speaker_label")}</label>
      <select name="speaker-select">
        {audioOutDevices.map((deviceInfo) => {
          return (
            <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
              {deviceInfo.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function CallSetup() {
  const location = useLocation();
  console.log(23, location);

  const { t } = useTranslation();
  useEffect(() => {
    addTracks();
  });
  return (
    <div className="call-setup-overlay">
      <div className="call-setup-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{t("pcs_main_heading")}</h3>
            <span className="subtitle">{t("pcs_sub_heading")}</span>
          </div>
          <button type="button" className="modal-close">
            &nbsp;
          </button>
        </div>
        <VideoFrame />
        <div className="av-setup-dropdowns">
          <VideoInputSelect />
          <AudioInputSelect />
          <AudioOutputSelect />
        </div>
        <a className="av-setup-reset">{t("pcs_btn_reset_devices")}</a>
        <Link to="/call" state={location.state}>
          <button type="submit" className="av-setup-confirm">
            {t("pcs_btn_join_call")}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CallSetup;
