/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useDispatch, useSelector } from "react-redux";

import { blockIncomingCall, selectMatchByPartnerId } from "./features/userData";
import "./i18n";
import Link from "./path-prepend";
import { CALL_ROUTE, getAppRoute } from "./routes";
import { getAudioTrack, getVideoTrack, toggleLocalTracks } from "./twilio-helper";

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

export function VideoControls({ signalInfo }) {
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

function VideoFrame({ Video, Audio }) {
  return (
    <div className="local-video-container">
      <div id="container" className="video-frame" alt="video">
        <video ref={Video} />
        <audio ref={Audio} />
      </div>
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

function CallSetup({ userPk, setCallSetupPartner }) {
  const { t } = useTranslation();
  const quality = "good";
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t("pcs_signal_update");
  const signalInfo = { quality, qualityText, updateText };

  const videoRef = useRef();
  const [videoTrackId, setVideoTrackId] = useState(null);
  const setVideo = (deviceId) => {
    localStorage.setItem("video muted", false); // always unmute when selecting new
    document.getElementById("video-toggle").checked = false;
    getVideoTrack(deviceId).then((track) => {
      const el = videoRef.current;
      track.attach(el);
    });
    setVideoTrackId(deviceId);
  };

  const audioRef = useRef();
  const [audioTrackId, setAudioTrackId] = useState(null);
  const setAudio = (deviceId) => {
    localStorage.setItem("audio muted", false); // always unmute when selecting new
    document.getElementById("audio-toggle").checked = false;
    getAudioTrack(deviceId).then((track) => track.attach(audioRef.current));
    setAudioTrackId(deviceId);
  };

  const tracks = {
    videoId: videoTrackId,
    audioId: audioTrackId,
  };

  const [mediaPermission, setMediaPermission] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => setMediaPermission(true))
      .catch((e) => {
        console.error(e.name, e.message);
        setMediaPermission(false);
      });
  }, []);

  return (
    <div className="modal-box">
      <button type="button" className="modal-close" onClick={() => setCallSetupPartner(null)} />
      <h3 className="title">{t("pcs_main_heading")}</h3>
      <span className="subtitle">{t("pcs_sub_heading")}</span>
      {mediaPermission && (
        <>
          <VideoFrame Video={videoRef} Audio={audioRef} signalInfo={signalInfo} />
          <div className="av-setup-dropdowns">
            <VideoInputSelect setVideo={setVideo} />
            <AudioInputSelect setAudio={setAudio} />
            <AudioOutputSelect />
          </div>
          <Link
            to={getAppRoute(CALL_ROUTE)}
            className="av-setup-confirm"
            state={{ userPk, tracks }}
          >
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
  );
}

function IncomingCall({ userPk, matchesInfo, setVisible, setCallSetupPartner }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.userData.matches);
  const { partner: profile, ...match } = selectMatchByPartnerId(matches, userPk);
  console.log("INCOMING CALL", match, matches, userPk);
  const usesAvatar = profile.image_type === "avatar";
  const answerCall = () => {
    setCallSetupPartner(userPk);
  };
  const rejectCall = () => {
    dispatch(blockIncomingCall({ userId: userPk }));
  };
  return (
    <div className="modal-box incoming-call-modal">
      <button type="button" className="modal-close" onClick={rejectCall} />
      <div className="content">
        {usesAvatar ? (
          <Avatar className="profile-avatar" {...profile.avatar_config} />
        ) : (
          <img alt="match" className="profile-image" src={profile.image} />
        )}
        <div className="message-text">{`${profile.first_name} ${t("pcs_waiting")}`}</div>
        <div className="buttons">
          <button type="button" className="answer-call" onClick={answerCall}>
            {t("pcs_btn_join_call")}
          </button>
          <button type="button" className="reject-call" onClick={rejectCall}>
            {t("pcs_btn_reject_call")}
          </button>
        </div>
      </div>
    </div>
  );
}

export { IncomingCall };
export default CallSetup;
