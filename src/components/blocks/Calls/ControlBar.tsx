/* eslint-disable jsx-a11y/media-has-caption */
import {
  Button,
  ButtonVariations,
  FullScreenExitIcon,
  FullScreenIcon,
  Gradients,
  MessageIcon,
  MessageWithQuestionIcon,
  ScreenShareIcon,
  Tooltip,
  TranslatorIcon,
  tokens,
} from '@a-little-world/little-world-design-system';
import {
  MediaDeviceMenu,
  TrackToggle,
  useDisconnectButton,
  useTrackToggle,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import Timer from '../../atoms/Timer';
import UnreadDot from '../../atoms/UnreadDot';
import { MEDIA_DEVICE_MENU_CSS } from '../../views/VideoCall.styles';

const TOGGLE_BACKGROUND = tokens.color.theme.light.surface.quaternary;
const TOGGLE_BACKGROUND_DENIED = '#ea4335';
const TOGGLE_BACKGROUND_DENIED_HOVER = '#cd3a2e';

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
  background: ${TOGGLE_BACKGROUND};
  color: ${tokens.color.theme.light.text.reversed};
  border-color: ${TOGGLE_BACKGROUND};
  border-radius: ${({ theme }) => theme.radius.half};
  transition: filter 0.5s ease;

  &:hover {
    svg {
      filter: brightness(70%);
      transition: filter 0.5s ease;
    }
  }

  svg {
    overflow: visible;
  }
`;

export function supportsScreenSharing(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia
  );
}

const Toggle = styled(TrackToggle)<{
  $circular?: boolean;
  $withBackground?: boolean;
  $permissionDenied?: boolean;
}>`
  ${TOGGLE_CSS};
  height: 100%;
  padding: ${({ theme, $circular }) =>
    $circular ? '0' : `0 ${theme.spacing.xxxsmall} 0 ${theme.spacing.small}`};

  ${({ $circular }) =>
    $circular &&
    css`
      width: 44px;
      height: 44px;
      align-items: center;
      justify-content: center;

      &:not(:disabled):hover {
        background-color: ${TOGGLE_BACKGROUND};
        transition: opacity 0.3s ease;
        opacity: 0.6;
      }
    `}

  ${({ $withBackground, $permissionDenied }) =>
    $withBackground &&
    css`
      background: ${$permissionDenied
        ? TOGGLE_BACKGROUND_DENIED
        : TOGGLE_BACKGROUND};
      border-color: ${$permissionDenied
        ? TOGGLE_BACKGROUND_DENIED
        : TOGGLE_BACKGROUND};
    `}
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
  align-items: center;
`;

const StyledTimer = styled(Timer)<{ $desktopOnly?: boolean }>`
  ${({ $desktopOnly, theme }) => css`
    display: ${$desktopOnly ? 'none' : 'flex'};
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}
`;

const MediaControl = styled.div<{ $permissionDenied?: boolean }>`
  --lk-control-active-bg: ${TOGGLE_BACKGROUND};
  --lk-control-active-hover-bg: ${TOGGLE_BACKGROUND};
  --lk-control-hover-bg: ${TOGGLE_BACKGROUND};
  background: ${TOGGLE_BACKGROUND};
  color: ${tokens.color.theme.light.text.reversed};
  border-color: ${TOGGLE_BACKGROUND};
  border-radius: ${({ theme }) => theme.radius.large};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  height: 44px;

  ${MEDIA_DEVICE_MENU_CSS};

  ${({ $permissionDenied }) =>
    $permissionDenied &&
    css`
      background: ${TOGGLE_BACKGROUND_DENIED};
      border-color: ${TOGGLE_BACKGROUND_DENIED};
      &:hover {
        background-color: ${TOGGLE_BACKGROUND_DENIED_HOVER};
        border-color: ${TOGGLE_BACKGROUND_DENIED_HOVER};
      }
    `}
`;

interface SharedControlBarProps {
  activeOption?: string;
  onChatToggle: () => void;
  onTranslatorToggle: () => void;
}

interface ControlBarProps extends SharedControlBarProps {
  hide: boolean;
  onFullScreenToggle: () => void;
  isFullScreen: boolean;
  onPermissionModalOpen: (permissions: {
    audio: boolean;
    video: boolean;
  }) => void;
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
  hide,
  isFullScreen,
  onChatToggle,
  onFullScreenToggle,
  onTranslatorToggle,
  onPermissionModalOpen,
}: ControlBarProps) {
  const { t } = useTranslation();
  const { buttonProps: disconnectProps } = useDisconnectButton({});
  const hasUnreadMessage = false;
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);

  const browserSupportsScreenSharing = supportsScreenSharing();

  const { permissionDenied: audioPermissionDenied } = useTrackToggle({
    source: Track.Source.Microphone,
  });
  const { permissionDenied: videoPermissionDenied } = useTrackToggle({
    source: Track.Source.Camera,
  });

  const handleOpenPermissionModal = () => {
    onPermissionModalOpen?.({
      audio: audioPermissionDenied,
      video: videoPermissionDenied,
    });
  };

  const onScreenShareChange = useCallback(
    (enabled: boolean) => {
      console.log('onScreenShareChange', enabled);
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );
  console.log('isScreenShareEnabled', browserSupportsScreenSharing);
  if (hide) return null;
  return (
    <Bar $position="bottom">
      <Section>
        <Tooltip
          text={t('call.microphone_toggle_tooltip')}
          trigger={
            <div>
              <MediaControl $permissionDenied={audioPermissionDenied}>
                <Toggle
                  onClick={
                    audioPermissionDenied
                      ? handleOpenPermissionModal
                      : undefined
                  }
                  source={Track.Source.Microphone}
                  showIcon
                  $withBackground
                  $permissionDenied={audioPermissionDenied}
                  permissionDenied={audioPermissionDenied}
                />
                <MediaDeviceMenu
                  kind="audioinput"
                  disabled={audioPermissionDenied}
                />
              </MediaControl>
            </div>
          }
        />

        <Tooltip
          text={t('call.camera_toggle_tooltip')}
          trigger={
            <MediaControl $permissionDenied={videoPermissionDenied}>
              <div>
                <Toggle
                  onClick={
                    videoPermissionDenied
                      ? handleOpenPermissionModal
                      : undefined
                  }
                  source={Track.Source.Camera}
                  showIcon
                  $withBackground
                  $permissionDenied={videoPermissionDenied}
                  permissionDenied={videoPermissionDenied}
                />
              </div>
              <MediaDeviceMenu
                kind="videoinput"
                disabled={videoPermissionDenied}
              />
            </MediaControl>
          }
        />

        {browserSupportsScreenSharing && (
          <Tooltip
            text={t(
              `call.screenshare_${
                isScreenShareEnabled ? 'stop' : 'start'
              }_tooltip`,
            )}
            trigger={
              <div>
                <Toggle
                  source={Track.Source.ScreenShare}
                  captureOptions={{
                    audio: true,
                    selfBrowserSurface: 'include',
                  }}
                  showIcon={false}
                  onChange={onScreenShareChange}
                  onDeviceError={
                    error => console.error(error)
                    // onDeviceError?.({ source: Track.Source.ScreenShare, error })
                  }
                  $circular
                  $withBackground
                >
                  <ScreenShareIcon label={t('call.screenshare_label')} />
                </Toggle>
              </div>
            }
          />
        )}

        <Tooltip
          text={t('call.fullscreen_toggle_tooltip')}
          trigger={
            <div>
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
            </div>
          }
        />
        <Tooltip
          text={t('call.message_toggle_tooltip')}
          trigger={
            <div>
              <ToggleBtn
                $desktopOnly
                onClick={onChatToggle}
                variation={ButtonVariations.Circle}
              >
                {hasUnreadMessage && <UnreadDot count={1} />}

                <MessageIcon label={t('call.chat_label')} />
              </ToggleBtn>
            </div>
          }
        />
        <Tooltip
          text={t('call.translation_toggle_tooltip')}
          trigger={
            <div>
              <ToggleBtn
                $desktopOnly
                onClick={onTranslatorToggle}
                variation={ButtonVariations.Circle}
              >
                <TranslatorIcon label={t('call.chat_label')} />
              </ToggleBtn>
            </div>
          }
        />
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
