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
  Tags,
  Text,
  TextTypes
} from '@a-little-world/little-world-design-system';
import { PreJoin } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';

import { acceptMatch, authenticateRoom, exitLobby, getLobbyStatus, joinLobby, rejectMatch } from '../../../api/randomCalls';
import { useConnectedCallStore } from '../../../features/stores';
import { USER_ENDPOINT } from '../../../features/swr';
import { getCallRoute } from '../../../router/routes';
import ProfileImage from '../../atoms/ProfileImage';
import { CallSetupCard } from '../Calls/CallSetup';

type LobbyState = 'idle' | 'partner_found' | 'timeout' | 'rejected';
type RejectionReason = 'user_rejected' | 'partner_rejected' | 'timeout';

interface PartnerInfo {
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
  partner: PartnerInfo;
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
  hasJoinedLobby
}: {
  onCancel: () => void;
  onJoinComplete: () => void;
  hasJoinedLobby: boolean;
}) => {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;
  const [countdown, setCountdown] = useState<number | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Start countdown when permissions are granted
  useEffect(() => {
    if (permissionsGranted && countdown === null && !hasJoinedLobby) {
      setCountdown(5);
    }
  }, [permissionsGranted, countdown, hasJoinedLobby]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setTimeout(() => {
      if (countdown === 1) {
        // Countdown finished, join lobby
        onJoinComplete();
      } else {
        setCountdown(countdown - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onJoinComplete]);

  const handleValidate = (values: any) => {
    // Check if at least one device is available
    const hasDevice = values.audioAvailable || values.videoAvailable;
    if (hasDevice) {
      setPermissionsGranted(true);
    }
    return hasDevice;
  };

  return (
    <CallSetupCard $hideJoinBtn className="">
      <CardHeader>{t('random_calls.lobby_title')}</CardHeader>
      <CardContent>
        <Text center>{t('random_calls.lobby_description')}</Text>

        <PreJoin
          camLabel={t('pcs_camera_label')}
          micLabel={t('pcs_mic_label')}
          joinLabel={t('pcs_btn_join_call')}
          onValidate={handleValidate}
          defaults={{ username }}
          persistUserChoices={false}
        />
      </CardContent>
      <CardFooter align="center">
        {!hasJoinedLobby && countdown !== null ? (
          <Button
            appearance={ButtonAppearance.Primary}
            onClick={onJoinComplete}
            size={ButtonSizes.Stretch}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            {t('random_calls.joining_in_x_seconds', `Joining in ${countdown} seconds - Click to join now`)}
          </Button>
        ) : (
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={onCancel}
            size={ButtonSizes.Stretch}
          >
            {t('random_calls.lobby_cancel_seach')}
          </Button>
        )}
      </CardFooter>
    </CallSetupCard>
  );
};

const PartnerProposal = ({
  matchData,
  onAccept,
  onReject,
  isAccepting = false,
}: {
  matchData: MatchData;
  onAccept: () => void;
  onReject: () => void;
  isAccepting?: boolean;
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to accept

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onReject(); // Auto-reject when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  const partner = matchData.partner;

  return (
    <RelativeCard>
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
            {partner.interests.length > 0 && <Tags content={partner.interests} />}
          </PartnerDetails>
        </PartnerInfo>

        <Timer>
          <Text type={TextTypes.Body3} bold>
            <ClockIcon label="Clock icon" width={16} height={16} /> {timeLeft}s
          </Text>
          <Text type={TextTypes.Body5}>{t('random_calls.accept_prompt')}</Text>
        </Timer>
      </CardContent>
      <CardFooter align="space-between">
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={onReject}
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

const SessionsExpiredView = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const randomCallsSchedule = [
    'Mittwoch – 18:00–20:00 Uhr',
    'Freitag – 10:00–12:00 Uhr',
  ];

  return (
    <ProposalCard>
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
}: {
  onReturnToLobby: () => void;
  reason: RejectionReason;
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
        return 'random_calls.user_rejected_description';
      case 'partner_rejected':
        return 'random_calls.partner_rejected_description';
      case 'timeout':
        return 'random_calls.proposal_timeout_description';
      default:
        return 'random_calls.rejected_description';
    }
  };

  return (
    <ProposalCard>
      <CardHeader>{t(getTitleKey())}</CardHeader>
      <CardContent>
        <ExclamationIcon
          label="Exclamation circle icon"
          width={20}
          height={20}
        />
        <Text center>{t(getDescriptionKey())}</Text>
      </CardContent>
      <CardFooter>
        <Button onClick={onReturnToLobby} size={ButtonSizes.Stretch}>
          {t('random_calls.search_again')}
        </Button>
      </CardFooter>
    </ProposalCard>
  );
};

const RandomCallsLobby = ({ onCancel }: { onCancel: () => void }) => {
  const navigate = useNavigate();
  const { connectToCall } = useConnectedCallStore();
  const [lobbyState, setLobbyState] = useState<LobbyState>('idle');
  const [isAccepting, setIsAccepting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('user_rejected');
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
  const lobbyName = 'default';

  // Poll lobby status every 2 seconds when in idle state, after joining, or when partner is found
  const { data: statusData, error, mutate: mutateRCState } = useSWR(
    (lobbyState === 'idle' && hasJoinedLobby) || lobbyState === 'partner_found'
      ? `/api/random_calls/lobby/${lobbyName}/status`
      : null,
    () => getLobbyStatus(lobbyName),
    {
      refreshInterval: 2000,
      onError: (err) => {
        // If lobby is not active or user not in lobby, show expired view
        if (err?.status === 400) {
          setLobbyState('timeout');
        }
      },
    }
  );

  // Check for matching
  useEffect(() => {
    if (statusData?.matching && lobbyState === 'idle') {
      setMatchData(statusData.matching);
      setLobbyState('partner_found');
    }

    // If match disappears while on proposal screen (before accepting), return to lobby
    if (!statusData?.matching && lobbyState === 'partner_found' && !isAccepting) {
      // Match disappeared (partner rejected or timed out)
      setMatchData(null);
      setLobbyState('idle');
    }

    // Check if both accepted while waiting for partner
    if (
      statusData?.matching?.both_accepted &&
      lobbyState === 'partner_found' &&
      isAccepting
    ) {
      // Both users accepted, proceed to room authentication
      // This will be handled by parent component
      handleBothAccepted();
    }
  }, [statusData, lobbyState, isAccepting]);


  const handleJoinComplete = async () => {
    try {
      await joinLobby(lobbyName);
      setHasJoinedLobby(true);
    } catch (err) {
      console.error('Failed to join lobby:', err);
      // On error, close the modal
      mutateRCState()
      onCancel();
    }
  };

  const handleCancel = async () => {
    try {
      if (hasJoinedLobby) {
        await exitLobby(lobbyName);
      }
    } catch (err) {
      console.error('Failed to exit lobby:', err);
    }
    mutateRCState()
    onCancel();
  };

  const handleAccept = async () => {
    if (!matchData) return;

    setIsAccepting(true);
    try {
      await acceptMatch(lobbyName, matchData.uuid);
      // Continue polling to check if partner also accepted
    } catch (err) {
      console.error('Failed to accept match:', err);
      setIsAccepting(false);
      setRejectionReason('timeout');
      setLobbyState('rejected');
    }
  };

  const handleReject = async () => {
    if (!matchData) return;

    try {
      await rejectMatch(lobbyName, matchData.uuid);
    } catch (err) {
      console.error('Failed to reject match:', err);
    }
    mutateRCState()
    setRejectionReason('user_rejected');
    setLobbyState('rejected');
  };

  const handleReturnToLobby = () => {
    mutateRCState()
    setLobbyState('idle');
    setIsAccepting(false);
    setMatchData(null);
  };

  const handleCloseLobby = async () => {
    try {
      await exitLobby(lobbyName);
    } catch (err) {
      console.error('Failed to exit lobby:', err);
    }
    setLobbyState('idle');
    setIsAccepting(false);
    setMatchData(null);
    onCancel();
  };

  const handleBothAccepted = async () => {
    if (!matchData) return;

    try {
      // Call room authentication API
      const roomData = await authenticateRoom(lobbyName, matchData.uuid);

      // Set up call connection with room data
      connectToCall({
        userId: matchData.partner.id,
        chatId: roomData.chat?.uuid || '',
        token: roomData.token,
        livekitServerUrl: roomData.server_url,
      });

      // Navigate to the random call screen for the partner
      navigate(getCallRoute(matchData.partner.id));

      // Close the lobby modal
      onCancel();
    } catch (err) {
      console.error('Failed to authenticate room:', err);
      // On error, show as rejected
      setRejectionReason('timeout');
      setLobbyState('rejected');
      setIsAccepting(false);
    }
  };

  switch (lobbyState) {
    case 'partner_found':
      if (!matchData) return <RandomCallSetup onCancel={handleCancel} onJoinComplete={handleJoinComplete} hasJoinedLobby={hasJoinedLobby} />;
      return (
        <PartnerProposal
          matchData={matchData}
          onAccept={handleAccept}
          onReject={handleReject}
          isAccepting={isAccepting}
        />
      );
    case 'timeout':
      return <SessionsExpiredView onClose={handleCloseLobby} />;
    case 'rejected':
      return (
        <RejectedView
          onReturnToLobby={handleReturnToLobby}
          reason={rejectionReason}
        />
      );
    default:
      return <RandomCallSetup onCancel={handleCancel} onJoinComplete={handleJoinComplete} hasJoinedLobby={hasJoinedLobby} />;
  }
};

export default RandomCallsLobby;
