import { Text } from '@a-little-world/little-world-design-system';
import {
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { LocalParticipant, Track } from 'livekit-client';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useSWR from 'swr';
import { useActiveCallStore } from '../../features/stores/index.ts';
import { CHATS_ENDPOINT, USER_ENDPOINT, fetcher } from '../../features/swr/index.ts';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut.tsx';
import { getAppRoute } from '../../router/routes.ts';
import Drawer from '../atoms/Drawer.tsx';
import ProfileImage from '../atoms/ProfileImage';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar.tsx';
import Chat from '../blocks/ChatCore/Chat.tsx';
import QuestionCards from '../blocks/QuestionCards/QuestionCards.tsx';
import TranslationTool from '../blocks/TranslationTool/TranslationTool.tsx';
import {
  CallLayout,
  DesktopTranslationTool,
  StyledGridLayout,
  VideoContainer,
  VideoPlaceholder,
  Videos,
  WaitingTile,
} from './VideoCall.styles.tsx';

function MyVideoConference({
  isFullScreen,
  partnerImage,
  partnerImageType,
  partnerName,
  selfImage,
  selfImageType,
}) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: true },
  );
  const [currentParticipants, setCurrentParticipants] = useState(1);
  const [otherUserDisconnected, setOtherUserDisconnected] = useState(false);

  useEffect(() => {
    if (tracks.length === 1 && currentParticipants > 1)
      setOtherUserDisconnected(true);
    setCurrentParticipants(tracks.length);
  }, [tracks.length]);

  const { t } = useTranslation();
  const placeholders = {};
  tracks.forEach(track => {
    if (track.participant) {
      const isLocal = track?.participant instanceof LocalParticipant;

      placeholders[track.participant.identity] = (
        <VideoPlaceholder
          circle
          image={isLocal ? selfImage : partnerImage}
          imageType={isLocal ? selfImageType : partnerImageType}
          size="flex"
        />
      );
    }
  });

  if (isEmpty(tracks)) return null;

  return (
    <Videos>
      <StyledGridLayout tracks={tracks}>
        <ParticipantTile placeholders={placeholders} />
      </StyledGridLayout>

      {tracks.length === 1 && (
        <WaitingTile $isFullScreen={isFullScreen}>
          <ProfileImage
            circle
            image={partnerImage}
            imageType={partnerImageType}
            size="medium"
          />
          <Text>
            {t(
              otherUserDisconnected
                ? 'call.partner_disconnected'
                : 'call.waiting_for_partner',
              { name: partnerName },
            )}
          </Text>
        </WaitingTile>
      )}
    </Videos>
  );
}

function VideoCall() {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [selectedDrawerOption, setSelectedDrawerOption] = useState(null);

  useKeyboardShortcut({
    condition: isFullScreen,
    key: 'Escape',
    onKeyPressed: () => setIsFullScreen(false),
  });

  const { userId, token, livekitServerUrl, audioOptions, videoOptions, stopActiveCall } = useActiveCallStore()
  const { data: user } = useSWR(USER_ENDPOINT, fetcher)
  const profile = user?.profile

  const { data: chats } = useSWR(CHATS_ENDPOINT, fetcher)
  console.log('TBS userId', userId)
  const chatData = chats?.results?.find(chat => chat?.partner?.id === userId)

  const onChatToggle = () => {
    if (isFullScreen) {
      setShowChat(true);
      setIsFullScreen(false);
    } else {
      setShowChat(prevState => !prevState);
    }
  };

  const onFullScreenToggle = () => {
    setIsFullScreen(prevState => !prevState);
  };

  const onTranslatorToggle = () => {
    if (isFullScreen) {
      setShowTranslator(true);
      setIsFullScreen(false);
    } else {
      setShowTranslator(prevState => !prevState);
    }
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

  return (
    <SidebarSelectionProvider>
      <LayoutContextProvider>
        <CallLayout>
          <VideoContainer $isFullScreen={isFullScreen} $showChat={showChat}>
            <LiveKitRoom
              video={videoOptions}
              audio={audioOptions}
              token={token}
              serverUrl={livekitServerUrl}
              onDisconnected={() => {
                stopActiveCall();
                navigate(getAppRoute(), { state: { callEnded: true } });
              }}
            >
              <MyVideoConference
                isFullScreen={isFullScreen}
                partnerName={chatData?.partner?.first_name}
                partnerImage={
                  chatData?.partner?.image_type === 'avatar'
                    ? chatData?.partner.avatar_config
                    : chatData?.partner?.image
                }
                partnerImageType={chatData?.partner?.image_type}
                selfImage={
                  profile.image_type === 'avatar'
                    ? profile.avatar_config
                    : profile?.image
                }
                selfImageType={profile.image_type}
              />
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
            {showTranslator && <DesktopTranslationTool />}
          </VideoContainer>
          <Drawer
            title="Translate"
            open={selectedDrawerOption === 'translator'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <TranslationTool />
          </Drawer>
          <Drawer
            title="Chat"
            open={selectedDrawerOption === 'chat'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <Chat chatId={chatData?.uuid} />
          </Drawer>
          <Drawer
            title="Questions"
            open={selectedDrawerOption === 'questions'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <QuestionCards />
          </Drawer>
          <CallSidebar isDisplayed={showChat} chatId={chatData?.uuid} />
        </CallLayout>
      </LayoutContextProvider>
    </SidebarSelectionProvider>
  );
}

export default VideoCall;
