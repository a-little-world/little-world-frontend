import React from "react";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import signalWifi from "./images/signal-wifi.svg";

const { connect, createLocalTracks } = require("twilio-video");

function handleMediaError(error) {
  console.error(`${error.name} Failed to acquire media: ${error.message}`);
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
      const localMediaContainer = document.querySelector(".local-video-container");
      // temporarily setting last audio/video track found as default
      localTracks.forEach((track) => {
        activeTracks[track.kind] = track;
      });
      localMediaContainer.prepend(activeTracks.video.attach());
      localMediaContainer.prepend(activeTracks.audio.attach());

      return fetch("http://token-service-2436-dev.twil.io/token"); //from https://www.twilio.com/blog/generate-access-token-twilio-chat-video-voice-using-twilio-functions
    },
    (error) => {
      handleMediaError(error);
    }
  )
  .then((response) => response.json())
  .then((data) => {
    const token = data.accessToken;
    // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2QxNDY4YWFiYmM1NzE0OWMwMTJkZmI0ZjMyMGQyYTBiLTE2NDY5MjM0MTciLCJncmFudHMiOnsidmlkZW8iOnsicm9vbSI6ImNvb2wgcm9vbSJ9fSwiaWF0IjoxNjQ2OTIzNDE3LCJleHAiOjE2NDY5MjcwMTcsImlzcyI6IlNLZDE0NjhhYWJiYzU3MTQ5YzAxMmRmYjRmMzIwZDJhMGIiLCJzdWIiOiJBQ2EwMzQ0ZGQ0OWY3MjQzNzQ5MTY0ZTQyNGM5YTk1YjE3In0.u1ywhDWCrnhJvZoCRfiamCsoXmHoM8XJNbfqwtb80Yc";
    console.log(14, data.accessToken);
    console.log(15, token);
    connect(token, {
      name: "CoolRoom", //from https://www.twilio.com/blog/generate-access-token-twilio-chat-video-voice-using-twilio-functions
      tracks: [activeTracks.video, activeTracks.audio],
    }).then((room) => {
      console.log("Connected to Room:", room.name);
    });
  });

function toggleLocalTracks(isOn, trackType) {
  const track = activeTracks[trackType];
  if (isOn) {
    track.enable();
  } else {
    track.disable();
  }
}

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
  const { t, i18n } = useTranslation();
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
            state: { message: "hello, im a passed message!" },
          }}
        >
          pressme
        </Link>
        <a href="./call">
          <button type="submit" className="video-setup-confirm">
            {t("pcs_btn_join_call")}
          </button>
        </a>
      </div>
    </div>
  );
}

export default CallSetup;
