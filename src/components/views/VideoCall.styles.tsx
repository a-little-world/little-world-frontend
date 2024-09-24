import { GridLayout } from '@livekit/components-react';
import styled, { css } from 'styled-components';

import ProfileImage from '../atoms/ProfileImage.jsx';
import TranslationTool from '../blocks/TranslationTool/TranslationTool.tsx';

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
      width: ${$showChat ? '75%' : '100%'};
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

export const StyledGridLayout = styled(GridLayout)`
  --lk-row-count: 1 !important;
  --lk-col-count: 1 !important;

  .lk-participant-tile[data-lk-local-participant='true'] {
    position: absolute !important;
    top: 72px;
    right: ${({ theme }) => theme.spacing.small};
    width: 30%;
    max-height: 50%;
    z-index: 1;
    border-radius: 16px;
    aspect-ratio: 9 / 16;

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.small}) {
        aspect-ratio: 16 / 9;
        width: 25%;
      }

      @media (min-width: ${theme.breakpoints.large}) {
        top: ${theme.spacing.small};
        width: 20%;
      }
    `}

    .lk-participant-metadata-item:first-child {
      display: none;
    }

    .lk-participant-metadata {
      justify-content: flex-end;
    }
  }

  .lk-participant-placeholder {
    padding: ${({ theme }) => theme.spacing.xxsmall};
    background: ${({ theme }) => theme.color.surface.contrast};
    border-radius: 0;

    svg {
      padding: 0;
    }
  }

  .lk-participant-tile[data-lk-video-muted='true'] {
    background: ${({ theme }) => theme.color.text.secondary};
    svg {
      max-height: 320px;
    }
  }

  .lk-participant-metadata-item {
    background: transparent;
    color: ${({ theme }) => theme.color.text.reversed};
    opacity: 1;
  }

  .lk-participant-tile[data-lk-video-muted='true']
    .lk-participant-metadata-item {
    color: ${({ theme }) => theme.color.text.tertiary};
  }

  .lk-participant-tile[data-lk-local-participant='false']
    .lk-participant-metadata {
    justify-content: flex-start;
    top: 80px;
    left: ${({ theme }) => theme.spacing.small};
    right: 0;
    bottom: unset;

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.large}) {
        top: ${theme.spacing.small};
      }
    `}

    .lk-participant-placeholder {
      background: ${({ theme }) => theme.color.text.secondary};
    }
  }

  video {
    object-fit: contain !important;
  }
`;

export const WaitingTile = styled.div<{ $isFullScreen: boolean }>`
  color: ${({ theme }) => theme.color.text.reversed};
  background: ${({ theme }) => theme.color.text.secondary};
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

  ${({ theme, $isFullScreen }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      border-radius: ${$isFullScreen ? 0 : theme.radius.small};
    }
  `}
`;

export const Videos = styled.div`
  height: 100%;
  width: 100%;
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
