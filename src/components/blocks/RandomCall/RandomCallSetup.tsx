/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  CloseIcon,
  MessageTypes,
  StatusMessage,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { LocalUserChoices, PreJoin } from '@livekit/components-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import useSWR, { mutate } from 'swr';
import { requestRandomToken, resetMatch } from '../../../api/livekit.ts';
import { default as useActiveCallStore } from '../../../features/stores/activeCall';
import useRandomCallPairStore from '../../../features/stores/randomCallPair.ts';
import { default as useRandomCallSetupStore } from '../../../features/stores/randomCallSetup.ts';
import { CHATS_ENDPOINT, fetcher, USER_ENDPOINT } from '../../../features/swr/index.ts';
import { clearActiveTracks } from '../../../helpers/video.ts';
import { getCallRoute } from '../../../router/routes.ts';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles.tsx';
import ModalCard from '../Cards/ModalCard';

const CloseButton = styled(Button)`
  position: absolute;

  ${({ theme }) => css`
    right: ${theme.spacing.small};
    top: ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.medium}) {
      right: ${theme.spacing.medium};
      top: ${theme.spacing.medium};
    }
  `}
`;

const RandomCallSetupCard = styled(ModalCard)`
  ${({ theme }) => css`
    padding: ${theme.spacing.large};
    gap: ${theme.spacing.xsmall};

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
      
      .lk-button-menu {
        height: 100%;
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
      transition: background-color 0.5s ease, filter 0.5s ease,
        border-color 0.5s ease, color 0.5s ease, 0.4s;

      &:not(:disabled):hover {
        filter: brightness(80%);
        transition: background-color 0.5s ease, filter 0.5s ease,
          border-color 0.5s ease, color 0.5s ease, 0.4s;
      }
    }

    ${MEDIA_DEVICE_MENU_CSS}
  `}
`;

type RandomCallSetupProps = {
  onClose: () => void;
  userPk: string;
};

function RandomCallSetup({ onClose, userPk }: RandomCallSetupProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState('');

  const { data: user } = useSWR(USER_ENDPOINT, fetcher)
  const username = user?.id;

  // Zustand store hooks
  const { initActiveCall } = useActiveCallStore();
  const randomCallSetup = useRandomCallSetupStore();
  const randomCallPair = useRandomCallPairStore();

  const [authData, setAuthData] = useState({
    chatId: null,
    token: null,
    livekitServerUrl: null,
    randomCallMatchId: null,
  });

  useEffect(() => {
    requestRandomToken({
      matchId: randomCallPair.randomCallPair?.matchId,
      onSuccess: res => {
        mutate(CHATS_ENDPOINT);
        const authDataTmp = {
          chatId: res.chat.uuid,
          token: res.token,
          livekitServerUrl: res.server_url,
          randomCallMatchId: res.random_match_id,
        };
        setAuthData(authDataTmp)
        randomCallSetup.initRandomCallSetup({ userId: userPk, authData: authDataTmp });
      },
      onError: () => {
        setError('error.server_issue');
      },
    });
  }, []);

  const handleJoin = (values: LocalUserChoices) => {
    initActiveCall({
      userId: userPk,
      chatId: randomCallSetup.randomCallSetup?.authData.chatId || '',
      tracks: values,
      token: randomCallSetup.randomCallSetup?.authData.token || undefined,
      audioOptions: values.audioEnabled
        ? { deviceId: values.audioDeviceId }
        : false,
      videoOptions: values.videoEnabled
        ? { deviceId: values.videoDeviceId }
        : false,
      livekitServerUrl: randomCallSetup.randomCallSetup?.authData.livekitServerUrl || undefined,
      randomCallMatchId: randomCallSetup.randomCallSetup?.authData.randomCallMatchId || undefined,
    });
    onClose();
    clearActiveTracks();
    navigate(getCallRoute(userPk));
  };

  const handleError = () => {
    setError('error.permissions');
  };

  const handleValidate = (values: LocalUserChoices) => {
    const isValid = Boolean(
      (values.audioDeviceId || values.videoDeviceId) && authData.token,
    );
    if (isValid) setError('');
    return isValid;
  };

  return (
    <RandomCallSetupCard>
      <CloseButton
        variation={ButtonVariations.Icon}
        onClick={() => {
          resetMatch({
            matchId: randomCallSetup.randomCallSetup?.authData.randomCallMatchId,
            onSuccess: res => {
            },
            onError: () => {
              setError('error.server_issue');
            },
          });
          randomCallSetup.cancelRandomCallSetup();
          onClose();
        }}
      >
        <CloseIcon
          label="close modal"
          labelId="close_icon"
          width="24"
          height="24"
        />
      </CloseButton>
      <div>
        <Text center type={TextTypes.Heading4}>
          {t('random_call_setup.title')}
        </Text>
        <Text center type={TextTypes.Body4}>
          {t('pcs_sub_heading')}
        </Text>
      </div>
      <PreJoin
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
        <StatusMessage $type={MessageTypes.Error} $visible>
          {t(error)}
        </StatusMessage>
      )}
    </RandomCallSetupCard>
  );
}

export default RandomCallSetup;
