/* eslint-disable jsx-a11y/media-has-caption */
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Button,
  ButtonSizes,
  CardContent,
  CardFooter,
  CardHeader,
  StatusMessage,
  StatusTypes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import {
  DevicePermissionError,
  PreJoin,
  PreJoinValues,
} from '@livekit/components-react';
import type { PrejoinLanguage } from '@livekit/components-react/dist/prefabs/prejoinTranslations';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../api/endpoints';
import { requestVideoAccessToken } from '../../../api/livekit';
import {
  getDeviceOptions,
  useCallTracksStore,
  useConnectedCallStore,
} from '../../../features/stores';
import { getCallRoute } from '../../../router/routes';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles';
import ModalCard from '../Cards/ModalCard';

export const CallSetupCard = styled(ModalCard)`
  ${({ theme }) => css`
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
      display: none;
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

  const [choices, setChoices] = useState<PreJoinValues | null>(null);
  const [canJoin, setCanJoin] = useState(false);
  const [joining, setJoining] = useState(false);
  const joinedRef = useRef(false);
  const unmountedRef = useRef(false);

  // clear setup once the call screen replaced this layout, not before navigating
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      if (joinedRef.current) onJoined();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleJoin = async (values: PreJoinValues) => {
    setJoining(true);
    const deviceOptions = getDeviceOptions(values);
    // must be opened before PreJoin unmounts and stops its preview tracks
    await acquireTracks(deviceOptions);
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
      audioOptions: deviceOptions.audio,
      videoOptions: deviceOptions.video,
      livekitServerUrl: authData.livekitServerUrl || undefined,
      audioPermissionDenied: audioPermissionError,
      videoPermissionDenied: videoPermissionError,
    });
    joinedRef.current = true;
    navigate(getCallRoute(userPk), { replace: true });
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
      setChoices(values);
      const isValid = Boolean(
        (values.audioAvailable || values.videoAvailable) && authData.token,
      );

      if (values.videoAvailable) {
        setVideoPermissionError(false);
      }
      if (values.audioAvailable) {
        setAudioPermissionError(false);
      }
      setCanJoin(isValid);
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
      <PreJoin
        language={language as PrejoinLanguage}
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
      <CardFooter align="center">
        <Button
          size={ButtonSizes.Stretch}
          disabled={!canJoin || joining}
          loading={joining}
          onClick={() => choices && handleJoin(choices)}
        >
          {t('pcs_btn_join_call')}
        </Button>
      </CardFooter>
    </CallSetupCard>
  );
}

export default CallSetup;
