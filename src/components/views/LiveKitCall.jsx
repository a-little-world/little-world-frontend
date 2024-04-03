import { Button } from '@a-little-world/little-world-design-system';
import {
  CarouselLayout,
  Chat as ChatLiveKit,
  ChatToggle,
  ControlBarControls,
  FocusLayout,
  FocusLayoutContainer,
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
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { getMatchByPartnerId } from '../../features/userData.js';
import { getAppRoute } from '../../routes';
import Drawer from '../atoms/Drawer.tsx';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar.tsx';
import { Chat } from '../blocks/ChatCore/Chat.jsx';
import QuestionCards from '../blocks/QuestionCards.jsx';
import TranslationTool from '../blocks/TranslationTool/TranslationTool.tsx';

const serverUrl = 'wss://little-world-6fxox5nm.livekit.cloud';
const api_key = 'APIo7MLm3fJDRX5';
const secret_key = 'PT7WGIlSzg2fpiS4pDXQA4j7a1VKWbjriJMcTLfme4JB';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjUzNzA2OTM4MDgsImlzcyI6IkFQSW83TUxtM2ZKRFJYNSIsIm5iZiI6MTcxMTAyNjUyOSwic3ViIjoiVGltIiwidmlkZW8iOnsiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwicm9vbSI6InppbW1lciIsInJvb21Kb2luIjp0cnVlfX0.lS-VycsQDW2wLyLv0aI3gPXt-1g4wtUspIwAyPBQRkQ';

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
  width: 100%;

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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [selectedDrawerOption, setSelectedDrawerOption] = useState(null);
  const [connected, setConnected] = useState(false);
  const location = useLocation();
  const { userPk } = location.state || {};
  const match = useSelector(state =>
    getMatchByPartnerId(state.userData.matches, userPk),
  );

  console.log({ userPk, match });

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

  const onMobileQuestionsToggle = () => {
    setSelectedDrawerOption('questions');
  };
  console.log({ selectedDrawerOption, connected });

  return (
    <SidebarSelectionProvider>
      <LayoutContextProvider>
        <CallLayout>
          <VideoContainer $isFullScreen={isFullScreen} $showChat={showChat}>
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={serverUrl}
              onConnected={() => setConnected(true)}
              onDisconnected={() => navigate(getAppRoute())}
              // simulateParticipants={2}
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
                activeOption={selectedDrawerOption}
                onChatToggle={onMobileChatToggle}
                onTranslatorToggle={onMobileTranslatorToggle}
                onQuestionCardsToggle={onMobileQuestionsToggle}
              />
              <ControlBar
                isFullScreen={isFullScreen}
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
            <Chat chatId={match?.chatId} />
          </Drawer>
          <Drawer
            title={'Questions'}
            open={selectedDrawerOption === 'questions'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <QuestionCards />
          </Drawer>
          {showChat && <CallSidebar />}
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

  console.log({ tracks });

  if (isEmpty(tracks)) return null;

  return (
    <FocusLayoutContainer>
      <FocusLayout trackRef={tracks[0]}>
        <ParticipantTile />
      </FocusLayout>
      <CarouselLayout tracks={[...tracks, ...tracks]}>
        <ParticipantTile />
      </CarouselLayout>
    </FocusLayoutContainer>
  );
}

export default LiveKitCall;
