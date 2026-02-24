import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  CalendarIcon,
  CardContent,
  CardFooter,
  CardHeader,
  ClockIcon,
  ExclamationIcon,
  Loading,
  StatusMessage,
  StatusTypes,
  Switch,
  Tags,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import {
  LoadingSizes,
  LoadingType,
} from '@a-little-world/little-world-design-system-core';
import {
  DevicePermissionError,
  LocalUserChoices,
  PreJoin,
  PreJoinValues,
} from '@livekit/components-react';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import {
  acceptMatch,
  authenticateRoom,
  exitLobby,
  getLobbyStatus,
  joinLobby,
  rejectMatch,
} from '../../../api/randomCalls';
import { USER_TYPES } from '../../../constants';
import { useConnectedCallStore } from '../../../features/stores';
import {
  RANDOM_CALL_EXIT_PARAM,
  RANDOM_CALL_EXIT_VALUE,
  USER_ENDPOINT,
} from '../../../features/swr';
import { clearActiveTracks } from '../../../helpers/video';
import {
  RANDOM_CALLS_ROUTE,
  getAppRoute,
  getRandomCallRoute,
} from '../../../router/routes';
import ProfileImage from '../../atoms/ProfileImage';
import { CallSetupCard } from '../Calls/CallSetup';

type LobbyState = 'idle' | 'partner_found' | 'timeout' | 'rejected';
type RejectionReason = 'user_rejected' | 'partner_rejected' | 'timeout';

interface PartnerInfoInterface {
  id: string;
  name: string;
  image: string;
  image_type: string;
  description: string;
  interests: string[];
}

interface MatchData {
  uuid: string;
  accepted: boolean;
  both_accepted: boolean;
  partner_rejected?: boolean;
  self_rejected?: boolean;
  partner: PartnerInfoInterface;
}

const ProposalCard = styled(CallSetupCard)`
  max-width: 500px;
`;

const PartnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const PartnerDetails = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const Timer = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const LoadingOverlay = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.radius.medium};
  z-index: 10;
  backdrop-filter: blur(2px);
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 5px solid ${({ theme }) => theme.color.border.subtle};
  border-top: 5px solid ${({ theme }) => theme.color.text.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LobbyLoading = styled(Loading)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.medium};
  right: ${({ theme }) => theme.spacing.medium};
  height: auto;
  color: ${({ theme }) => theme.color.text.title};
`;
const RelativeCard = styled(ProposalCard)`
  position: relative;
`;

const Schedule = styled.div`
  background: ${({ theme }) => theme.color.surface.secondary};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const ScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ScheduleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const RandomCallSetup = ({
  onCancel,
  onJoinComplete,
  hasJoinedLobby,
  onDeviceChoicesChange,
  onPermissionErrorsChange,
  error,
}: {
  onCancel: () => void;
  onJoinComplete: () => void;
  hasJoinedLobby: boolean;
  onDeviceChoicesChange: (choices: LocalUserChoices | null) => void;
  onPermissionErrorsChange: (errors: {
    audio: boolean;
    video: boolean;
  }) => void;
  error?: string | null;
}) => {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;
  const [countdown, setCountdown] = useState<number | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [audioPermissionError, setAudioPermissionError] = useState(false);
  const [videoPermissionError, setVideoPermissionError] = useState(false);
  const [deviceChoices, setDeviceChoices] = useState<LocalUserChoices | null>(
    null,
  );

  const switchesEnabled = false;
  const sameGenderSwitchRef = useRef<HTMLButtonElement>(null);
  const inclLearnersSwitchRef = useRef<HTMLButtonElement>(null);

  // Start countdown when permissions are granted
  useEffect(() => {
    if (permissionsGranted && countdown === null && !hasJoinedLobby) {
      setCountdown(5);
    }
  }, [permissionsGranted, countdown, hasJoinedLobby]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      return () => { };
    }

    const timer = setTimeout(() => {
      if (countdown === 1) {
        // Countdown finished, join lobby
        onJoinComplete();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown, onJoinComplete]);

  // Update parent when device choices change
  useEffect(() => {
    onDeviceChoicesChange(deviceChoices);
  }, [deviceChoices, onDeviceChoicesChange]);

  // Update parent when permission errors change
  useEffect(() => {
    onPermissionErrorsChange({
      audio: audioPermissionError,
      video: videoPermissionError,
    });
  }, [audioPermissionError, videoPermissionError, onPermissionErrorsChange]);

  const handleError = useCallback((e: Error) => {
    if (e instanceof DevicePermissionError) {
      if (e.deviceType === 'audio') {
        setAudioPermissionError(true);
      } else if (e.deviceType === 'video') {
        setVideoPermissionError(true);
      }
    }
  }, []);

  const handleValidate = useCallback((values: PreJoinValues) => {
    // Check if at least one device is available
    const hasDevice = values.audioAvailable || values.videoAvailable;
    if (hasDevice) {
      setPermissionsGranted(true);
    }

    // Store device choices whenever they're validated
    if (hasDevice) {
      setDeviceChoices({
        username: username || '',
        audioEnabled: values.audioEnabled ?? false,
        videoEnabled: values.videoEnabled ?? false,
        audioDeviceId: values.audioDeviceId,
        videoDeviceId: values.videoDeviceId,
        audioAvailable: values.audioAvailable ?? false,
        videoAvailable: values.videoAvailable ?? false,
      } as LocalUserChoices);
    }

    if (values.videoAvailable) {
      setVideoPermissionError(false);
    }
    if (values.audioAvailable) {
      setAudioPermissionError(false);
    }

    return hasDevice;
  }, []);

  return (
    <CallSetupCard $hideJoinBtn className="" size={undefined}>
      <LobbyLoading size={LoadingSizes.Small} inline type={LoadingType.Ring} />
      <CardHeader>{t('random_calls.lobby_title')}</CardHeader>
      <CardContent>
        <Text center>{t('random_calls.lobby_description')}</Text>

        <PreJoin
          camLabel={t('pcs_camera_label')}
          micLabel={t('pcs_mic_label')}
          joinLabel={t('pcs_btn_join_call')}
          onValidate={handleValidate}
          onError={handleError}
          defaults={{ username }}
          persistUserChoices={false}
        />
        {switchesEnabled && (
          <Switch
            inputRef={sameGenderSwitchRef as RefObject<HTMLButtonElement>}
            label={t('random_calls.lobby_switch_gender')}
            labelInline
            onCheckedChange={() => { }}
          />
        )}
        {switchesEnabled && user?.profile?.user_type === USER_TYPES.learner && (
          <Switch
            inputRef={inclLearnersSwitchRef as RefObject<HTMLButtonElement>}
            label={t('random_calls.lobby_switch_learners')}
            labelTooltip={t('random_calls.lobby_switch_learners_tooltip')}
            labelInline
            onCheckedChange={() => { }}
          />
        )}
        {error && (
          <StatusMessage type={StatusTypes.Error} visible>
            {error}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter align="center">
        <Button
          disabled={!hasJoinedLobby && countdown !== null}
          appearance={ButtonAppearance.Secondary}
          onClick={onCancel}
          size={ButtonSizes.Stretch}
        >
          {!hasJoinedLobby && countdown !== null
            ? t('random_calls.lobby_joining_in_x_seconds', {
              seconds: countdown,
            })
            : t('random_calls.lobby_cancel_search')}
        </Button>
      </CardFooter>
    </CallSetupCard>
  );
};

const PartnerProposal = ({
  matchData,
  onAccept,
  onReject,
  isAccepting = false,
  error,
  timeoutSeconds,
}: {
  matchData: MatchData;
  onAccept: () => void;
  onReject: (reason?: 'user_rejected' | 'timeout') => void;
  isAccepting?: boolean;
  error?: string | null;
  timeoutSeconds: number;
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(timeoutSeconds);

  useEffect(() => {
    setTimeLeft(timeoutSeconds);
  }, [timeoutSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onReject]);

  const { partner } = matchData;

  return (
    <RelativeCard className="" size={undefined}>
      <LoadingOverlay $visible={isAccepting}>
        <Spinner />
        <Text type={TextTypes.Body3} bold>
          {t('random_calls.waiting_on_partner_response', {
            name: partner.name,
          })}
        </Text>
      </LoadingOverlay>

      <CardHeader>{t('random_calls.partner_found')}</CardHeader>
      <CardContent>
        <PartnerInfo>
          <ProfileImage
            image={partner.image}
            imageType={partner.image_type}
            circle
            size="small"
          />
          <PartnerDetails>
            <Text type={TextTypes.Body4} bold>
              {partner.name}
            </Text>
            <Text color="secondary">{partner.description}</Text>
            {partner.interests.length > 0 && (
              <Tags content={partner.interests} />
            )}
          </PartnerDetails>
        </PartnerInfo>

        <Timer>
          <Text type={TextTypes.Body3} bold>
            <ClockIcon label="Clock icon" width={16} height={16} /> {timeLeft}s
          </Text>
          <Text type={TextTypes.Body5}>{t('random_calls.accept_prompt')} </Text>
        </Timer>
        {error && (
          <StatusMessage type={StatusTypes.Error} visible>
            {error}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter align="space-between">
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={() => onReject('user_rejected')}
          disabled={isAccepting}
        >
          {t('random_calls.proposal_reject')}
        </Button>
        <Button onClick={onAccept} disabled={isAccepting}>
          {t('random_calls.proposal_accept')}
        </Button>
      </CardFooter>
    </RelativeCard>
  );
};

const SessionsExpiredView = ({
  onClose,
  error,
}: {
  onClose: () => void;
  error?: string | null;
}) => {
  const { t } = useTranslation();
  const randomCallsSchedule = [
    'Mittwoch – 18:00–20:00 Uhr',
    'Freitag – 10:00–12:00 Uhr',
  ];

  return (
    <ProposalCard className="" size={undefined}>
      <CardHeader>{t('random_calls.expired_title')}</CardHeader>
      <CardContent>
        <Text>{t('random_calls.expired_description')}</Text>

        <Schedule>
          <ScheduleHeader>
            <CalendarIcon label="Calendar" width={20} height={20} />
            <Text type={TextTypes.Body3} bold>
              {t('random_calls.expired_schedule_heading')}
            </Text>
          </ScheduleHeader>
          <ScheduleList>
            {randomCallsSchedule.map(schedule => (
              <li key={schedule}>
                <Text type={TextTypes.Body4}>{schedule}</Text>
              </li>
            ))}
          </ScheduleList>
        </Schedule>
        <Text>{t('random_calls.expired_additional_text')}</Text>
        {error && (
          <StatusMessage type={StatusTypes.Error} visible>
            {error}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onClose} size={ButtonSizes.Stretch}>
          {t('random_calls.timeout_btn')}
        </Button>
      </CardFooter>
    </ProposalCard>
  );
};

const RejectedView = ({
  onReturnToLobby,
  reason,
  error,
}: {
  onReturnToLobby: () => void;
  reason: RejectionReason | null;
  error?: string | null;
}) => {
  const { t } = useTranslation();

  const getTitleKey = () => {
    switch (reason) {
      case 'user_rejected':
        return 'random_calls.user_rejected_title';
      case 'partner_rejected':
        return 'random_calls.partner_rejected_title';
      case 'timeout':
        return 'random_calls.proposal_timeout_title';
      default:
        return 'random_calls.rejected_title';
    }
  };

  const getDescriptionKey = () => {
    switch (reason) {
      case 'user_rejected':
        return 'random_calls.user_rejected_manual_description';
      case 'partner_rejected':
        return 'random_calls.partner_rejected_description';
      case 'timeout':
        return 'random_calls.user_rejected_timeout_description';
      default:
        return 'random_calls.rejected_description';
    }
  };

  console.log({ reason, a: getTitleKey(), b: getDescriptionKey() });
  return (
    <ProposalCard className="" size={undefined}>
      <CardHeader>{t(getTitleKey())}</CardHeader>
      <CardContent>
        <ExclamationIcon
          label="Exclamation circle icon"
          width={20}
          height={20}
        />
        <Text center>{t(getDescriptionKey())}</Text>
        {error && (
          <StatusMessage type={StatusTypes.Error} visible>
            {error}
          </StatusMessage>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onReturnToLobby} size={ButtonSizes.Stretch}>
          {t('random_calls.search_again')}
        </Button>
      </CardFooter>
    </ProposalCard>
  );
};

const RandomCallsLobby = ({
  lobbyUuid,
  onCancel,
}: {
  lobbyUuid: string;
  onCancel: () => void;
}) => {
  const navigate = useNavigate();
  const { connectToCall } = useConnectedCallStore();
  const [lobbyState, setLobbyState] = useState<LobbyState>('idle');
  const [isAccepting, setIsAccepting] = useState(false);
  const [rejectionReason, setRejectionReason] =
    useState<RejectionReason | null>(null);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const [deviceChoices, setDeviceChoices] = useState<LocalUserChoices | null>(
    null,
  );
  const [audioPermissionError, setAudioPermissionError] = useState(false);
  const [videoPermissionError, setVideoPermissionError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isManualRejectPending = useRef(false);

  // Poll lobby status every 2 seconds when in idle state, after joining, or when partner is found
  const { data: statusData, mutate: mutateRCState } = useSWR(
    (lobbyState === 'idle' && hasJoinedLobby) || lobbyState === 'partner_found'
      ? `/api/random_calls/lobby/${lobbyUuid}/status`
      : null,
    () => getLobbyStatus(lobbyUuid),
    {
      refreshInterval: 2000,
      onError: err => {
        // If lobby is not active or user not in lobby, show expired view
        if (err?.status === 400) {
          setLobbyState('timeout');
        }
      },
    },
  );

  console.log({ statusData, lobbyState, matchData, rejectionReason });

  // Check for matching
  useEffect(() => {
    if (!hasJoinedLobby) return;

    const matching = statusData?.matching as MatchData | undefined;

    // TODO: Improve handling of all possible states:
    // - lobby waiting for match = 'idle'
    // - lobby has matching = 'partner_found'
    if (matching) {
      // If both users have already accepted, skip proposal and go directly to call.
      if (matching.both_accepted) {
        setMatchData(matching);
        handleBothAccepted(matching);
        return;
      }

      // Partner rejected/timed out. Keep this in an explicit rejected view until user action.
      if (matching.partner_rejected) {
        setRejectionReason('partner_rejected');
        setLobbyState('rejected');
        setMatchData(null);
        setIsAccepting(false);
        return;
      }

      // Otherwise, show the proposal screen
      setMatchData(matching);
      if (lobbyState === 'idle') {
        setLobbyState('partner_found');
      }
      setError(null); // Clear any previous errors when transitioning to partner_found
    }

    // If match disappears while on proposal screen:
    // - after accepting: partner timed out/rejected -> show partner_rejected message
    // - before accepting: self timeout/no response path
    if (!matching && lobbyState === 'partner_found') {
      setMatchData(null);
      setIsAccepting(false);
      if (isManualRejectPending.current) {
        setRejectionReason('user_rejected');
        isManualRejectPending.current = false;
      } else if (isAccepting) {
        setRejectionReason('partner_rejected');
      } else {
        setRejectionReason('timeout');
      }
      setLobbyState('rejected');
      setError(null); // Clear errors when returning to idle
      return;
    }

    // Check if both accepted while waiting for partner
    if (
      matching?.both_accepted &&
      lobbyState === 'partner_found' &&
      isAccepting
    ) {
      // Both users accepted, proceed to room authentication
      // This will be handled by parent component
      handleBothAccepted(matching);
    }
  }, [statusData, lobbyState, isAccepting, hasJoinedLobby]);

  const handleJoinComplete = async () => {
    setError(null);
    try {
      await joinLobby(lobbyUuid);
      setHasJoinedLobby(true);
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Failed to join lobby. Please try again.';
      setError(errorMessage);
      // On error, close the modal after a delay to show error
      setTimeout(() => {
        mutateRCState();
        onCancel();
      }, 3000);
    }
  };

  const handleCancel = async () => {
    setError(null);
    isManualRejectPending.current = false;
    onCancel();
    try {
      if (hasJoinedLobby) {
        await exitLobby(lobbyUuid);
        setHasJoinedLobby(false);
      }
    } catch (_err: any) {
      // Don't show error on cancel - just log silently
      // User is intentionally leaving, so errors are less critical
    }
    mutateRCState();
  };

  const handleAccept = async () => {
    if (!matchData) return;

    setError(null);
    setIsAccepting(true);
    try {
      await acceptMatch(lobbyUuid, matchData.uuid);
      // Continue polling to check if partner also accepted
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Failed to accept match. Please try again.';
      setError(errorMessage);
      setIsAccepting(false);
      setRejectionReason('timeout');
      setLobbyState('rejected');
    }
  };

  const handleReject = async (reason: 'user_rejected' | 'timeout' = 'user_rejected') => {
    if (!matchData) return;

    setError(null);
    isManualRejectPending.current = reason === 'user_rejected';
    try {
      await rejectMatch(lobbyUuid, matchData.uuid);
    } catch (_err: any) {
      // Don't show error on reject - user is intentionally rejecting
      // Just proceed with state change
    }
    setRejectionReason(reason);
    setLobbyState('rejected');
    setIsAccepting(false);
    setMatchData(null);
  };

  const handleReturnToLobby = () => {
    setError(null);
    isManualRejectPending.current = false;
    mutateRCState();
    setLobbyState('idle');
    setIsAccepting(false);
    setMatchData(null);
  };

  const handleBothAccepted = async (acceptedMatchData?: MatchData) => {
    const currentMatchData = acceptedMatchData ?? matchData;
    if (!currentMatchData) return;

    setError(null);
    try {
      // Call room authentication API
      const roomData = await authenticateRoom(lobbyUuid, currentMatchData.uuid);

      // Set up call connection with room data, including device choices
      connectToCall({
        userId: currentMatchData.partner.id,
        chatId: roomData.chat?.uuid || '',
        tracks: deviceChoices || undefined,
        token: roomData.token,
        livekitServerUrl: roomData.server_url,
        callType: 'random',
        audioOptions: deviceChoices?.audioEnabled
          ? { deviceId: deviceChoices.audioDeviceId }
          : false,
        videoOptions: deviceChoices?.videoEnabled
          ? { deviceId: deviceChoices.videoDeviceId }
          : false,
        audioPermissionDenied: audioPermissionError,
        videoPermissionDenied: videoPermissionError,
        postDisconnectRedirect: `${getAppRoute(
          RANDOM_CALLS_ROUTE,
        )}?${RANDOM_CALL_EXIT_PARAM}=${RANDOM_CALL_EXIT_VALUE}`,
      });

      clearActiveTracks();

      // Navigate to the random call screen for the partner
      navigate(getRandomCallRoute(currentMatchData.partner.id));

      // Close the lobby modal
      onCancel();
    } catch (err: any) {
      // TODO: There should be a seperaete lobby state here
      // Something around 'error connecting to call' but you can retry
      const errorMessage =
        err?.message || 'Failed to connect to call. Please try again.';
      setError(errorMessage);
      // On error, show as rejected
      setRejectionReason('timeout');
      setLobbyState('rejected'); // TODO: Should be different lobby state
      setIsAccepting(false);
    }
  };

  const handlePermissionErrorsChange = useCallback(
    (errors: { audio: boolean; video: boolean }) => {
      setAudioPermissionError(errors.audio);
      setVideoPermissionError(errors.video);
    },
    [],
  );

  switch (lobbyState) {
    case 'partner_found':
      if (!matchData)
        return (
          <RandomCallSetup
            onCancel={handleCancel}
            onJoinComplete={handleJoinComplete}
            hasJoinedLobby={hasJoinedLobby}
            onDeviceChoicesChange={setDeviceChoices}
            onPermissionErrorsChange={handlePermissionErrorsChange}
            error={error}
          />
        );
      return (
        <PartnerProposal
          matchData={matchData}
          onAccept={handleAccept}
          onReject={handleReject}
          isAccepting={isAccepting}
          error={error}
          timeoutSeconds={statusData?.match_proposal_timeout ?? 10}
        />
      );
    case 'timeout':
      return <SessionsExpiredView onClose={handleCancel} error={error} />;
    case 'rejected':
      return (
        <RejectedView
          onReturnToLobby={handleReturnToLobby}
          reason={rejectionReason}
          error={error}
        />
      );
    default:
      return (
        <RandomCallSetup
          onCancel={handleCancel}
          onJoinComplete={handleJoinComplete}
          hasJoinedLobby={hasJoinedLobby}
          onDeviceChoicesChange={setDeviceChoices}
          onPermissionErrorsChange={handlePermissionErrorsChange}
          error={error}
        />
      );
  }
};

export default RandomCallsLobby;
