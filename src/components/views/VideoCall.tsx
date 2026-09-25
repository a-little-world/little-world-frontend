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
  TrackReferenceOrPlaceholder,
  useDisconnectButton,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
} from '@livekit/components-react';
import type { PrejoinLanguage } from '@livekit/components-react/dist/prefabs/prejoinTranslations';

import '@livekit/components-styles';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { LocalParticipant, Track } from 'livekit-client';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getChatEndpoint,
  RANDOM_CALL_EXIT_PARAM,
  RANDOM_CALL_EXIT_VALUE,
  USER_ENDPOINT,
} from '../../api/endpoints';
import { callAgain } from '../../api/livekit';
import { endRandomCallMatch } from '../../api/randomCalls';
import { environment } from '../../environment';
import {
  useChatInputStore,
  useConnectedCallStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import { releasePreviewAudioTracks } from '../../helpers/video';
import useIsBelowBreakpoint from '../../hooks/useIsBelowBreakpoint';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import {
  getAppRoute,
  getCallSetupRoute,
  RANDOM_CALLS_ROUTE,
} from '../../router/routes';
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
  CameraPipOverlay,
  DesktopTranslationTool,
  StyledGridLayout,
  VideoContainer,
  VideoPlaceholder,
  Videos,
  WaitingTile,
} from './VideoCall.styles';

interface MyVideoConferenceProps {
  isFullScreen: boolean;
  isRandomCall: boolean;
  randomCallMatchStatus?: {
    partner_timedout_joining?: boolean;
    partner_left_session?: boolean;
    remaining_video_call_join_time?: number;
  };
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
  onDisconnectClick: () => void;
}

// Android AudioAttributes usages, mirrored from the native CallAudio module.
const USAGE_MEDIA = 1;
const USAGE_VOICE_COMMUNICATION = 2;

async function fetchAudioState(): Promise<{
  mode?: number;
  usages?: number[];
} | null> {
  const bridge = useReceiveHandlerStore.getState().sendMessageToReactNative;
  try {
    const res = await bridge?.({ action: 'GET_AUDIO_STATE', payload: {} });
    if (res && res.ok) return res.data;
  } catch {
    // unknown state; the caller keeps polling
  }
  return null;
}

/**
 * Renders remote call audio, but only once the local microphone is capturing, and then
 * verifies the WebView actually routed it through the voice-communication stream. On
 * Android the remote playout latches onto STREAM_MUSIC when it is created before the
 * WebView is in MODE_IN_COMMUNICATION (the join case); when that happens we re-create the
 * playout until it lands on the call stream. Web has no such routing, so it renders
 * immediately.
 */
function GatedRoomAudio() {
  const { microphoneTrack } = useLocalParticipant();
  const tracks = useTracks([Track.Source.Microphone], { onlySubscribed: true });
  const hasRemoteAudio = tracks.some(
    ref =>
      ref.participant &&
      !(ref.participant instanceof LocalParticipant) &&
      !!ref.publication &&
      !ref.publication.isMuted,
  );

  const micLive =
    microphoneTrack?.track?.mediaStreamTrack?.readyState === 'live';

  const [gateOpen, setGateOpen] = useState(!environment.isNative);
  const [renderKey, setRenderKey] = useState(0);
  const releasedRef = useRef(false);
  const attemptsRef = useRef(0);

  // Once LiveKit's own mic is live, drop the held preview mic.
  useEffect(() => {
    if (!environment.isNative || !micLive || releasedRef.current) return;
    releasedRef.current = true;
    releasePreviewAudioTracks();
  }, [micLive]);

  // Open the gate once the local mic is live.
  useEffect(() => {
    if (!environment.isNative || !micLive || gateOpen) return;
    setGateOpen(true);
  }, [micLive, gateOpen]);

  // Safety net: never leave the call silent if the mic signal never arrives.
  useEffect(() => {
    if (!environment.isNative || gateOpen) return undefined;
    const timer = setTimeout(() => {
      console.warn('[call-audio] mic never went live; opening audio gate');
      setGateOpen(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [gateOpen]);

  // Guarantee the outcome rather than assume timing: the WebView's remote playback must be
  // on the voice-communication route. If it latched media, re-create the playout.
  useEffect(() => {
    if (!environment.isNative || !gateOpen || !micLive || !hasRemoteAudio) {
      return undefined;
    }
    let cancelled = false;
    const poll = async () => {
      const state = await fetchAudioState();
      if (cancelled) return;
      const usages = state?.usages ?? [];
      if (usages.includes(USAGE_VOICE_COMMUNICATION)) {
        attemptsRef.current = 0;
        return;
      }
      if (usages.includes(USAGE_MEDIA) && attemptsRef.current < 5) {
        attemptsRef.current += 1;
        console.warn(
          `[call-audio] remote audio latched media; re-creating playout (attempt ${attemptsRef.current})`,
        );
        setRenderKey(key => key + 1);
      }
      setTimeout(poll, 500);
    };
    const timer = setTimeout(poll, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [gateOpen, micLive, hasRemoteAudio]);

  // Stop the held preview mic if the call unmounts before LiveKit took over.
  useEffect(
    () => () => {
      if (!releasedRef.current) {
        releasedRef.current = true;
        releasePreviewAudioTracks();
      }
    },
    [],
  );

  if (!gateOpen) return null;
  return <RoomAudioRenderer key={renderKey} />;
}

function MyVideoConference({
  isFullScreen,
  isRandomCall,
  randomCallMatchStatus,
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
  onDisconnectClick,
}: MyVideoConferenceProps) {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true },
  );
  const [currentParticipants, setCurrentParticipants] = useState(1);
  const [otherUserDisconnected, setOtherUserDisconnected] = useState(false);
  const [callAgainError, setCallAgainError] = useState('');
  const { name } = useRoomInfo();
  const { buttonProps: disconnectProps } = useDisconnectButton({});
  const { onClick: livekitDisconnectClick, ...disconnectButtonProps } =
    disconnectProps;
  const theme = useTheme();

  const { t } = useTranslation();

  const isScreenShareActive = useMemo(
    () =>
      tracks.some(
        track =>
          track.source === Track.Source.ScreenShare &&
          track.publication &&
          !track.publication.isMuted,
      ),
    [tracks],
  );

  const gridTracks = useMemo(
    () =>
      isScreenShareActive
        ? tracks.filter(
            track =>
              track.source === Track.Source.ScreenShare &&
              track.publication &&
              !track.publication.isMuted,
          )
        : tracks,
    [isScreenShareActive, tracks],
  );

  const localCameraTrack = useMemo(
    () =>
      tracks.find(
        track =>
          track.source === Track.Source.Camera &&
          track.participant instanceof LocalParticipant,
      ),
    [tracks],
  );

  const remoteCameraTrack = useMemo(
    () =>
      tracks.find(
        track =>
          track.source === Track.Source.Camera &&
          track.participant &&
          !(track.participant instanceof LocalParticipant),
      ),
    [tracks],
  );

  useEffect(() => {
    if (name) initializeCallID(name);
  }, [name, initializeCallID]);

  useEffect(() => {
    if (tracks.length === 1 && currentParticipants > 1)
      setOtherUserDisconnected(true);
    setCurrentParticipants(tracks.length);
  }, [tracks.length]);

  const placeholders = {};
  const remoteTracks: TrackReferenceOrPlaceholder[] = [];
  tracks.forEach(track => {
    if (track.participant) {
      const isLocal = track?.participant instanceof LocalParticipant;
      if (!isLocal) remoteTracks.push(track);

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

  const randomCallCountdownSeconds = Math.max(
    0,
    Math.ceil(randomCallMatchStatus?.remaining_video_call_join_time ?? 0),
  );
  const isPartnerDisconnectedInRandomCall =
    !!randomCallMatchStatus?.partner_left_session;
  const isPartnerTimedOutJoining =
    !!randomCallMatchStatus?.partner_timedout_joining;
  const getWaitingMessage = () => {
    if (isRandomCall) {
      if (isPartnerDisconnectedInRandomCall) {
        return t('call.partner_disconnected', { name: partnerName });
      }
      if (isPartnerTimedOutJoining) {
        return t('random_call.partner_timedout_joining', { name: partnerName });
      }
      return t('random_call.waiting_for_partner_countdown', {
        name: partnerName,
        seconds: randomCallCountdownSeconds,
      });
    }

    if (otherUserDisconnected) {
      return t('call.partner_disconnected', { name: partnerName });
    }

    return t('call.waiting_for_partner', { name: partnerName });
  };
  const waitingMessage = getWaitingMessage();
  if (isEmpty(tracks)) return null;
  return (
    <Videos>
      {!callRejected && (
        <>
          <StyledGridLayout
            tracks={gridTracks}
            $screenShareActive={isScreenShareActive}
          >
            <ParticipantTile placeholders={placeholders} />
          </StyledGridLayout>
          {isScreenShareActive && (
            <CameraPipOverlay>
              {localCameraTrack && (
                <ParticipantTile
                  trackRef={localCameraTrack}
                  placeholders={placeholders}
                />
              )}
              {remoteCameraTrack && (
                <ParticipantTile
                  trackRef={remoteCameraTrack}
                  placeholders={placeholders}
                />
              )}
            </CameraPipOverlay>
          )}
        </>
      )}

      {isEmpty(remoteTracks) && (
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
                  {...disconnectButtonProps}
                  onClick={(event: any) => {
                    onDisconnectClick();
                    livekitDisconnectClick?.(event);
                  }}
                >
                  {t('call.exit')}
                </Button>
                <Button onClick={handleCallAgain} size={ButtonSizes.Small}>
                  {t('call.call_again')}
                </Button>
              </ButtonsContainer>
            </>
          ) : (
            <Text type={TextTypes.Body4} center>
              {waitingMessage}
            </Text>
          )}
        </WaitingTile>
      )}
    </Videos>
  );
}

function VideoCall() {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Detect if this is a random call route
  const isRandomCallRoute = location.pathname.includes('/random-call/');
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
  const isBelowBreakpoint = useIsBelowBreakpoint();
  const {
    uuid,
    token,
    livekitServerUrl,
    audioOptions,
    videoOptions,
    chatId,
    randomMatchId,
    audioPermissionDenied,
    videoPermissionDenied,
    callType,
    postDisconnectRedirect,
    randomLobbyUuid,
  } = callData || {};
  const { data: user } = useSWR(USER_ENDPOINT);
  const profile = user?.profile;

  const { data: chatData } = useSWR(chatId ? getChatEndpoint(chatId) : null);
  const isRandomCall = callType === 'random' || isRandomCallRoute;
  const randomCallMatchStatusEndpoint =
    isRandomCall && randomLobbyUuid && randomMatchId
      ? `/api/random_calls/lobby/${randomLobbyUuid}/match/${randomMatchId}/status`
      : null;
  const { data: randomCallMatchStatus } = useSWR(
    randomCallMatchStatusEndpoint,
    {
      refreshInterval: 1000,
    },
  );

  // Native hosts the call in a WebView and needs to know when to redirect the
  // hardware volume keys at the stream the call audio is actually on.
  useEffect(() => {
    if (!environment.isNative) return undefined;
    const notify = (inCall: boolean) =>
      useReceiveHandlerStore.getState().sendMessageToReactNative?.({
        action: 'CALL_STATE_CHANGED',
        payload: { inCall },
      });
    notify(true);
    return () => {
      notify(false);
    };
  }, []);

  useEffect(() => {
    if (urlUserId && !token) {
      // If userId is in url but no token available, redirect to call-setup so we can re-join the call
      if (isRandomCallRoute) {
        navigate(getAppRoute(RANDOM_CALLS_ROUTE));
      } else {
        navigate(getCallSetupRoute(urlUserId));
      }
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
      setShowChat(prevState => {
        if (prevState) setSideSelection('chat');
        return !prevState;
      });
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

  const handleManualDisconnect = useCallback(() => {
    if ((callType !== 'random' && !isRandomCallRoute) || !randomMatchId) {
      return;
    }
    endRandomCallMatch(randomMatchId).catch(() => {
      // Best effort: disconnect/redirect flow must continue even if this call fails.
    });
  }, [callType, isRandomCallRoute, randomMatchId]);

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
                disconnectFromCall({
                  sessionId: uuid,
                  partnerId: chatData?.partner?.id,
                });
                if (postDisconnectRedirect) {
                  navigate(postDisconnectRedirect, { replace: true });
                  return;
                }
                // Redirect to random calls page with query param for random calls
                if (callType === 'random' || isRandomCallRoute) {
                  navigate(
                    `${getAppRoute(
                      RANDOM_CALLS_ROUTE,
                    )}?${RANDOM_CALL_EXIT_PARAM}=${RANDOM_CALL_EXIT_VALUE}`,
                    { replace: true },
                  );
                  return;
                }
                navigate(getAppRoute());
              }}
            >
              <MyVideoConference
                isFullScreen={isFullScreen}
                isRandomCall={isRandomCall}
                randomCallMatchStatus={randomCallMatchStatus}
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
                onDisconnectClick={handleManualDisconnect}
              />
              <GatedRoomAudio />
              {!callRejected && (
                <TopControlBar
                  activeOption={selectedDrawerOption}
                  onChatToggle={onMobileChatToggle}
                  onTranslatorToggle={onMobileTranslatorToggle}
                  onQuestionCardsToggle={onMobileQuestionsToggle}
                  unreadChatCount={chatData?.unread_count}
                />
              )}
              <ControlBar
                hide={callRejected}
                isFullScreen={isFullScreen}
                onChatToggle={onChatToggle}
                onFullScreenToggle={onFullScreenToggle}
                onTranslatorToggle={onTranslatorToggle}
                onDisconnectClick={handleManualDisconnect}
                onPermissionModalOpen={permissions => {
                  setDeniedPermissions(permissions);
                  setShowPermissionModal(true);
                }}
                unreadChatCount={chatData?.unread_count}
              />
            </LiveKitRoom>
            {showTranslator && <DesktopTranslationTool />}
          </VideoContainer>
          {isBelowBreakpoint ? (
            <>
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
                {selectedDrawerOption === 'chat' && (
                  <Chat chatId={chatData?.uuid} inCall />
                )}
              </Drawer>
              <Drawer
                title="Questions"
                open={selectedDrawerOption === 'questions'}
                onClose={() => setSelectedDrawerOption(undefined)}
              >
                <QuestionCards />
              </Drawer>
            </>
          ) : (
            <CallSidebar isDisplayed={showChat} chatId={chatData?.uuid} />
          )}
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
