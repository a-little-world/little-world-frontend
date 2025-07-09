/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  CloseIcon,
} from '@a-little-world/little-world-design-system';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styled, { css } from 'styled-components';

import { exitLobby, joinLobby } from '../../../api/livekit.ts';
import { default as useRandomCallLobbyStore } from '../../../features/stores/randomCallLobby.ts';
import { default as useRandomCallSetupStore } from '../../../features/stores/randomCallSetup.ts';
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

const JoinLobbyButton = styled(Button)`
  ${({ theme, $isLink }) =>
    $isLink &&
    css`
      color: ${theme.color.text.link};
    `}
`;

function Lobby({ onClose, userPk }: CallLobbyProps) {
  const { t } = useTranslation();

  // Zustand store hooks
  const randomCallLobby = useRandomCallLobbyStore();
  const randomCallSetup = useRandomCallSetupStore();

  useEffect(() => {
    console.log(randomCallLobby.randomCallLobby)
    if (randomCallLobby.randomCallLobby?.userId === "") {
      exitLobby({
        userId: userPk,
        onSuccess: res => {
        },
        onError: () => {
          setError('error.server_issue');
        },
      });
    } else {
      joinLobby({
        userId: userPk,
        onSuccess: res => {
        },
        onError: () => {
          setError('error.server_issue');
        },
      });
    }
  }, [randomCallLobby]);

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
      <JoinLobbyButton
        onClick={() => randomCallSetup.initRandomCallSetup({ userId: userPk })}
      >
        {t(`start_random_call.lobby_btn`)}
      </JoinLobbyButton>
    </RandomCallLobbyCard>
  );
}

export default Lobby;
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

