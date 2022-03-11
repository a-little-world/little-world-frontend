import React, { useEffect } from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

function Dropdown({ title, options }) {
  return (
    <div className="">
      <label htmlFor="webcam-select">{title}</label>
      <select name="webcam-select">
        <option value="123">FaceTime HD camera</option>
      </select>
    </div>
  );
}

function CallSetup() {
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
        <div className="video-setup-dropdowns">
          <Dropdown title="Gewähltes Kamera" />
          <Dropdown title="Gewähltes Mikrofon" />
          <Dropdown title="Gewählte Lautsprecher" />
        </div>
        <a className="video-setup-reset">{t("pcs_btn_reset_devices")}</a>
        <Link
          to={{
            pathname: "/call",
          }}
        >
          <button type="submit" className="video-setup-confirm">
            {t("pcs_btn_join_call")}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CallSetup;
