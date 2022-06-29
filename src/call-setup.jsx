import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { BACKEND_PATH } from "./ENVIRONMENT";
import "./i18n";
import Link from "./path-prepend";
import { addAudioTrack, addVideoTrack, toggleLocalTracks } from "./twilio-helper";

import "./call-setup.css";

import signalWifi from "./images/signal-wifi.svg";

function SignalIndicator({ signalQuality, signalQualityText, signalUpdateText }) {
  const signalQualityImage = {
    good: signalWifi,
  };
  return (
    <button type="button" className="signal-button">
      <img id="signalQuality" alt={signalQualityText} src={signalQualityImage[signalQuality]} />
      <div className="text">
        {signalQualityText}&nbsp;
        <span className="signal-update">{signalUpdateText}</span>
      </div>
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
        defaultChecked={false}
        onChange={(e) => toggleLocalTracks(e.target.checked, "audio")}
      />
      <label htmlFor="audio-toggle">
        <div className="img" alt="toggle audio" />
      </label>
      <input
        type="checkbox"
        id="video-toggle"
        defaultChecked={false}
        onChange={(e) => toggleLocalTracks(e.target.checked, "video")}
      />
      <label htmlFor="video-toggle">
        <div className="img" alt="toggle video" />
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

function VideoInputSelect({ setVideo }) {
  const { t } = useTranslation();

  // get avaiable devices
  const [videoInDevices, setVideoInDevices] = useState([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const devices = deviceList
        .filter(({ kind }) => kind === "videoinput")
        .filter(({ label }) => !label.endsWith("facing back")) // don't show rear cameras
        .filter(({ deviceId }) => deviceId !== "default"); // prevent dupes
      setVideoInDevices(devices);
    });
  }, []);

  // set the first device as initial when devices have been detected
  useEffect(() => {
    if (videoInDevices[0]) {
      setVideo(videoInDevices[0].deviceId);
    }
  }, [videoInDevices]);

  const handleChange = (e) => {
    const deviceId = e.target.value;
    setVideo(deviceId);
  };

  return (
    <div className="webcam-select">
      <label htmlFor="webcam-select">{t("pcs_camera_label")}</label>
      <select name="webcam-select" onChange={handleChange}>
        {videoInDevices.map((deviceInfo) => (
          <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
            {deviceInfo.label.endsWith("facing front") ? t("pcs_front_camera") : deviceInfo.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function AudioInputSelect({ setAudio }) {
  const { t } = useTranslation();

  // get avaiable devices
  const [audioInDevices, setAudioInDevices] = useState([]);
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceList) => {
      const devices = deviceList
        .filter(({ kind }) => kind === "audioinput")
        .filter(({ deviceId }) => deviceId !== "default"); // prevent dupes
      setAudioInDevices(devices);
    });
  }, []);

  // set the first device as initial when devices have been detected
  useEffect(() => {
    if (audioInDevices[0]) {
      setAudio(audioInDevices[0].deviceId);
    }
  }, [audioInDevices]);

  const handleChange = (e) => {
    const deviceId = e.target.value;
    setAudio(deviceId);
  };

  return (
    <div className="mic-select">
      <label htmlFor="mic-select">{t("pcs_mic_label")}</label>
      <select name="mic-select" onChange={handleChange}>
        {audioInDevices.map((deviceInfo) => (
          <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
            {deviceInfo.label}
          </option>
        ))}
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
  }, []);

  return (
    <div className="speaker-select">
      <label htmlFor="speaker-select">{t("pcs_speaker_label")}</label>
      <select name="speaker-select">
        {audioOutDevices.map((deviceInfo) => (
          <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
            {deviceInfo.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CallSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { userPk } = location.state || {};
  useEffect(() => {
    if (!userPk) {
      navigate(`${BACKEND_PATH}/`);
    }
  }, [userPk]);

  const [videoTrack, setVideoTrack] = useState(null);
  const setVideo = (deviceId) => {
    localStorage.setItem("video muted", false); // always unmute when selecting new
    document.getElementById("video-toggle").checked = false;
    addVideoTrack(deviceId);
    setVideoTrack(deviceId);
  };

  const [audioTrack, setAudioTrack] = useState(null);
  const setAudio = (deviceId) => {
    localStorage.setItem("audio muted", false); // always unmute when selecting new
    document.getElementById("audio-toggle").checked = false;
    addAudioTrack(deviceId);
    setAudioTrack(deviceId);
  };

  const tracks = {
    videoId: videoTrack,
    audioId: audioTrack,
  };

  const [mediaPermission, setMediaPermission] = useState(null);

  navigator.permissions.query({ name: "microphone" }).then((audioResult) => {
    navigator.permissions.query({ name: "camera" }).then((videoResult) => {
      if ([audioResult.state, videoResult.state].includes("denied")) {
        // if either have been denied, we need to tell the user to fix their browser settings
        setMediaPermission(false);
      } else if ([audioResult.state, videoResult.state].includes("prompt")) {
        // otherwise if either don't have permission, we need to trigger the request
        navigator.getUserMedia(
          { video: videoResult.state === "prompt", audio: audioResult.state === "prompt" },
          () => setMediaPermission(true),
          (e) => console.log(e)
        );
      } else {
        // when both are granted, we are good and we'll show the setup
        setMediaPermission(true);
      }
    });
  });

  return (
    <div className="call-setup-overlay">
      <div className="call-setup-modal">
        <div className="modal-top">
          <div className="modal-header">
            <h3 className="title">{t("pcs_main_heading")}</h3>
            <span className="subtitle">{t("pcs_sub_heading")}</span>
          </div>
          <Link className="modal-close" to="/" />
        </div>
        {mediaPermission && (
          <>
            <VideoFrame />
            <div className="av-setup-dropdowns">
              <VideoInputSelect setVideo={setVideo} />
              <AudioInputSelect setAudio={setAudio} />
              <AudioOutputSelect />
            </div>
            <Link to="/call" className="av-setup-confirm" state={{ userPk, tracks }}>
              {t("pcs_btn_join_call")}
            </Link>
          </>
        )}
        {!mediaPermission && (
          <>
            <br />
            Permission to use the camera and microphone is required.
            <br />
            Please give permission in your browser settings.
            <br />
            See https://support.google.com/chrome/answer/2693767 for instructions.
          </>
        )}
      </div>
    </div>
  );
}

export default CallSetup;
