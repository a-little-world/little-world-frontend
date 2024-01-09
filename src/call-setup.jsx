/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonAppearance,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './call-setup.css';
import ButtonsContainer from './components/atoms/ButtonsContainer';
import ProfileImage from './components/atoms/ProfileImage';
import ModalCard, { Centred } from './components/blocks/Cards/ModalCard';
import {
  cancelCallSetup,
  initActiveCall,
  selectMatchByPartnerId,
} from './features/userData';
import './i18n';
import signalWifi from './images/signal-wifi.svg';
import { CALL_ROUTE, getAppRoute } from './routes';
import {
  getAudioTrack,
  getVideoTrack,
  toggleLocalTracks,
} from './twilio-helper';

if (!window.activeTracks) window.activeTracks = [];

export const clearActiveTracks = () => {
  console.log('CLEARING ACTIVE TRACKS', window.activeTracks);
  window.activeTracks.forEach(track => {
    track.stop();
  });
  window.activeTracks = [];
};

function SignalIndicator({
  signalQuality,
  signalQualityText,
  signalUpdateText,
}) {
  const signalQualityImage = {
    good: signalWifi,
  };
  return (
    <button type="button" className="signal-button">
      <img
        id="signalQuality"
        alt={signalQualityText}
        src={signalQualityImage[signalQuality]}
      />
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
        onChange={e => toggleLocalTracks(e.target.checked, 'audio')}
      />
      <label htmlFor="audio-toggle">
        <div className="img" alt="toggle audio" />
      </label>
      <input
        type="checkbox"
        id="video-toggle"
        defaultChecked={false}
        onChange={e => toggleLocalTracks(e.target.checked, 'video')}
      />
      <label htmlFor="video-toggle">
        <div className="img" alt="toggle video" />
      </label>
    </div>
  );
}

function VideoFrame({ Video, Audio }) {
  const { t } = useTranslation();

  const quality = 'good';
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t('pcs_signal_update');
  const signalInfo = { quality, qualityText, updateText };

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
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
      const devices = deviceList
        .filter(({ kind }) => kind === 'videoinput')
        .filter(({ label }) => !label.endsWith('facing back')) // don't show rear cameras
        .filter(({ deviceId }) => deviceId !== 'default'); // prevent dupes
      setVideoInDevices(devices);
    });
  }, []);

  // set the first device as initial when devices have been detected
  useEffect(() => {
    if (videoInDevices[0]) {
      setVideo(videoInDevices[0].deviceId);
    }
  }, [videoInDevices]);

  const handleChange = e => {
    const deviceId = e.target.value;
    setVideo(deviceId);
  };

  return (
    <div className="webcam-select">
      <label htmlFor="webcam-select">{t('pcs_camera_label')}</label>
      <select name="webcam-select" onChange={handleChange}>
        {videoInDevices.map(deviceInfo => (
          <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
            {deviceInfo.label.endsWith('facing front')
              ? t('pcs_front_camera')
              : deviceInfo.label}
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
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
      const devices = deviceList
        .filter(({ kind }) => kind === 'audioinput')
        .filter(({ deviceId }) => deviceId !== 'default'); // prevent dupes
      setAudioInDevices(devices);
    });
  }, []);

  // set the first device as initial when devices have been detected
  useEffect(() => {
    if (audioInDevices[0]) {
      setAudio(audioInDevices[0].deviceId);
    }
  }, [audioInDevices]);

  const handleChange = e => {
    const deviceId = e.target.value;
    setAudio(deviceId);
  };

  return (
    <div className="mic-select">
      <label htmlFor="mic-select">{t('pcs_mic_label')}</label>
      <select name="mic-select" onChange={handleChange}>
        {audioInDevices.map(deviceInfo => (
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
    navigator.mediaDevices.enumerateDevices().then(deviceList => {
      const devices = deviceList
        .filter(deviceInfo => deviceInfo.kind === 'audiooutput')
        .filter(deviceInfo => deviceInfo.deviceId !== 'default');
      setAudioOutDevices(devices);
    });
  }, []);

  return (
    <div className="speaker-select">
      <label htmlFor="speaker-select">{t('pcs_speaker_label')}</label>
      <select name="speaker-select">
        {audioOutDevices.map(deviceInfo => (
          <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
            {deviceInfo.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CallSetup({ userPk, removeCallSetupPartner }) {
  const { t } = useTranslation();
  const quality = 'good';
  const qualityText = t(`pcs_signal_${quality}`);
  const updateText = t('pcs_signal_update');
  const signalInfo = { quality, qualityText, updateText };
  const mediaStream = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const videoRef = useRef();
  const [videoTrackId, setVideoTrackId] = useState(null);
  const setVideo = deviceId => {
    localStorage.setItem('video muted', false); // always unmute when selecting new
    document.getElementById('video-toggle').checked = false;
    getVideoTrack(deviceId).then(track => {
      const el = videoRef.current;
      track.attach(el);
      window.activeTracks.push(track);
    });
    setVideoTrackId(deviceId);
  };

  const audioRef = useRef();
  const [audioTrackId, setAudioTrackId] = useState(null);
  const setAudio = deviceId => {
    localStorage.setItem('audio muted', false); // always unmute when selecting new
    document.getElementById('audio-toggle').checked = false;
    getAudioTrack(deviceId).then(track => {
      track.attach(audioRef.current);
      window.activeTracks.push(track);
    });
    setAudioTrackId(deviceId);
  };

  const tracks = {
    videoId: videoTrackId,
    audioId: audioTrackId,
  };

  const [mediaPermission, setMediaPermission] = useState(null);

  useEffect(() => {
    let activeStream = null;
    console.log('GETTING USER MEDIA');
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(stream => {
        if (mediaStream.current)
          mediaStream.current.getTracks().forEach(track => track.stop());
        activeStream = stream;
        mediaStream.current = stream; // Set the reference for use outside the effect
        setMediaPermission(true);
      })
      .catch(e => {
        console.error(e.name, e.message);
        setMediaPermission(false);
      });
    return () => {
      // Cleanup function when component unmounts
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      // If the reference is the same as the one we're cleaning up, clear it
      if (mediaStream.current === activeStream) {
        mediaStream.current = null;
      }
    };
  }, []);

  return (
    <div className="modal-box">
      <button
        type="button"
        className="modal-close"
        onClick={() => {
          removeCallSetupPartner();
          if (mediaStream.current)
            mediaStream.current.getTracks().forEach(track => {
              console.log('CANCELLED', track);
              track.stop();
            });
          clearActiveTracks();
        }}
      />
      <h3 className="title">{t('pcs_main_heading')}</h3>
      <span className="subtitle">{t('pcs_sub_heading')}</span>
      {mediaPermission && (
        <>
          <VideoFrame
            Video={videoRef}
            Audio={audioRef}
            signalInfo={signalInfo}
          />
          <div className="av-setup-dropdowns">
            <VideoInputSelect setVideo={setVideo} />
            <AudioInputSelect setAudio={setAudio} />
            <AudioOutputSelect />
          </div>
          <button
            onClick={() => {
              clearActiveTracks();
              dispatch(initActiveCall({ userPk, tracks }));
              dispatch(cancelCallSetup());
              navigate(getAppRoute(CALL_ROUTE), { state: { userPk, tracks } });
            }}
            className="av-setup-confirm"
          >
            {t('pcs_btn_join_call')}
          </button>
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

function IncomingCall({ userPk, onAnswerCall, onRejectCall }) {
  const { t } = useTranslation();
  const matches = useSelector(state => state.userData.matches);
  if (!userPk) return null;
  const { partner: profile } = selectMatchByPartnerId(matches, userPk);

  const usesAvatar = profile.image_type === 'avatar';

  return (
    <ModalCard>
      <button type="button" className="modal-close" onClick={onRejectCall} />
      <Centred>
        <ProfileImage
          image={usesAvatar ? profile.avatar_config : profile.image}
          imageType={profile.image_type}
        />
        <Text tag="h3" type={TextTypes.Heading2}>
          {`${profile.first_name} ${t('pcs_waiting')}`}
        </Text>
      </Centred>
      <ButtonsContainer>
        <Button appearance={ButtonAppearance.Secondary} onClick={onRejectCall}>
          {t('pcs_btn_reject_call')}
        </Button>
        <Button onClick={onAnswerCall}>{t('pcs_btn_join_call')}</Button>
      </ButtonsContainer>
    </ModalCard>
  );
}

export { IncomingCall };
export default CallSetup;
