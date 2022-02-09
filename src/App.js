import React from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import logo from "./logo.svg";

function CallSetup() {
  const { t, i18n } = useTranslation();
  return (
    <div className="call-setup-overlay">
      <div className="call-setup-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{t("pcs_main_heading")}</h3>
            <span className="subtitle">{t("pcs_sub_heading")}</span>
          </div>
          <button className="modal-close">X</button>
        </div>
        <VideoFrame />
        <div className="video-setup-dropdowns">
          <Dropdown title="Gewähltes Kamera" />
          <Dropdown title="Gewähltes Mikrofon" />
          <Dropdown title="Gewählte Lautsprecher" />
        </div>
        <a className="video-setup-reset">{t("pcs_btn_reset_devices")}</a>
        <button className="video-setup-confirm">{t("pcs_btn_join_call")}</button>
      </div>
    </div>
  );
}

function VideoFrame() {
  const { t, i18n } = useTranslation();

  return (
    <div className="video-container">
      <img src={logo} className="video-frame" alt="video" />
      <div className="video-controls">
        <button className="signal-button">
          { t("pcs_signal_good") } <
            span className="signal-update">{ t("pcs_signal_update") }</span>
        </button>
        <button className="push-right circle-button">M</button>
        <button className="circle-button">C</button>
      </div>
    </div>
  );
}

function Dropdown({ title, options }) {
  return (
    <div className="">
      <label for="webcam-select">{ title }</label>
      <select name="webcam-select">
        <option value="123">FaceTime HD camera</option>
      </select>
    </div>
  );
}

export default CallSetup;
