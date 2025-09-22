import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  StatusMessage,
  StatusTypes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import {
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useDisconnectButton,
  useRoomInfo,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { LocalParticipant, Track } from 'livekit-client';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { callAgain } from '../../api/livekit.ts';
import { useConnectedCallStore } from '../../features/stores/index.ts';
import { USER_ENDPOINT, getChatEndpoint } from '../../features/swr/index.ts';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut.tsx';
import { getAppRoute, getCallSetupRoute } from '../../router/routes.ts';
import ButtonsContainer from '../atoms/ButtonsContainer.tsx';
import Drawer from '../atoms/Drawer.tsx';
import ProfileImage from '../atoms/ProfileImage';
import CallSidebar, {
  SidebarSelectionProvider,
} from '../blocks/Calls/CallSidebar';
import ControlBar, { TopControlBar } from '../blocks/Calls/ControlBar';
import Chat from '../blocks/ChatCore/Chat';
import QuestionCards from '../blocks/QuestionCards/QuestionCards';
import TranslationTool from '../blocks/TranslationTool/TranslationTool';
import {
  CallLayout,
  CallRejectedTextContainer,
  DesktopTranslationTool,
  StyledGridLayout,
  VideoContainer,
  VideoPlaceholder,
  Videos,
  WaitingTile,
} from './VideoCall.styles';

function MyVideoConference({
  isFullScreen,
  partnerId,
  partnerImage,
  partnerImageType,
  partnerName,
  selfImage,
  selfImageType,
  sessionId,
  initializeCallID,
  setCallRejected,
  callRejected,
}) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: true },
  );
  const [currentParticipants, setCurrentParticipants] = useState(1);
  const [otherUserDisconnected, setOtherUserDisconnected] = useState(false);
  const [callAgainError, setCallAgainError] = useState('');
  const { name } = useRoomInfo();
  const { buttonProps: disconnectProps } = useDisconnectButton({});
  const theme = useTheme();

  useEffect(() => {
    if (name) initializeCallID(name);
  }, [name, initializeCallID]);

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

  const handleCallAgain = () => {
    setCallAgainError('');
    callAgain({
      partnerId,
      sessionId,
      onSuccess: () => {
        setCallRejected(false);
      },
      onError: error => {
        console.error('Call again error:', error);
        setCallAgainError('error.server_issue');
      },
    });
  };

  if (isEmpty(tracks)) return null;

  return (
    <Videos>
      {!callRejected && (
        <StyledGridLayout tracks={tracks}>
          <ParticipantTile placeholders={placeholders} />
        </StyledGridLayout>
      )}

      {tracks.length === 1 && (
        <WaitingTile $isFullScreen={isFullScreen}>
          <ProfileImage
            circle
            image={partnerImage}
            imageType={partnerImageType}
            size="medium"
          />
          {callRejected ? (
            <>
              <CallRejectedTextContainer>
                <Text type={TextTypes.Body4} bold center>
                  {partnerName || ''}
                </Text>
                <Text type={TextTypes.Body4} center>
                  {t('call.partner_rejected')}
                </Text>
              </CallRejectedTextContainer>
              {callAgainError && (
                <StatusMessage visible type={StatusTypes.Error}>
                  {t(callAgainError)}
                </StatusMessage>
              )}
              <ButtonsContainer $maxWidth="440px" $marginTop="auto">
                <Button
                  appearance={ButtonAppearance.Secondary}
                  color={theme.color.text.reversed}
                  size={ButtonSizes.Small}
                  {...disconnectProps}
                >
                  {t('call.exit')}
                </Button>
                <Button onClick={handleCallAgain} size={ButtonSizes.Small}>
                  {t('call.call_again')}
                </Button>
              </ButtonsContainer>
            </>
          ) : (
            <Text type={TextTypes.Body4}>
              {t(
                otherUserDisconnected
                  ? 'call.partner_disconnected'
                  : 'call.waiting_for_partner',
                { name: partnerName },
              )}
            </Text>
          )}
        </WaitingTile>
      )}
    </Videos>
  );
}

function VideoCall() {
  const navigate = useNavigate();
  const { userId: urlUserId } = useParams();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showTranslator, setShowTranslator] = useState(true);
  const [selectedDrawerOption, setSelectedDrawerOption] = useState(null);

  useKeyboardShortcut({
    condition: isFullScreen,
    key: 'Escape',
    onKeyPressed: () => setIsFullScreen(false),
  });

  const {
    callData,
    disconnectFromCall,
    initializeCallID,
    setCallRejected,
    callRejected,
  } = useConnectedCallStore();
  const { uuid, token, livekitServerUrl, audioOptions, videoOptions, chatId } =
    callData || {};
  const { data: user } = useSWR(USER_ENDPOINT);
  const profile = user?.profile;

  const { data: chatData } = useSWR(getChatEndpoint(chatId));

  useEffect(() => {
    if (urlUserId && !token) {
      // If userId is in url but no token available, redirect to call-setup so we can re-join the call
      navigate(getCallSetupRoute(urlUserId));
    }
  }, [urlUserId, token, navigate]);

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
                disconnectFromCall(uuid);
                navigate(getAppRoute());
              }}
            >
              <MyVideoConference
                isFullScreen={isFullScreen}
                sessionId={uuid}
                partnerId={chatData?.partner?.id}
                partnerName={chatData?.partner?.first_name}
                partnerImage={
                  chatData?.partner?.image_type === 'avatar' ?
                    chatData?.partner.avatar_config :
                    chatData?.partner?.image
                }
                partnerImageType={chatData?.partner?.image_type}
                selfImage={
                  profile.image_type === 'avatar' ?
                    profile.avatar_config :
                    profile?.image
                }
                selfImageType={profile.image_type}
                initializeCallID={initializeCallID}
                setCallRejected={setCallRejected}
                callRejected={callRejected}
              />
              <RoomAudioRenderer />
              {!callRejected && (
                <>
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
                </>
              )}
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
            <Chat chatId={chatData?.uuid} inCall />
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
