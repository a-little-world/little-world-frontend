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
  PermissionsModal,
  RoomAudioRenderer,
  useDisconnectButton,
  useRoomInfo,
  useTracks,
} from '@livekit/components-react';
import type { PrejoinLanguage } from '@livekit/components-react/dist/prefabs/prejoinTranslations';
import '@livekit/components-styles';
import { LocalParticipant, Track } from 'livekit-client';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { callAgain } from '../../api/livekit';
import {
  useChatInputStore,
  useConnectedCallStore,
} from '../../features/stores';
import { USER_ENDPOINT, getChatEndpoint } from '../../features/swr';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import { getAppRoute, getCallSetupRoute } from '../../router/routes';
import ButtonsContainer from '../atoms/ButtonsContainer';
import Drawer from '../atoms/Drawer';
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

interface MyVideoConferenceProps {
  isFullScreen: boolean;
  partnerId?: string | number;
  partnerImage?: any;
  partnerImageType?: string;
  partnerName?: string;
  selfImage?: any;
  selfImageType?: string;
  sessionId?: string;
  initializeCallID: (uuid: string) => void;
  setCallRejected: (rejected: boolean) => void;
  callRejected: boolean;
}

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
}: MyVideoConferenceProps) {
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

  const { t } = useTranslation();

  useEffect(() => {
    if (name) initializeCallID(name);
  }, [name, initializeCallID]);

  useEffect(() => {
    if (tracks.length === 1 && currentParticipants > 1)
      setOtherUserDisconnected(true);
    setCurrentParticipants(tracks.length);
  }, [tracks.length]);

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
      onError: () => {
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
  const [selectedDrawerOption, setSelectedDrawerOption] = useState<
    'translator' | 'chat' | 'questions' | undefined
  >(undefined);
  const [sideSelection, setSideSelection] = useState<
    'chat' | 'questions' | 'notes'
  >('chat');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [deniedPermissions, setDeniedPermissions] = useState<{
    audio: boolean;
    video: boolean;
  }>({ audio: false, video: false });
  const {
    i18n: { language },
  } = useTranslation();

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
  const { setOnTextAdded } = useChatInputStore();
  const {
    uuid,
    token,
    livekitServerUrl,
    audioOptions,
    videoOptions,
    chatId,
    audioPermissionDenied,
    videoPermissionDenied,
  } = callData || {};
  const { data: user } = useSWR(USER_ENDPOINT);
  const profile = user?.profile;

  const { data: chatData } = useSWR(getChatEndpoint(chatId));
  useEffect(() => {
    if (urlUserId && !token) {
      // If userId is in url but no token available, redirect to call-setup so we can re-join the call
      navigate(getCallSetupRoute(urlUserId));
    }
  }, [urlUserId, token, navigate]);

  // Set up callback to open chat when text is added from TranslationTool
  useEffect(() => {
    setOnTextAdded(() => {
      setShowChat(true);
      setSideSelection('chat'); // Switch sidebar to chat tab
      setSelectedDrawerOption('chat'); // Open chat drawer on mobile
    });

    return () => {
      setOnTextAdded(null);
    };
  }, [setOnTextAdded]);

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
    <SidebarSelectionProvider
      value={{
        sideSelection,
        setSideSelection: (selection: string) =>
          setSideSelection(selection as 'chat' | 'questions' | 'notes'),
      }}
    >
      <LayoutContextProvider>
        <CallLayout>
          <VideoContainer $isFullScreen={isFullScreen} $showChat={showChat}>
            <LiveKitRoom
              video={videoPermissionDenied ? true : videoOptions}
              audio={audioPermissionDenied ? true : audioOptions}
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
                initializeCallID={initializeCallID}
                setCallRejected={setCallRejected}
                callRejected={callRejected}
              />
              <RoomAudioRenderer />
              {!callRejected && (
                <TopControlBar
                  activeOption={selectedDrawerOption}
                  onChatToggle={onMobileChatToggle}
                  onTranslatorToggle={onMobileTranslatorToggle}
                  onQuestionCardsToggle={onMobileQuestionsToggle}
                />
              )}
              <ControlBar
                hide={callRejected}
                isFullScreen={isFullScreen}
                onChatToggle={onChatToggle}
                onFullScreenToggle={onFullScreenToggle}
                onTranslatorToggle={onTranslatorToggle}
                onPermissionModalOpen={permissions => {
                  setDeniedPermissions(permissions);
                  setShowPermissionModal(true);
                }}
              />
            </LiveKitRoom>
            {showTranslator && <DesktopTranslationTool />}
          </VideoContainer>
          <Drawer
            title="Translate"
            open={selectedDrawerOption === 'translator'}
            onClose={() => setSelectedDrawerOption(undefined)}
          >
            <TranslationTool />
          </Drawer>
          <Drawer
            title="Chat"
            open={selectedDrawerOption === 'chat'}
            onClose={() => setSelectedDrawerOption(undefined)}
          >
            <Chat chatId={chatData?.uuid} inCall />
          </Drawer>
          <Drawer
            title="Questions"
            open={selectedDrawerOption === 'questions'}
            onClose={() => setSelectedDrawerOption(undefined)}
          >
            <QuestionCards />
          </Drawer>
          <CallSidebar isDisplayed={showChat} chatId={chatData?.uuid} />
        </CallLayout>
      </LayoutContextProvider>
      {showPermissionModal && (
        <PermissionsModal
          language={language as PrejoinLanguage}
          deniedPermissions={deniedPermissions}
          onClose={() => setShowPermissionModal(false)}
        />
      )}
    </SidebarSelectionProvider>
  );
}

export default VideoCall;
