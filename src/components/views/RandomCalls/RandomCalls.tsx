import {
  ButtonSizes,
  CalendarIcon,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { exitLobby, joinLobby } from '../../../api/randomCalls';
import { RANDOM_CALL_LOBBY_ENDPOINT } from '../../../features/swr/index';
import randomCallsImage from '../../../images/item info.png';
import { OnlineCirlce } from '../../atoms/OnlineIndicator';
import PanelImage from '../../atoms/PanelImage';
import CallHistory from '../../blocks/CallHistory/CallHistory';
import Instructions from '../../blocks/Instructions/Instructions';
import PostRandomCallsFlow from '../../blocks/RandomCalls/PostRandomCallsFlow';
import RandomCallsLobby from '../../blocks/RandomCalls/RandomCallsLobby';
import {
  ActiveUsers,
  CallHistoryDesktop,
  Container,
  InfoPanel,
  InfoPanelText,
  InnerContainer,
  JoinButton,
  RandomCallsAccordion,
  RandomCallsInstructions,
  Schedule,
  ScheduleHeading,
  ScheduleList,
} from './RandomCalls.styles';

const instructions = [
  {
    heading: 'random_calls.step_1.heading',
    description: 'random_calls.step_1.description',
  },
  {
    heading: 'random_calls.step_2.heading',
    description: 'random_calls.step_2.description',
  },
  {
    heading: 'random_calls.step_3.heading',
    description: 'random_calls.step_3.description',
  },
];

const randomCallsSchedule = [
  'Mittwoch – 18:00–20:00 Uhr',
  'Freitag – 10:00–12:00 Uhr',
];

interface RandomCallLobby {
  name: string;
  status: boolean;
  start_time: string;
  end_time: string;
  active_users_count: number;
}

const RandomCalls = () => {
  const { t } = useTranslation();
  const { data: lobbyData } = useSWR<RandomCallLobby>(RANDOM_CALL_LOBBY_ENDPOINT);
  const active = lobbyData?.status ?? false;
  const [lobbyOpen, setLobbyOpen] = useState(false);
  const [callEnded, setCallEnded] = useState(false); // TODO: This should be set based on actual call end event

  // Format time from ISO string to HH:MM
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const startTime = formatTime(lobbyData?.start_time);
  const endTime = formatTime(lobbyData?.end_time);

  const onJoinLobby = async () => {
    try {
      await joinLobby();
      setLobbyOpen(true);
    } catch (error) {
      console.error('Failed to join lobby:', error);
    }
  };

  const onCloseLobby = async () => {
    try {
      await exitLobby();
    } catch (error) {
      console.error('Failed to exit lobby:', error);
    }
    setLobbyOpen(false);
  };

  const handleReturnToLobby = () => {
    setCallEnded(false);
    setLobbyOpen(true);
  };

  const handleClosePostCall = () => {
    setCallEnded(false);
  };

  return (
    <Container>
      <Modal open={lobbyOpen} onClose={onCloseLobby}>
        <RandomCallsLobby onCancel={onCloseLobby} />
      </Modal>

      <Modal open={callEnded} onClose={handleClosePostCall}>
        <PostRandomCallsFlow
          onReturnToStart={handleClosePostCall}
          onReturnToLobby={handleReturnToLobby}
        />
      </Modal>
      <InnerContainer>
        <InfoPanel>
          <PanelImage
            src={randomCallsImage}
            label={t('random_calls.image_label')}
            alt="random calls"
          />
          <InfoPanelText>
            <Text bold tag="h2" type={TextTypes.Body2}>
              {t('random_calls.title')}
            </Text>
            <Text>{t('random_calls.description')}</Text>
            <Text bold type={TextTypes.Body3}>
              {t(
                active
                  ? 'random_calls.active_heading'
                  : 'random_calls.inactive_heading',
                { from: startTime || '18:00', to: endTime || '20:00' },
              )}
            </Text>
            {active ? (
              <ActiveUsers>
                <OnlineCirlce />
                <Text bold>
                  {t('random_calls.active_users', { count: lobbyData?.active_users_count ?? 0 })}
                </Text>
              </ActiveUsers>
            ) : (
              <Schedule>
                <ScheduleHeading>
                  <CalendarIcon label="Calendar icon" width={16} height={16} />
                  <Text bold>{t('random_calls.schedule_heading')}</Text>
                </ScheduleHeading>
                <ScheduleList>
                  {randomCallsSchedule.map(item => (
                    <Text key={item} tag="li">
                      {item}
                    </Text>
                  ))}
                </ScheduleList>
              </Schedule>
            )}
            <JoinButton
              disabled={!active}
              size={ButtonSizes.Small}
              onClick={onJoinLobby}
            >
              {t(
                active
                  ? 'random_calls.start_btn'
                  : 'random_calls.start_btn_disabled',
              )}
            </JoinButton>
          </InfoPanelText>
        </InfoPanel>
        <CallHistoryDesktop />
      </InnerContainer>
      <RandomCallsInstructions
        title={t('random_calls.instructions_title')}
        items={instructions}
      />
      <RandomCallsAccordion
        items={[
          {
            content: <Instructions items={instructions} />,
            header: 'Instructions',
          },
          { content: <CallHistory />, header: 'Call History' },
        ]}
      />
    </Container>
  );
};

export default RandomCalls;
