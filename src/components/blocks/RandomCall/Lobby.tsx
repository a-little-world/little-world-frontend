/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  CloseIcon,
} from '@a-little-world/little-world-design-system';
import React, { useEffect, useState } from 'react';

import styled, { css } from 'styled-components';

import { mutate } from 'swr';
import { exitLobby, joinLobby, requestRandomToken } from '../../../api/livekit.ts';
import { default as useRandomCallLobbyStore } from '../../../features/stores/randomCallLobby.ts';
import useRandomCallSetupStore from '../../../features/stores/randomCallSetup.ts';
import { CHATS_ENDPOINT } from '../../../features/swr/index.ts';
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

const RandomCallLobbyCard = styled(ModalCard)`
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

type CallLobbyProps = {
  onClose: () => void;
  userPk: string;
};

function Lobby({ onClose, userPk }: CallLobbyProps) {

  // Zustand store hooks
  const randomCallLobby = useRandomCallLobbyStore();
  const randomCallSetup = useRandomCallSetupStore();
  const [authData, setAuthData] = useState({
    chatId: null,
    token: null,
    livekitServerUrl: null,
    randomCallMatchId: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    joinLobby({
      userId: userPk,
      onSuccess: res => {
      },
      onError: () => {
        setError('error.server_issue');
      },
    })
  }, []);

  const [tick, setTick] = useState(0); // trigger to re-run useEffect

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1); // update state to force effect
    }, 5000);

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  useEffect(() => {
    // Request the video room access token
    console.log('Requesting video access token for user:', userPk);
    requestRandomToken({
      userId: userPk,
      onSuccess: res => {
        mutate(CHATS_ENDPOINT);
        setAuthData({
          chatId: res.chat.uuid,
          token: res.token,
          livekitServerUrl: res.server_url,
          randomCallMatchId: res.random_call_match_id,
        });
      },
      onError: () => {
        setError('error.server_issue');
      },
    });
    if (authData.token) {
      randomCallSetup.initRandomCallSetup({ userId: userPk, authData: authData });
    }
  }, [tick]);

  return (
    <RandomCallLobbyCard>
      <CloseButton
        variation={ButtonVariations.Icon}
        onClick={() => {
          randomCallLobby.cancelRandomCallLobby({ userId: "" })
          exitLobby({
            userId: userPk,
            onSuccess: res => {
            },
            onError: () => {
              setError('error.server_issue');
            },
          });
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
      GIF
    </RandomCallLobbyCard>
  );
}

export default Lobby;

