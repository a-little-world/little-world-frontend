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
import styled from 'styled-components';

import { Chat } from '../blocks/ChatCore/Chat';

const serverUrl = 'wss://little-world-6fxox5nm.livekit.cloud';
const api_key = 'APIo7MLm3fJDRX5';
const secret_key = 'PT7WGIlSzg2fpiS4pDXQA4j7a1VKWbjriJMcTLfme4JB';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjU3ODMzNzA4ODEsImlzcyI6IkFQSW83TUxtM2ZKRFJYNSIsIm5iZiI6MTcxMDQ5ODA2Miwic3ViIjoic2VhbiIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJ6aW1tZXIiLCJyb29tSm9pbiI6dHJ1ZX19.oZfNDDSy_f6lptgVccRgZZA_9zvEurip6gkoBRD1mHA';

const CallLayout = styled.div`
  display: flex;
`;

export function LiveKitCall() {
  const toggleChat = () => {
    console.log('TOGGGELLLLLLING');
  };
  return (
    <LayoutContextProvider>
      <CallLayout>
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          // Use the default LiveKit theme for nice styles.
          data-lk-theme="default"
          style={{ height: '100vh' }}
        >
          {/* <ChatToggle onClick={toggleChat} />
        <Chat /> */}
          {/* Your custom component with basic video conferencing functionality. */}
          <MyVideoConference />
          {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
          <RoomAudioRenderer />
          {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
          <ControlBar controls={{ chat: true }} />
        </LiveKitRoom>
        <Chat chatId="f56c4595-2619-4143-983a-3c1c733f47ca" />
      </CallLayout>
    </LayoutContextProvider>
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
    <GridLayout
      tracks={tracks}
      style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile trackRef={tracks[0]} />
      {/* <VideoTrack trackRef={tracks[0]} /> */}
    </GridLayout>
  );
}

export default LiveKitCall;
