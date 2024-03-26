/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CloseIcon,
  FullScreenIcon,
  MessageIcon,
  MessageWithQuestionIcon,
  Text,
  TextTypes,
  Translator,
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 0;
  transition: filter 0.5s ease;

  &:hover {
    filter: brightness(80%);
    transition: filter 0.5s ease;
  }
`;

const Toggle = styled(TrackToggle)`
  ${TOGGLE_CSS};
`;

const ToggleBtn = styled(Button)<{ $desktopOnly?: boolean }>`
  ${TOGGLE_CSS};

  ${({ $desktopOnly, theme }) => css`
    display: ${$desktopOnly ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
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
  onChatToggle: () => void;
  onFullScreenToggle: () => void;
  onTranslatorToggle: () => void;
};

export const TopControlBar = ({
  onChatToggle,
  onQuestionCardsToggle,
  onTranslatorToggle,
}) => {
  const { t } = useTranslation();
  return (
    <Bar $position="top">
      <ToggleBtn onClick={onChatToggle} variation={ButtonVariations.Control}>
        <MessageIcon label={t('call.chat_label')} labelId="chat_toggle" />
      </ToggleBtn>
      <ToggleBtn
        onClick={onTranslatorToggle}
        variation={ButtonVariations.Control}
      >
        <Translator label={t('call.chat_label')} labelId="chat_toggle" />
      </ToggleBtn>
      <ToggleBtn
        onClick={onQuestionCardsToggle}
        variation={ButtonVariations.Control}
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
          variation={ButtonVariations.Control}
        >
          <FullScreenIcon
            label="fullscreen video toggle"
            labelId="fullscreen"
          />
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onChatToggle}
          variation={ButtonVariations.Control}
        >
          <MessageIcon label={t('call.chat_label')} labelId="chat_toggle" />
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onTranslatorToggle}
          variation={ButtonVariations.Control}
        >
          <Translator label={t('call.chat_label')} labelId="chat_toggle" />
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
