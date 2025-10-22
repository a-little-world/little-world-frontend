import {
  Button,
  ButtonAppearance,
  CalendarIcon,
  CardContent,
  CardFooter,
  CardHeader,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PreJoin } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import useSWR from 'swr';

import { USER_ENDPOINT } from '../../../features/swr';
import { CallSetupCard } from '../../blocks/Calls/CallSetup';

type LobbyState =
  | 'idle'
  | 'partner_found'
  | 'accepting'
  | 'timeout'
  | 'rejected';

const ProposalCard = styled(CallSetupCard)`
  max-width: 500px;
`;

const PartnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium} 0;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.color.border.subtle};
`;

const PartnerDetails = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xsmall};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const InterestTag = styled.span`
  background: ${({ theme }) => theme.color.surface.secondary};
  padding: ${({ theme }) => theme.spacing.xxsmall}
    ${({ theme }) => theme.spacing.small};
  border-radius: 16px;
  font-size: 14px;
`;

const Timer = styled.div`
  background: ${({ theme }) => theme.color.surface.accent};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 8px;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.medium} 0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 10;
`;

const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.color.border.subtle};
  border-top: 4px solid ${({ theme }) => theme.color.primary.base};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

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

const FlexCardFooter = styled(CardFooter)`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

const TimeoutContent = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
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

const RejectionContent = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const IllustrationPlaceholder = styled.div`
  width: 200px;
  height: 200px;
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
`;

// Mock partner data
const mockPartner = {
  name: 'Sarah Schmidt',
  avatar: 'https://via.placeholder.com/120', // Placeholder avatar
  description: 'Language enthusiast who loves outdoor activities and cooking.',
  interests: ['Hiking', 'Cooking', 'Reading', 'Photography'],
};

const RandomCallSetup = ({ onCancel }: { onCancel: () => void }) => {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const username = user?.profile?.first_name;

  return (
    <CallSetupCard>
      <CardHeader>{t('random_calls.lobby_title')}</CardHeader>
      <CardContent>
        <Text>{t('random_calls.lobby_description')}</Text>
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
      <CardFooter>
        <Button appearance={ButtonAppearance.Secondary} onClick={onCancel}>
          {t('random_calls.lobby_cancel_seach')}
        </Button>
      </CardFooter>
    </CallSetupCard>
  );
};

const PartnerProposal = ({
  onAccept,
  onReject,
}: {
  onAccept: () => void;
  onReject: () => void;
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
      <CardHeader>
        <Text type={TextTypes.Heading3}>{t('random_calls.partner_found')}</Text>
      </CardHeader>
      <CardContent>
        <PartnerInfo>
          <Avatar src={mockPartner.avatar} alt={mockPartner.name} />
          <PartnerDetails>
            <Text type={TextTypes.Heading4} bold>
              {mockPartner.name}
            </Text>
            <Text type={TextTypes.Body4} color="secondary">
              {mockPartner.description}
            </Text>
            <InterestsList>
              {mockPartner.interests.map(interest => (
                <InterestTag key={interest}>{interest}</InterestTag>
              ))}
            </InterestsList>
          </PartnerDetails>
        </PartnerInfo>

        <Timer>
          <Text type={TextTypes.Body3} bold>
            {t('random_calls.time_to_accept')}: {timeLeft}s
          </Text>
          <Text type={TextTypes.Body5}>{t('random_calls.accept_prompt')}</Text>
        </Timer>
      </CardContent>
      <FlexCardFooter>
        <Button appearance={ButtonAppearance.Secondary} onClick={onReject}>
          {t('random_calls.reject')}
        </Button>
        <Button onClick={onAccept}>{t('random_calls.accept')}</Button>
      </FlexCardFooter>
    </RelativeCard>
  );
};

const AcceptingView = () => (
  <RelativeCard>
    <LoadingOverlay>
      <LoadingSpinner />
    </LoadingOverlay>
    <CardContent style={{ padding: '100px', opacity: 0.3 }}>
      <Text>Loading...</Text>
    </CardContent>
  </RelativeCard>
);

const TimeoutView = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const randomCallsSchedule = [
    'Mittwoch – 18:00–20:00 Uhr',
    'Freitag – 10:00–12:00 Uhr',
  ];

  return (
    <ProposalCard>
      <CardHeader>
        <Text type={TextTypes.Heading3}>{t('random_calls.timeout_title')}</Text>
      </CardHeader>
      <CardContent>
        <TimeoutContent>
          <Text type={TextTypes.Body3}>
            {t('random_calls.timeout_description')}
          </Text>

          <Schedule>
            <ScheduleHeader>
              <CalendarIcon label="Calendar" width={20} height={20} />
              <Text type={TextTypes.Body3} bold>
                {t('random_calls.next_sessions')}
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
        </TimeoutContent>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>{t('random_calls.close_lobby')}</Button>
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
        return 'random_calls.you_rejected_title';
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
        return 'random_calls.you_rejected_description';
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
      <CardContent>
        <RejectionContent>
          <IllustrationPlaceholder>😔</IllustrationPlaceholder>
          <Text type={TextTypes.Heading3} bold>
            {t(getTitleKey())}
          </Text>
          <Text type={TextTypes.Body3}>{t(getDescriptionKey())}</Text>
        </RejectionContent>
      </CardContent>
      <CardFooter>
        <Button onClick={onReturnToLobby}>
          {t('random_calls.return_to_lobby')}
        </Button>
      </CardFooter>
    </ProposalCard>
  );
};

const RandomCallsLobby = () => {
  const [lobbyState, setLobbyState] = useState<LobbyState>('idle');
  const [rejectionReason, setRejectionReason] = useState<
    'user_rejected' | 'partner_rejected' | 'timeout'
  >('user_rejected');

  const handleCancel = () => {
    setLobbyState('idle');
  };

  const handleAccept = () => {
    setLobbyState('accepting');
    // Simulate connection or timeout
    setTimeout(() => {
      // For demo, randomly decide if it times out or partner rejects
      const shouldTimeout = Math.random() > 0.5;
      if (shouldTimeout) {
        setLobbyState('timeout');
      } else {
        setRejectionReason('partner_rejected');
        setLobbyState('rejected');
      }
    }, 2000);
  };

  const handleReject = () => {
    setRejectionReason('user_rejected');
    setLobbyState('rejected');
  };

  const handleReturnToLobby = () => {
    setLobbyState('idle');
  };

  const handleCloseLobby = () => {
    // This would close the modal in the parent component
    setLobbyState('idle');
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
        <PartnerProposal onAccept={handleAccept} onReject={handleReject} />
      );
    case 'accepting':
      return <AcceptingView />;
    case 'timeout':
      return <TimeoutView onClose={handleCloseLobby} />;
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
