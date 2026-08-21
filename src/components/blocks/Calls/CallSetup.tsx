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
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { requestVideoAccessToken } from '../../../api/livekit';
import { useConnectedCallStore } from '../../../features/stores';
import { USER_ENDPOINT } from '../../../features/swr/index';
import { clearActiveTracks } from '../../../helpers/video';
import { getCallRoute } from '../../../router/routes';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles';
import ModalCard from '../Cards/ModalCard';

export const CallSetupCard = styled(ModalCard)<{ $hideJoinBtn?: boolean }>`
  ${({ theme, $hideJoinBtn }) => css`
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
    }

    ${MEDIA_DEVICE_MENU_CSS}
  `}
`;

type CallSetupProps = {
  onClose: () => void;
  userPk: string;
  skipPrejoin?: boolean;
};

function CallSetup({ onClose, userPk, skipPrejoin }: CallSetupProps) {
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [authData, setAuthData] = useState({
    chatId: null,
    token: null,
    livekitServerUrl: null,
  });
  const [error, setError] = useState('');
  const [audioPermissionError, setAudioPermissionError] = useState(false);
  const [videoPermissionError, setVideoPermissionError] = useState(false);

  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;
  const { connectToCall } = useConnectedCallStore();

  const handleJoin = (values: LocalUserChoices) => {
    connectToCall({
      userId: userPk,
      chatId: authData.chatId || '',
      tracks: values,
      callType: 'direct',
      token: authData.token || undefined,
      audioOptions: values.audioEnabled
        ? { deviceId: values.audioDeviceId }
        : false,
      videoOptions: values.videoEnabled
        ? { deviceId: values.videoDeviceId }
        : false,
      livekitServerUrl: authData.livekitServerUrl || undefined,
      audioPermissionDenied: audioPermissionError,
      videoPermissionDenied: videoPermissionError,
    });
    onClose();
    clearActiveTracks();
    navigate(getCallRoute(userPk));
  };

  useEffect(() => {
    // Request the video room access token
    requestVideoAccessToken({
      partnerId: userPk,
      onSuccess: res => {
        setAuthData({
          chatId: res.chat?.uuid,
          token: res.token,
          livekitServerUrl: res.server_url,
        });
      },
      onError: () => {
        setError('error.server_issue');
      },
    });
  }, []);

  // Answered from the native ring screen: the user already made the accept
  // decision there, so join with default devices instead of making them pick
  // devices and press Join again.
  const joinedRef = useRef(false);
  useEffect(() => {
    if (!skipPrejoin || !authData.token || joinedRef.current) {
      return;
    }
    joinedRef.current = true;
    handleJoin({
      username: username || '',
      videoEnabled: true,
      audioEnabled: true,
      videoDeviceId: 'default',
      audioDeviceId: 'default',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipPrejoin, authData.token]);

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
        (values.audioAvailable || values.videoAvailable) && authData.token,
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
    [authData.token, error, setAudioPermissionError, setVideoPermissionError],
  );

  return (
    <CallSetupCard>
      <CardHeader>{t('pcs_main_heading')}</CardHeader>
      <CardContent>
        <Text center type={TextTypes.Body4}>
          {t('pcs_sub_heading')}
        </Text>
      </CardContent>
      {!skipPrejoin && (
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
      )}
      {error && (
        <StatusMessage type={StatusTypes.Error} visible>
          {t(error)}
        </StatusMessage>
      )}
    </CallSetupCard>
  );
}

export default CallSetup;
