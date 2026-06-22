import { GridLayout } from '@livekit/components-react';
import styled, { css, type DefaultTheme } from 'styled-components';

import ProfileImage from '../atoms/ProfileImage';
import TranslationTool from '../blocks/TranslationTool/TranslationTool';

const pipCameraTileAppearance = (theme: DefaultTheme) => css`
  border-radius: ${theme.radius.small};
  aspect-ratio: 9 / 16;
  overflow: hidden;

  @media (min-width: ${theme.breakpoints.small}) {
    aspect-ratio: 16 / 9;
  }

  .lk-participant-metadata {
    justify-content: flex-end;
    top: unset;
    left: unset;
    right: 0;
    bottom: 0;
  }

  .lk-participant-metadata-item:first-child {
    display: none;
  }

  video {
    object-fit: cover !important;
  }
`;

const participantPlaceholderAppearance = (theme: DefaultTheme) => css`
  .lk-participant-placeholder {
    padding: ${theme.spacing.xxsmall};
    background: ${theme.color.surface.contrast};
    border-radius: 0;

    svg {
      padding: 0;
    }
  }
`;

const participantMutedCameraTileAppearance = (theme: DefaultTheme) => css`
  .lk-participant-tile[data-lk-video-muted='true'] {
    background: ${theme.color.text.secondary};

    svg {
      max-height: 320px;
    }
  }
`;

const participantMutedCameraPlaceholderAppearance = (
  theme: DefaultTheme,
) => css`
  .lk-participant-tile[data-lk-video-muted='true'][data-lk-source='camera']
    .lk-participant-placeholder {
    opacity: 1;
    background: ${theme.color.text.secondary};
  }
`;

/**
 * react-nice-avatar stacks SVG layers with percentage-based absolute positioning;
 * they only align when the root avatar box is a predictable square. VideoPlaceholder
 * (size="flex") flips width/height by breakpoint, which resolves badly inside the
 * small 9:16 / 16:9 PiP tiles — size from the placeholder's definite height instead.
 */
const pipParticipantPlaceholderAvatarSizing = css`
  .lk-participant-placeholder > * {
    width: auto;
    height: 100%;
    max-width: 100%;
    aspect-ratio: 1;
  }
`;

const pipCameraCornerPosition = (theme: DefaultTheme) => css`
  position: absolute !important;
  right: ${theme.spacing.small};
  width: clamp(88px, 24vw, 112px);
  bottom: 80px;
  z-index: 2;

  @media (min-width: ${theme.breakpoints.small}) {
    width: clamp(120px, 20vw, 180px);
    top: 72px;
    bottom: auto;
  }

  @media (min-width: ${theme.breakpoints.large}) {
    width: clamp(160px, 14vw, 240px);
    top: ${theme.spacing.small};
  }
`;

export const CameraPipOverlay = styled.div`
  ${({ theme }) => pipCameraCornerPosition(theme)}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  pointer-events: none;

  .lk-participant-tile {
    position: relative;
    pointer-events: auto;
    ${({ theme }) => pipCameraTileAppearance(theme)}
  }

  ${({ theme }) => participantPlaceholderAppearance(theme)}
  ${({ theme }) => participantMutedCameraTileAppearance(theme)}
  ${({ theme }) => participantMutedCameraPlaceholderAppearance(theme)}
  ${pipParticipantPlaceholderAvatarSizing}
`;

export const CallLayout = styled.div`
  --lk-border-radius: 0;
  --lk-control-active-bg: ${({ theme }) => theme.color.surface.contrast};
  --lk-control-active-hover-bg: ${({ theme }) => theme.color.surface.contrast};
  --lk-control-hover-bg: ${({ theme }) => theme.color.surface.contrast};
  display: flex;
  height: 100vh;
  height: 100dvh;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      --lk-border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.medium};
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const VideoContainer = styled.div<{
  $showChat: boolean;
  $isFullScreen: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  transition: width ease 0.3s, height ease 0.3s;
  width: 100%;

  ${({ theme, $showChat }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      width: ${$showChat ? '66.666%' : '100%'};
      border: 2px solid ${theme.color.border.subtle};
      border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.small};
      box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
    }
  `}

  .lk-room-container {
    height: auto !important;
    flex: 1;
    min-height: 0;
    transition: height ease 0.3s;
  }

  .lk-control-bar {
    position: absolute;
    bottom: 0;
    transform: translateX(50%);
    right: 50%;
  }

  .lk-participant-metadata-item {
    color: ${({ theme }) => theme.color.text.primary};
    background: ${({ theme }) => theme.color.surface.secondary};
    opacity: 90%;
  }

  .lk-focus-toggle-button {
    display: none;
  }

  ${({ $isFullScreen, theme }) =>
    $isFullScreen &&
    css`
      --lk-border-radius: 0;
      .lk-room-container {
        height: 100vh !important;
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        background: ${theme.color.text.secondary};
      }

      [data-lk-local-participant='true'][data-lk-facing-mode='user'] {
        @media (min-width: ${theme.breakpoints.large}) {
          border-radius: 0;
        }
      }
    `}
`;

export const Videos = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0;
`;

export const StyledGridLayout = styled(GridLayout)<{
  $screenShareActive?: boolean;
}>`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 0;

  ${({ $screenShareActive }) =>
    !$screenShareActive &&
    css`
      --lk-row-count: 1 !important;
      --lk-col-count: 1 !important;
    `}

  ${({ $screenShareActive, theme }) =>
    !$screenShareActive &&
    css`
      .lk-participant-tile[data-lk-local-participant='true'][data-lk-source='camera'] {
        ${pipCameraCornerPosition(theme)}
        ${pipCameraTileAppearance(theme)}
        max-height: 50%;
      }
    `}

  ${({ theme }) => participantPlaceholderAppearance(theme)}
  ${({ theme }) => participantMutedCameraTileAppearance(theme)}
  ${({ theme }) => participantMutedCameraPlaceholderAppearance(theme)}

  .lk-participant-metadata-item {
    background: transparent;
    color: white;
    opacity: 1;
  }

  .lk-participant-tile[data-lk-video-muted='true']
    .lk-participant-metadata-item {
    color: ${({ theme }) => theme.color.text.tertiary};
  }

  ${({ $screenShareActive, theme }) =>
    !$screenShareActive &&
    css`
      .lk-participant-tile[data-lk-local-participant='false'][data-lk-source='camera']
        .lk-participant-metadata {
        justify-content: flex-start;
        top: 80px;
        left: ${theme.spacing.small};
        right: 0;
        bottom: unset;

        @media (min-width: ${theme.breakpoints.large}) {
          top: ${theme.spacing.small};
        }
      }
    `}

  video {
    object-fit: contain !important;
  }
`;

export const WaitingTile = styled.div<{ $isFullScreen: boolean }>`
  color: white;
  background: black;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.xxlarge} ${theme.spacing.xlarge}`};

  ${({ theme, $isFullScreen }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      border-radius: ${$isFullScreen ? 0 : theme.radius.small};
      padding: ${theme.spacing.xxlarge} ${theme.spacing.xlarge};
    }

    @media (min-width: ${theme.breakpoints.xlarge}) {
      border-radius: ${$isFullScreen ? 0 : theme.radius.small};
      padding: ${$isFullScreen ? theme.spacing.massive : theme.spacing.xxlarge}
        ${theme.spacing.xlarge};
    }
  `}
`;

export const DesktopTranslationTool = styled(TranslationTool)`
  display: none;
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
    }
  `}
`;

export const MEDIA_DEVICE_MENU_CSS = css`
  .lk-button-group-container .lk-button {
    border-radius: ${({ theme }) => theme.radius.xxsmall};

    &:hover {
      filter: brightness(90%);
      transition: filter 0.5s ease;
    }

    &:not(.lk-permission-denied):hover {
      background: ${({ theme }) => theme.color.surface.primary};
    }
  }

  .lk-button-menu {
    height: auto;
    border-radius: ${({ theme }) => theme.radius.large};

    &[aria-pressed='true'] {
      &::after {
        transform: rotate(135deg);
        margin-bottom: -2px;
      }
    }

    &:hover {
      background-color: none;

      &::after {
        filter: brightness(70%);
        transition: filter 0.5s ease;
      }
    }
  }

  .lk-button-group-container .lk-button-menu {
    &::after {
      width: 6px;
      height: 6px;
      margin: 0;
      margin-bottom: 2px;
    }
  }

  .lk-device-menu {
    background-color: ${({ theme }) => theme.color.surface.primary};
    border-color: ${({ theme }) => theme.color.border.subtle};
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

    > ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      > li {
        border-radius: ${({ theme }) => theme.radius.xsmall};
        color: ${({ theme }) => theme.color.text.primary};
      }
    }

    li[data-lk-active='true'] {
      background: ${({ theme }) => theme.color.surface.bold};
      color: ${({ theme }) => theme.color.text.reversed};

      .lk-button:not(:disabled):hover {
        background-color: unset;
      }
    }

    .lk-device-menu li[data-lk-active='false']:hover {
      background: ${({ theme }) => theme.color.surface.secondary};
    }
  }
`;

export const VideoPlaceholder = styled(ProfileImage)`
  height: auto;
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      width: auto;
      height: 100%;
    }
  `}
`;

export const CallRejectedTextContainer = styled.div``;
