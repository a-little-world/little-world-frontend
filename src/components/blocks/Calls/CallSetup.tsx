/* eslint-disable jsx-a11y/media-has-caption */
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  CardContent,
  CardHeader,
  StatusMessage,
  StatusTypes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import {
  DevicePermissionError,
  LocalUserChoices,
  PreJoin,
  PreJoinValues,
} from '@livekit/components-react';
import type { PrejoinLanguage } from '@livekit/components-react/dist/prefabs/prejoinTranslations';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../api/endpoints';
import { requestVideoAccessToken } from '../../../api/livekit';
import {
  useCallTracksStore,
  useConnectedCallStore,
} from '../../../features/stores';
import { isE2EEAvailable } from '../../../helpers/e2ee';
import { getCallRoute } from '../../../router/routes';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles';
import ModalCard from '../Cards/ModalCard';
import { E2EEWarningCard } from './E2EEWarningModal';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const CallSetupCard = styled(ModalCard)<{
  $hideJoinBtn?: boolean;
  $joining?: boolean;
}>`
  ${({ theme, $hideJoinBtn, $joining }) => css`
    padding: ${theme.spacing.large};
    gap: 0;

    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
    }

    .lk-prejoin {
      margin: 0;
      padding: 0;
      width: 100%;

      .lk-video-container {
        border-radius: ${theme.radius.large};
      }

      .lk-form-control {
        display: none;
      }
    }

    .lk-join-button {
      font-weight: 700;
      border-radius: 90px;
      padding: ${theme.spacing.xsmall} ${theme.spacing.small};
      height: 49px;
      width: 100%;
      color: ${theme.color.text.reversed};
      border: none;
      background: ${theme.color.gradient.orange10};
      transition:
        background-color 0.5s ease,
        filter 0.5s ease,
        border-color 0.5s ease,
        color 0.5s ease,
        0.4s;

      &:not(:disabled):hover {
        filter: brightness(80%);
        transition:
          background-color 0.5s ease,
          filter 0.5s ease,
          border-color 0.5s ease,
          color 0.5s ease,
          0.4s;
      }

      ${$hideJoinBtn &&
      css`
        display: none;
      `}

      ${$joining &&
      css`
        position: relative;
        color: transparent;
        opacity: 1;
        cursor: progress;

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          margin: auto;
          width: 20px;
          height: 20px;
          border: 3px solid ${theme.color.text.reversed};
          border-right-color: transparent;
          border-radius: 50%;
          animation: ${spin} 0.8s linear infinite;
        }
      `}
    }

    ${MEDIA_DEVICE_MENU_CSS}
  `}
`;

type CallSetupProps = {
  onJoined: () => void;
  userPk: string;
};

function CallSetup({ onJoined, userPk }: CallSetupProps) {
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [authData, setAuthData] = useState({
    chatId: null,
    token: null,
    livekitServerUrl: null,
    e2eeKey: null,
  });
  const [error, setError] = useState('');
  const [audioPermissionError, setAudioPermissionError] = useState(false);
  const [videoPermissionError, setVideoPermissionError] = useState(false);

  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;
  const { connectToCall } = useConnectedCallStore();
  const { acquireTracks, releaseTracks } = useCallTracksStore();

  const [joining, setJoining] = useState(false);
  const joinedRef = useRef(false);
  const unmountedRef = useRef(false);

  // the call route renders outside this layout, so the dialog only goes away once the
  // call screen is in; clear the setup state then instead of before navigating
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      if (joinedRef.current) onJoined();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoin = async (values: LocalUserChoices) => {
    setJoining(true);
    const audioOptions = values.audioEnabled
      ? { deviceId: values.audioDeviceId }
      : false;
    const videoOptions = values.videoEnabled
      ? { deviceId: values.videoDeviceId }
      : false;
    // must be opened before PreJoin unmounts and stops its preview tracks
    await acquireTracks({ audio: audioOptions, video: videoOptions });
    if (unmountedRef.current) {
      releaseTracks();
      return;
    }
    connectToCall({
      userId: userPk,
      chatId: authData.chatId || '',
      tracks: values,
      callType: 'direct',
      token: authData.token || undefined,
      e2eeKey: authData.e2eeKey || undefined,
      audioOptions,
      videoOptions,
      livekitServerUrl: authData.livekitServerUrl || undefined,
      audioPermissionDenied: audioPermissionError,
      videoPermissionDenied: videoPermissionError,
    });
    joinedRef.current = true;
    navigate(getCallRoute(userPk));
  };

  useEffect(() => {
    // A client that cannot encrypt call media must not receive a room token.
    if (!isE2EEAvailable()) return;

    // Request the video room access token
    requestVideoAccessToken({
      partnerId: userPk,
      onSuccess: res => {
        setAuthData({
          chatId: res.chat?.uuid,
          token: res.token,
          livekitServerUrl: res.server_url,
          e2eeKey: res.e2ee_key,
        });
      },
      onError: () => {
        setError('error.server_issue');
      },
    });
  }, []);

  useEffect(() => {
    // Set permission error only when both audio and video have errors
    if (audioPermissionError && videoPermissionError) {
      setError('error.permissions');
    }
  }, [audioPermissionError, videoPermissionError]);

  const handleError = useCallback((e: Error) => {
    if (e instanceof DevicePermissionError) {
      if (e.deviceType === 'audio') {
        setAudioPermissionError(true);
      } else if (e.deviceType === 'video') {
        setVideoPermissionError(true);
      }
    } else {
      setError(e?.message || 'error.server_issue');
    }
  }, []);

  const handleValidate = useCallback(
    (values: PreJoinValues) => {
      const isValid = Boolean(
        (values.audioAvailable || values.videoAvailable) &&
        authData.token &&
        !joining,
      );

      if (values.videoAvailable) {
        setVideoPermissionError(false);
      }
      if (values.audioAvailable) {
        setAudioPermissionError(false);
      }
      if (isValid && error) setError('');
      return isValid;
    },
    [
      authData.token,
      error,
      joining,
      setAudioPermissionError,
      setVideoPermissionError,
    ],
  );

  if (true || !isE2EEAvailable()) {
    return <E2EEWarningCard />;
  }

  return (
    <CallSetupCard $joining={joining}>
      <CardHeader>{t('pcs_main_heading')}</CardHeader>
      <CardContent>
        <Text center type={TextTypes.Body4}>
          {t('pcs_sub_heading')}
        </Text>
      </CardContent>
      <PreJoin
        language={language as PrejoinLanguage}
        onSubmit={handleJoin}
        camLabel={t('pcs_camera_label')}
        micLabel={t('pcs_mic_label')}
        joinLabel={t('pcs_btn_join_call')}
        onError={handleError}
        onValidate={handleValidate}
        defaults={{ username }}
        persistUserChoices={false}
      />
      {error && (
        <StatusMessage type={StatusTypes.Error} visible>
          {t(error)}
        </StatusMessage>
      )}
    </CallSetupCard>
  );
}

export default CallSetup;
