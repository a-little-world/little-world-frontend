import { Text } from '@a-little-world/little-world-design-system';
import {
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { LocalParticipant } from 'livekit-client';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  blockIncomingCall,
  getChatByPartnerId,
  getMatchByPartnerId,
} from '../../features/userData.js';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut.tsx';
import { MESSAGES_ROUTE, getAppRoute } from '../../routes.jsx';
import Drawer from '../atoms/Drawer.tsx';
import ProfileImage from '../atoms/ProfileImage.jsx';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar.tsx';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar.tsx';
import { Chat } from '../blocks/ChatCore/Chat.jsx';
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

export function VideoCall() {
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [selectedDrawerOption, setSelectedDrawerOption] = useState(null);
  const dispatch = useDispatch();

  useKeyboardShortcut({
    condition: isFullScreen,
    key: 'Escape',
    onKeyPressed: () => setIsFullScreen(false),
  });

  const {
    origin,
    userId,
    token,
    livekitServerUrl,
    audioOptions,
    videoOptions,
  } = useSelector(state => state.userData.activeCall);

  const profile = useSelector(state => state.userData.user.profile);
  const match = useSelector(state =>
    origin === getAppRoute(MESSAGES_ROUTE)
      ? getChatByPartnerId(state.userData.chats, userId)
      : getMatchByPartnerId(state.userData.matches, userId),
  );

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
                dispatch(
                  blockIncomingCall({
                    userId,
                  }),
                );
                navigate(getAppRoute(), { state: { callEnded: true } });
              }}
            >
              <MyVideoConference
                isFullScreen={isFullScreen}
                partnerName={match?.partner?.first_name}
                partnerImage={
                  match?.partner?.image_type === 'avatar'
                    ? match?.partner.avatar_config
                    : match?.partner?.image
                }
                partnerImageType={match?.partner?.image_type}
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
            <Chat chatId={match?.chatId || match?.uuid} />
          </Drawer>
          <Drawer
            title={'Questions'}
            open={selectedDrawerOption === 'questions'}
            onClose={() => setSelectedDrawerOption(null)}
          >
            <QuestionCards />
          </Drawer>
          <CallSidebar isDisplayed={showChat} />
        </CallLayout>
      </LayoutContextProvider>
    </SidebarSelectionProvider>
  );
}

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
          size={'flex'}
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
            size={'medium'}
          />
          <Text>{t('call.waiting_for_partner', { name: partnerName })}</Text>
        </WaitingTile>
      )}
    </Videos>
  );
}

export default VideoCall;
