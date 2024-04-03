import { Button } from '@a-little-world/little-world-design-system';
import {
  Chat as ChatLiveKit,
  ChatToggle,
  ControlBarControls,
  GridLayout,
  LayoutContextProvider,
  ControlBar as LiveKitControlBar,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  VideoConference,
  VideoTrack,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { requestVideoAccessToken } from '../../api/livekit.js';
import { getAppRoute } from '../../routes';
import Drawer from '../atoms/Drawer.tsx';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar.tsx';
import TranslationTool from '../blocks/TranslationTool/TranslationTool.tsx';

const CallLayout = styled.div`
  --lk-border-radius: 0;
  --lk-control-active-bg: ${({ theme }) => theme.color.surface.contrast};
  --lk-control-active-hover-bg: ${({ theme }) => theme.color.surface.contrast};
  --lk-control-hover-bg: ${({ theme }) => theme.color.surface.contrast};
  display: flex;
  min-height: 100vh;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      --lk-border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.medium};
      gap: ${({ theme }) => theme.spacing.medium};
    }
  `}
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  transition: width ease 0.3s, height ease 0.3s;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      width: ${({ $showChat }) => ($showChat ? '75%' : '100%')};
      border: 2px solid ${({ theme }) => theme.color.border.subtle};
      border-radius: ${({ theme }) => theme.radius.medium};
      padding: ${({ theme }) => theme.spacing.small};
    }
  `}

  .lk-room-container {
    height: auto !important;
    flex: 1;
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

  ${({ $isFullScreen }) =>
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
      }
    `}
`;
export function LiveKitCall() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [selectedDrawerOption, setSelectedDrawerOption] = useState(null);

  const { userPk, tracks, token, livekitServerUrl } = location.state;

  console.log({ userPk, tracks, token, livekitServerUrl })

  const onChatToggle = () => {
    setShowChat(prevState => !prevState);
  };

  const onFullScreenToggle = () => {
    setIsFullScreen(prevState => !prevState);
  };

  const onTranslatorToggle = () => {
    setShowTranslator(prevState => !prevState);
  };

  const onMobileTranslatorToggle = () => {
    setSelectedDrawerOption('translator');
  };

  const onMobileChatToggle = () => {
    setSelectedDrawerOption('chat');
  };

  return (
    <SidebarSelectionProvider>
      <LayoutContextProvider>
        <CallLayout>
          <VideoContainer $is FullScreen={isFullScreen} $showChat={showChat}>
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={livekitServerUrl}
              // Use the default LiveKit theme for nice styles.
              // data-lk-theme="default"
              onDisconnected={() => {
                console.log('disconnected');
                //navigate(getAppRoute())
              }}
            >
              <MyVideoConference />
              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />
              {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
              {/* <LiveKitControlBar
                controls={{ chat: true, screenShare: false }}
              /> */}
              <TopControlBar
                onChatToggle={onMobileChatToggle}
                onTranslatorToggle={onMobileTranslatorToggle}
              />
              <ControlBar
                onChatToggle={onChatToggle}
                onFullScreenToggle={onFullScreenToggle}
                onTranslatorToggle={onTranslatorToggle}
              />
            </LiveKitRoom>
            {!showTranslator && <TranslationTool />}
          </VideoContainer>
          <Drawer
            title={'Translate'}
            open={selectedDrawerOption === 'translator'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <TranslationTool />
          </Drawer>
          <Drawer
            title={'Chat'}
            open={selectedDrawerOption === 'chat'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <CallSidebar />
          </Drawer>
          <CallSidebar />
        </CallLayout>
      </LayoutContextProvider>
    </SidebarSelectionProvider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  const [permission, setPermission] = useState(false);

  //   if (!permission)
  //     return <Button onClick={() => setPermission(true)}>Give Permission</Button>;

  console.log({ tracks });
  return (
    <GridLayout tracks={tracks}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile trackRef={tracks[0]} />
      {/* <VideoTrack trackRef={tracks[0]} /> */}
    </GridLayout>
  );
}

export default LiveKitCall;
