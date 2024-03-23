import { Button } from '@a-little-world/little-world-design-system';
import {
  Chat as ChatLiveKit,
  ChatToggle,
  ControlBar,
  ControlBarControls,
  GridLayout,
  LayoutContextProvider,
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
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { getAppRoute } from '../../routes';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import TranslationTool from '../blocks/TranslationTool/TranslationTool.tsx';

const serverUrl = 'wss://little-world-6fxox5nm.livekit.cloud';
const api_key = 'APIo7MLm3fJDRX5';
const secret_key = 'PT7WGIlSzg2fpiS4pDXQA4j7a1VKWbjriJMcTLfme4JB';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUzNzA2OTM4MDgsImlzcyI6IkFQSW83TUxtM2ZKRFJYNSIsIm5iZiI6MTcxMTAyNjUyOSwic3ViIjoiVGltIiwidmlkZW8iOnsiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwicm9vbSI6InppbW1lciIsInJvb21Kb2luIjp0cnVlfX0.lS-VycsQDW2wLyLv0aI3gPXt-1g4wtUspIwAyPBQRkQ';

const CallLayout = styled.div`
  --lk-border-radius: ${({ theme }) => theme.radius.medium};
  :root {
    --lk-border-radius: ${({ theme }) => theme.radius.medium};
  }
  display: flex;
  padding: ${({ theme }) => theme.spacing.medium};
  gap: ${({ theme }) => theme.spacing.medium};
  min-height: 100vh;
`;

const VideoContainer = styled.div`
  width: 75%;
  border: 2px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: ${({ theme }) => theme.spacing.small};

  .lk-room-container {
    height: auto !important;
  }

  .lk-grid-layout {
    border-radius: ${({ theme }) => theme.radius.small};
  }
`;

export function LiveKitCall() {
  const navigate = useNavigate();
  const toggleChat = () => {
    console.log('TOGGGELLLLLLING');
  };
  return (
    <SidebarSelectionProvider>
      <LayoutContextProvider>
        <CallLayout>
          <VideoContainer>
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={serverUrl}
              // Use the default LiveKit theme for nice styles.
              // data-lk-theme="default"
              onDisconnected={() => navigate(getAppRoute())}
            >
              {/* <ChatToggle onClick={toggleChat} />
        <Chat /> */}
              {/* Your custom component with basic video conferencing functionality. */}
              <MyVideoConference />
              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />
              {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
              <ControlBar controls={{ chat: true, screenShare: false }} />
            </LiveKitRoom>
            <TranslationTool />
          </VideoContainer>

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
