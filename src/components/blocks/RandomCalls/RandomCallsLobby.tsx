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
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PreJoin } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr';
import ProfileImage from '../../atoms/ProfileImage';
import { CallSetupCard } from '../Calls/CallSetup';

type LobbyState = 'idle' | 'partner_found' | 'timeout' | 'rejected';

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

const mockPartner = {
  name: 'Sarah',
  image: 'https://via.placeholder.com/120',
  description: 'Language enthusiast who loves outdoor activities and cooking.',
  interests: ['Hiking', 'Cooking', 'Reading', 'Photography'],
  image_type: 'image',
};

const RandomCallSetup = ({ onCancel }: { onCancel: () => void }) => {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;

  return (
    <CallSetupCard $hideJoinBtn>
      <CardHeader>{t('random_calls.lobby_title')}</CardHeader>
      <CardContent>
        <Text center>{t('random_calls.lobby_description')}</Text>
        <PreJoin
          camLabel={t('pcs_camera_label')}
          micLabel={t('pcs_mic_label')}
          joinLabel={t('pcs_btn_join_call')}
          // onError={handleError}
          // onSubmit={handleJoin}
          // onValidate={handleValidate}
          defaults={{ username }}
          persistUserChoices={false}
        />
      </CardContent>
      <CardFooter align="center">
        <Button
          appearance={ButtonAppearance.Secondary}
          onClick={onCancel}
          size={ButtonSizes.Stretch}
        >
          {t('random_calls.lobby_cancel_seach')}
        </Button>
      </CardFooter>
    </CallSetupCard>
  );
};

const PartnerProposal = ({
  onAccept,
  onReject,
  isAccepting = false,
}: {
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

  return (
    <RelativeCard>
      <LoadingOverlay $visible={isAccepting}>
        <Spinner />
        <Text type={TextTypes.Body3} bold>
          {t('random_calls.waiting_on_partner_response', {
            name: mockPartner.name,
          })}
        </Text>
      </LoadingOverlay>

      <CardHeader>{t('random_calls.partner_found')}</CardHeader>
      <CardContent>
        <PartnerInfo>
          <ProfileImage
            image={mockPartner.image}
            imageType={mockPartner.image_type}
            circle
            size="small"
          />
          <PartnerDetails>
            <Text type={TextTypes.Body4} bold>
              {mockPartner.name}
            </Text>
            <Text color="secondary">{mockPartner.description}</Text>
            <Tags content={mockPartner.interests} />
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
  reason: 'user_rejected' | 'partner_rejected' | 'timeout';
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
  const [lobbyState, setLobbyState] = useState<LobbyState>('idle');
  const [isAccepting, setIsAccepting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<
    'user_rejected' | 'partner_rejected' | 'timeout'
  >('user_rejected');

  const handleCancel = () => {
    // setLobbyState('idle');
    onCancel();
  };

  const handleAccept = () => {
    setIsAccepting(true);
    // Simulate connection or timeout
    setTimeout(() => {
      setIsAccepting(false);
      // For demo, randomly decide if it times out or partner rejects
      const shouldTimeout = Math.random() > 0.5;
      if (shouldTimeout) {
        setLobbyState('timeout');
      } else {
        setRejectionReason('partner_rejected');
        setLobbyState('rejected');
      }
    }, 5000);
  };

  const handleReject = () => {
    setRejectionReason('user_rejected');
    setLobbyState('rejected');
  };

  const handleReturnToLobby = () => {
    setLobbyState('idle');
    setIsAccepting(false);
  };

  const handleCloseLobby = () => {
    // This would close the modal in the parent component
    setLobbyState('idle');
    setIsAccepting(false);
  };

  // For testing, simulate finding a partner after 3 seconds
  useEffect(() => {
    if (lobbyState === 'idle') {
      const timer = setTimeout(() => {
        setLobbyState('partner_found');
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [lobbyState]);

  switch (lobbyState) {
    case 'partner_found':
      return (
        <PartnerProposal
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
      return <RandomCallSetup onCancel={handleCancel} />;
  }
};

export default RandomCallsLobby;
