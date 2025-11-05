/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  FullScreenExitIcon,
  FullScreenIcon,
  Gradients,
  MessageIcon,
  MessageWithQuestionIcon,
  TranslatorIcon,
} from '@a-little-world/little-world-design-system';
import {
  MediaDeviceMenu,
  TrackToggle,
  useDisconnectButton,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Timer from '../../atoms/Timer';
import UnreadDot from '../../atoms/UnreadDot';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles';

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
  overflow: visible;
  z-index: 10;

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
    return null;
  }}
`;

const TOGGLE_CSS = css`
  background: ${({ theme }) => theme.color.surface.contrast};
  color: ${({ theme }) => theme.color.text.control};
  border-color: ${({ theme }) => theme.color.border.contrast};
  border-radius: 50%;
  transition: filter 0.5s ease;

  &:hover {
    filter: brightness(80%);
    transition: filter 0.5s ease;
  }

  svg {
    overflow: visible;
  }
`;

const Toggle = styled(TrackToggle)`
  ${TOGGLE_CSS};
  height: 100%;
  padding: ${({ theme }) =>
    `0 ${theme.spacing.xxxsmall} 0 ${theme.spacing.small}`};
`;

const ToggleBtn = styled(Button)<{ $desktopOnly?: boolean }>`
  ${TOGGLE_CSS};

  ${({ $desktopOnly, theme }) => css`
    display: ${$desktopOnly ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}

  svg {
    height: 24px;
    width: 24px;
  }
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

const MediaControl = styled.div`
  background: #6d6d6d;
  color: ${({ theme }) => theme.color.text.control};
  border-color: #6d6d6d;
  border-radius: ${({ theme }) => theme.radius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  height: 44px;

  ${MEDIA_DEVICE_MENU_CSS};

  .lk-button-menu {
    padding: ${({ theme }) =>
      `0 ${theme.spacing.small} 0 ${theme.spacing.xxxsmall}`};

    &[aria-pressed='true'] {
      &::after {
        transform: rotate(135deg);
        margin-bottom: -2px;
      }
    }

    &::after {
      width: 6px;
      height: 6px;
      margin: 0;
      margin-bottom: 2px;
    }

    &::hover {
      background-color: none;
    }
  }
`;

interface SharedControlBarProps {
  activeOption?: string;
  onChatToggle: () => void;
  onTranslatorToggle: () => void;
}

interface ControlBarProps extends SharedControlBarProps {
  onFullScreenToggle: () => void;
  isFullScreen: boolean;
}

export const TopControlBar = ({
  activeOption,
  onChatToggle,
  onQuestionCardsToggle,
  onTranslatorToggle,
}: { onQuestionCardsToggle: () => void } & SharedControlBarProps) => {
  const { t } = useTranslation();
  return (
    <Bar $position="top">
      <ToggleBtn onClick={onChatToggle} variation={ButtonVariations.Circle}>
        <MessageIcon
          label={t('call.chat_label')}
          gradient={activeOption === 'chat' ? Gradients.Orange : undefined}
        />
      </ToggleBtn>
      <ToggleBtn
        onClick={onTranslatorToggle}
        variation={ButtonVariations.Circle}
      >
        <TranslatorIcon
          label={t('call.chat_label')}
          gradient={
            activeOption === 'translator' ? Gradients.Orange : undefined
          }
        />
      </ToggleBtn>
      <ToggleBtn
        onClick={onQuestionCardsToggle}
        variation={ButtonVariations.Circle}
      >
        <MessageWithQuestionIcon
          label="question cards"
          gradient={activeOption === 'questions' ? Gradients.Orange : undefined}
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
  const hasUnreadMessage = false;

  return (
    <Bar $position="bottom">
      <Section>
        <MediaControl>
          <Toggle source={Track.Source.Microphone} showIcon />
          <MediaDeviceMenu kind="audioinput" />
        </MediaControl>
        <MediaControl>
          <Toggle source={Track.Source.Camera} showIcon />
          <MediaDeviceMenu kind="videoinput" />
        </MediaControl>
        <ToggleBtn
          $desktopOnly
          onClick={onFullScreenToggle}
          variation={ButtonVariations.Circle}
        >
          {isFullScreen ? (
            <FullScreenExitIcon label="exit fullscreen" />
          ) : (
            <FullScreenIcon label="fullscreen video toggle" />
          )}
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onChatToggle}
          variation={ButtonVariations.Circle}
        >
          {hasUnreadMessage && <UnreadDot count={1} />}
          <MessageIcon label={t('call.chat_label')} />
        </ToggleBtn>
        <ToggleBtn
          $desktopOnly
          onClick={onTranslatorToggle}
          variation={ButtonVariations.Circle}
        >
          <TranslatorIcon label={t('call.chat_label')} />
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
