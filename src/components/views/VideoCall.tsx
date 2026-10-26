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
  useConnectionState,
  useDisconnectButton,
  useLocalParticipant,
  useRoomContext,
  useRoomInfo,
  useTracks,
} from '@livekit/components-react';
import type { PrejoinLanguage } from '@livekit/components-react/dist/prefabs/prejoinTranslations';

import '@livekit/components-styles';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ConnectionState, LocalParticipant, Room, Track } from 'livekit-client';
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
  useCallTracksStore,
  useChatInputStore,
  useConnectedCallStore,
  useReceiveHandlerStore,
} from '../../features/stores';
import { createEncryptedRoom, isE2EEAvailable } from '../../helpers/e2ee';
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
import E2EEWarningModal from '../blocks/Calls/E2EEWarningModal';
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

// Chrome keeps a closed output stream idle for 5s and hands it to the next player,
// so the playout has to stay down longer than that to get a fresh stream.
const REROUTE_GAP_MS = 6000;

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
 * Renders remote call audio and verifies the WebView routed it through the
 * voice-communication stream. On Android the remote playout latches onto STREAM_MUSIC when
 * it is created while no mic is open (e.g. joining with the mic off and turning it on later);
 * when that happens we tear the playout down and re-create it until it lands on the call
 * stream. Web has no such routing.
 */
function RoutedRoomAudio() {
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

  const [rerouting, setRerouting] = useState(false);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!environment.isNative || !micLive || !hasRemoteAudio || rerouting) {
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
      if (usages.includes(USAGE_MEDIA) && attemptsRef.current < 3) {
        attemptsRef.current += 1;
        console.warn(
          `[call-audio] remote audio latched media; re-creating playout (attempt ${attemptsRef.current})`,
        );
        setRerouting(true);
        return;
      }
      setTimeout(poll, 500);
    };
    const timer = setTimeout(poll, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [micLive, hasRemoteAudio, rerouting]);

  useEffect(() => {
    if (!rerouting) return undefined;
    const timer = setTimeout(() => setRerouting(false), REROUTE_GAP_MS);
    return () => clearTimeout(timer);
  }, [rerouting]);

  if (rerouting) return null;
  return <RoomAudioRenderer />;
}

function PublishSetupTracks() {
  const room = useRoomContext();
  const connectionState = useConnectionState();

  useEffect(() => {
    if (connectionState !== ConnectionState.Connected) return;
    useCallTracksStore
      .getState()
      .takeTracks()
      .forEach(track =>
        room.localParticipant.publishTrack(track).catch(error => {
          console.warn('[call-tracks] could not publish track', error);
          track.stop();
        }),
      );
  }, [connectionState, room]);

  return null;
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
    e2eeKey,
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

  // The backend hands out a key per room unless either client reported it cannot encrypt.
  // Building the room encrypts every track from its first publication; if anything in that
  // path fails we join unencrypted rather than losing the call.
  const [encryptedRoom, setEncryptedRoom] = useState<Room>();
  const [e2eeUnavailable, setE2eeUnavailable] = useState(false);

  useEffect(() => {
    if (!e2eeKey || e2eeUnavailable) return undefined;
    if (!isE2EEAvailable()) {
      console.warn(
        '[e2ee] client cannot encrypt call media; joining unencrypted',
      );
      setE2eeUnavailable(true);
      return undefined;
    }

    let cancelled = false;
    createEncryptedRoom(e2eeKey)
      .then(room => {
        if (cancelled) {
          room.disconnect();
          return;
        }
        setEncryptedRoom(room);
      })
      .catch(error => {
        console.warn('[e2ee] setup failed; joining unencrypted', error);
        if (!cancelled) setE2eeUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [e2eeKey, e2eeUnavailable]);

  const e2eePending = !!e2eeKey && !e2eeUnavailable && !encryptedRoom;
  const room = e2eeKey && !e2eeUnavailable ? encryptedRoom : undefined;

  // devices the setup already opened are published as-is instead of being reopened
  const [setupTrackKinds] = useState(
    () =>
      new Set(useCallTracksStore.getState().tracks.map(track => track.kind)),
  );

  const mountedRef = useRef(false);
  const leavingRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // deferred so StrictMode's remount doesn't drop the tracks
      setTimeout(() => {
        if (!mountedRef.current) useCallTracksStore.getState().releaseTracks();
      });
    };
  }, []);

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
    // route is rendered once more after disconnecting
    // urlUserId is still set and token is null
    // -> routed again to the call setup screen
    if (leavingRef.current) return;
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

  // Never connect a call from a client that cannot encrypt its media, even when this route
  // is reached directly (deep link, stale call state).
  if (!isE2EEAvailable()) {
    return <E2EEWarningModal open />;
  }

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
              room={room}
              video={
                !setupTrackKinds.has(Track.Kind.Video) &&
                (videoPermissionDenied ? true : videoOptions)
              }
              audio={
                !setupTrackKinds.has(Track.Kind.Audio) &&
                (audioPermissionDenied ? true : audioOptions)
              }
              token={e2eePending ? undefined : token}
              serverUrl={livekitServerUrl}
              onEncryptionError={error => {
                console.warn('[e2ee] encryption error', error);
              }}
              onDisconnected={() => {
                leavingRef.current = true;
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
              <PublishSetupTracks />
              <RoutedRoomAudio />
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
