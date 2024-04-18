import { Button, Text } from '@a-little-world/little-world-design-system';
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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { getMatchByPartnerId } from '../../features/userData.js';
import { requestVideoAccessToken } from '../../api/livekit.js';
import { getAppRoute } from '../../routes';
import Drawer from '../atoms/Drawer.tsx';
import ProfileImage from '../atoms/ProfileImage.jsx';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar.tsx';
import { Chat } from '../blocks/ChatCore/Chat.jsx';
import QuestionCards from '../blocks/QuestionCards.jsx';
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
  width: 100%;

  ${({ theme, $showChat }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      width: ${$showChat ? '75%' : '100%'};
      border: 2px solid ${theme.color.border.subtle};
      border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.small};
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

  .lk-focus-toggle-button {
    display: none;
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

      [data-lk-local-participant='true'][data-lk-facing-mode='user'] {
        @media (min-width: ${theme.breakpoints.large}) {
          border-radius: 0;
        }
      }
    `}
`;

const StyledGridLayout = styled(GridLayout)`
  --lk-row-count: 1 !important;
  [data-lk-local-participant='true'][data-lk-facing-mode='user'] {
    position: absolute !important;
    top: 72px;
    right: 16px;
    width: 30%;
    z-index: 1;
    border-radius: 16px;

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.large}) {
        top: ${theme.spacing.small};
        width: 20%;
      }
    `}
  }
`;

const WaitingTile = styled.div`
  color: ${({ theme }) => theme.color.text.reversed};
  background: ${({ theme }) => '#323232' || theme.color.surface.contrast};
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

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      border-radius: ${theme.radius.small};
    }
  `}
`;

const Videos = styled.div`
  height: 100%;
  width: 100%;
`;

const DesktopTranslationTool = styled(TranslationTool)`
  display: none;
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: flex;
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
  const [connected, setConnected] = useState(false);
  const location = useLocation();
  const { userPk } = location.state || {};
  const match = useSelector(state =>
    getMatchByPartnerId(state.userData.matches, userPk),
  );

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

  const onMobileQuestionsToggle = () => {
    setSelectedDrawerOption('questions');
  };
  console.log({ selectedDrawerOption, connected });

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
              onConnected={() => setConnected(true)}
              onDisconnected={() => navigate(getAppRoute())}
            >
              <MyVideoConference
                partnerName={match?.partner?.first_name}
                partnerImage={match?.partner?.image}
                partnerImageType={match?.partner?.imageType}
              />
              {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
              <RoomAudioRenderer />
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
            {!showTranslator && <DesktopTranslationTool />}
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
          <CallSidebar />
        </CallLayout>
      </LayoutContextProvider>
    </SidebarSelectionProvider>
  );
}

function MyVideoConference({ partnerImage, partnerImageType, partnerName }) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      //{ source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true },
  );
  const { t } = useTranslation();

  console.log({ tracks });

  if (isEmpty(tracks)) return null;

  return (
    <Videos>
      <StyledGridLayout tracks={tracks}>
        <ParticipantTile />
      </StyledGridLayout>

      <WaitingTile>
        <ProfileImage
          circle
          image={partnerImage}
          imageType={partnerImageType}
          size={'medium'}
        />
        <Text>{t('call.waiting_for_partner', { name: partnerName })}</Text>
      </WaitingTile>
    </Videos>

    // <FocusLayoutContainer>
    //   <FocusLayout trackRef={tracks[0]}>
    //     <ParticipantTile />
    //   </FocusLayout>
    //   <CarouselLayout tracks={[...tracks, ...tracks]}>
    //     <ParticipantTile />
    //   </CarouselLayout>
    // </FocusLayoutContainer>
  );
}

export default LiveKitCall;
