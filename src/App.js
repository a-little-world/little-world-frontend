import React from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";

const { connect, createLocalTracks } = require("twilio-video");

const token = "";

const mediaErrors = [
  "NotAllowedError",
  "NotFoundError",
  "NotReadableError",
  "OverconstrainedError",
  "TypeError",
];

function handleMediaError(error) {
  console.error("Failed to acquire media:", error.name, error.message);
}

const activeTracks = { video: null, audio: null };

// initialise webcam and mic
createLocalTracks(
  {
    audio: true,
    video: { width: 576, height: 276 },
  },
  (error) => {
    console.error(`Unable to create local track: ${error.message}`);
  }
)
  .then(
    (localTracks) => {
      const localMediaContainer = document.querySelector(".video-container");
      // temporarily setting last audio/video track found as default
      localTracks.forEach((track) => {
        activeTracks[track.kind] = track;
      });
      localMediaContainer.prepend(activeTracks.video.attach());
      localMediaContainer.prepend(activeTracks.audio.attach());

      return connect(token, {
        name: "my-room-name",
        tracks: localTracks,
      });
    },
    (error) => {
      handleMediaError(error);
    }
  )
  .then(
    (room) => {
      console.log(`Connected to Room: ${room.name}`);
    },
    (error) => {
      if (mediaErrors.includes(error.name)) {
        handleMediaError(error);
      }
    }
  );

function toggleLocalTracks(isOn, trackType) {
  const track = activeTracks[trackType];
  if (isOn) {
    track.enable();
  } else {
    track.disable();
  }
}

function VideoFrame() {
  const { t, i18n } = useTranslation();

  return (
    <div className="video-container">
      <div id="container" className="video-frame" alt="video" />
      <div className="video-controls">
        <button type="button" className="signal-button">
          {t("pcs_signal_good")} <span className="signal-update">{t("pcs_signal_update")}</span>
        </button>
        <input
          type="checkbox"
          id="audio-toggle"
          defaultChecked="checked"
          onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
        />
        <label htmlFor="audio-toggle" />
        <input
          type="checkbox"
          id="video-toggle"
          defaultChecked="checked"
          onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
        />
        <label htmlFor="video-toggle" />
      </div>
    </div>
  );
}

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
          <button type="button" className="modal-close">
            X
          </button>
        </div>
        <VideoFrame />
        <div className="video-setup-dropdowns">
          <Dropdown title="Gewähltes Kamera" />
          <Dropdown title="Gewähltes Mikrofon" />
          <Dropdown title="Gewählte Lautsprecher" />
        </div>
        <a className="video-setup-reset">{t("pcs_btn_reset_devices")}</a>
        <button type="submit" className="video-setup-confirm">
          {t("pcs_btn_join_call")}
        </button>
      </div>
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

export default CallSetup;
