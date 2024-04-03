/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CloseIcon,
  FullScreenExitIcon,
  FullScreenIcon,
  MessageIcon,
  MessageWithQuestionIcon,
  Text,
  TextTypes,
  TranslatorIcon,
} from '@a-little-world/little-world-design-system';
import {
  DisconnectButton,
  PreJoin,
  TrackToggle,
  useDisconnectButton,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
  cancelCallSetup,
  initActiveCall,
  selectMatchByPartnerId,
} from '../../../features/userData';
import signalWifi from '../../../images/signal-wifi.svg';
import { CALL_ROUTE, getAppRoute } from '../../../routes';
import {
  getAudioTrack,
  getVideoTrack,
  toggleLocalTracks,
} from '../../../twilio-helper';
import Timer from '../../atoms/Timer.tsx';
import ModalCard, { Centred } from '../Cards/ModalCard';

const Bar = styled.div<{ $position: 'top' | 'bottom' }>`
  width: 100%;
  position: absolute;
  transform: translateX(50%);
  right: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow: scroll;

  ${({ $position, theme }) => {
    if ($position === 'top')
      return css`
        top: 0;
        @media (min-width: ${theme.breakpoints.large}) {
          display: none;
        }
      `;
    if ($position === 'bottom')
      return css`
        bottom: 0;
      `;
  }}
`;

const TOGGLE_CSS = css`
  background: ${({ theme }) => theme.color.surface.contrast || 'black'};
  color: ${({ theme }) => theme.color.text.control};
  border-radius: 50%;
  transition: filter 0.5s ease;

  &:hover {
    filter: brightness(80%);
    transition: filter 0.5s ease;
  }
`;

const Toggle = styled(TrackToggle)`
  ${TOGGLE_CSS};
  width: 44px;
  height: 44px;
`;

const ToggleBtn = styled(Button)<{ $active: boolean; $desktopOnly?: boolean }>`
  ${TOGGLE_CSS};

  ${({ $active, $desktopOnly, theme }) => css`
    display: ${$desktopOnly ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
    ${$active && `color: red`}
  `}
`;

const DisconnectBtn = styled(Button)`
  background: ${({ theme }) => theme.color.gradient.orange20};
`;

const Section = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const StyledTimer = styled(Timer)<{ $desktopOnly?: boolean }>`
  ${({ $desktopOnly, theme }) => css`
    display: ${$desktopOnly ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}
`;

type ControlBarProps = {
  activeOption?: string;
  onChatToggle: () => void;
  onFullScreenToggle: () => void;
  onTranslatorToggle: () => void;
};

export const TopControlBar = ({
  activeOption,
  onChatToggle,
  onQuestionCardsToggle,
  onTranslatorToggle,
}) => {
  const { t } = useTranslation();
  return (
    <Bar $position="top">
      <ToggleBtn
        $active={activeOption === 'chat'}
        onClick={onChatToggle}
        variation={ButtonVariations.Circle}
      >
        <MessageIcon label={t('call.chat_label')} labelId="chat_toggle" />
      </ToggleBtn>
      <ToggleBtn
        $active={activeOption === 'translator'}
        onClick={onTranslatorToggle}
        variation={ButtonVariations.Circle}
      >
        <TranslatorIcon label={t('call.chat_label')} labelId="chat_toggle" />
      </ToggleBtn>
      <ToggleBtn
        $active={activeOption === 'questions'}
        onClick={onQuestionCardsToggle}
        variation={ButtonVariations.Circle}
      >
        <MessageWithQuestionIcon
          label="question cards"
          labelId="questionCards"
        />
      </ToggleBtn>
    </Bar>
  );
};

function ControlBar({
  isFullScreen,
  onChatToggle,
  onFullScreenToggle,
  onTranslatorToggle,
}: ControlBarProps) {
  const { t } = useTranslation();
  const { buttonProps: disconnectProps } = useDisconnectButton({});

  return (
    <Bar $position="bottom">
      <Section>
        <Toggle source={Track.Source.Microphone} showIcon />
        <Toggle source={Track.Source.Camera} showIcon />
        <ToggleBtn
          onClick={onFullScreenToggle}
          variation={ButtonVariations.Circle}
        >
          {isFullScreen ? (
            <FullScreenExitIcon
              label="exit fullscreen"
              labelId={'exitFullScreen'}
            />
          ) : (
            <FullScreenIcon
              label="fullscreen video toggle"
              labelId="fullscreen"
            />
          )}
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onChatToggle}
          variation={ButtonVariations.Circle}
        >
          <MessageIcon label={t('call.chat_label')} labelId="chat_toggle" />
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onTranslatorToggle}
          variation={ButtonVariations.Circle}
        >
          <TranslatorIcon label={t('call.chat_label')} labelId="chat_toggle" />
        </ToggleBtn>
      </Section>
      <Section>
        <StyledTimer $desktopOnly />
        <DisconnectBtn {...disconnectProps}>
          {t('call.leave_btn')}
        </DisconnectBtn>
      </Section>
    </Bar>
  );
}

export default ControlBar;
