import { useEffect, useState } from 'react';

import {
  ButtonSizes,
  Loading,
  LoadingSizes,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { UPCOMING_LOBBIES_ENDPOINT } from '../../../api/endpoints';
import { exitLobby } from '../../../api/randomCalls';
import { COMMUNITY_EVENT_FREQUENCIES } from '../../../constants/index';
import { type UpcomingLobbyItem } from '../../../helpers/randomCalls';
import useSystemModalBlocker from '../../../hooks/useSystemModalBlocker';
import randomCallsImage from '../../../images/random-calls-image.png';
import {
  getAppAbsoluteRoute,
  RANDOM_CALLS_ROUTE,
} from '../../../router/routes';
import { OnlineCircle } from '../../atoms/OnlineIndicator';
import PanelImage from '../../atoms/PanelImage';
import { Schedule } from '../../atoms/Schedule';
import CallHistory from '../../blocks/CallHistory/CallHistory';
import Instructions from '../../blocks/Instructions/Instructions';
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
  RandomCallsAccordionContentWrapper,
  RandomCallsInstructions,
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
  {
    heading: 'random_calls.step_4.heading',
    description: 'random_calls.step_4.description',
  },
];

interface RandomCallLobby {
  uuid: string;
  name: string;
  status: boolean;
  start_time: string;
  end_time: string;
  active_users_count: number;
}

const RandomCalls = ({ lobbyData }: { lobbyData?: RandomCallLobby }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    data: upcomingLobbies,
    isLoading: lobbyLoading,
    mutate,
  } = useSWR<UpcomingLobbyItem[]>(UPCOMING_LOBBIES_ENDPOINT);

  const location = useLocation();
  const navigate = useNavigate();
  const active = lobbyData?.status ?? false;
  const [lobbyOpen, setLobbyOpen] = useState(false);
  const [lobbySessionKey, setLobbySessionKey] = useState(0);

  // Format time from ISO string to HH:MM
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startTime = formatTime(lobbyData?.start_time);
  const endTime = formatTime(lobbyData?.end_time);

  useEffect(() => {
    mutate();
  }, [lobbyData?.status, mutate]);

  useEffect(() => {
    const state = location.state as { openLobby?: boolean } | null;
    if (!state?.openLobby) return;
    setLobbySessionKey(current => current + 1);
    setLobbyOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useSystemModalBlocker(lobbyOpen, 'random-calls');

  const openLobbyFresh = () => {
    // @tbscode TODO tempo fix forecefuly reset lobby cache by reloading everything on re-enters
    setLobbySessionKey(prev => prev + 1);
    setLobbyOpen(true);
  };

  const onJoinLobby = () => {
    openLobbyFresh();
  };

  const onCloseLobby = async () => {
    setLobbyOpen(false);
    if (lobbyData?.uuid) {
      try {
        await exitLobby(lobbyData.uuid);
      } catch (error) {
        console.error('Failed to exit lobby:', error);
      }
    }
  };

  return (
    <Container>
      <Modal
        open={lobbyOpen}
        onClose={onCloseLobby}
        closeOnBackdropClick={false}
      >
        {lobbyData?.uuid && (
          <RandomCallsLobby
            key={`${lobbyData.uuid}-${lobbySessionKey}`}
            lobbyUuid={lobbyData.uuid}
            onCancel={onCloseLobby}
            activeUsersCount={lobbyData.active_users_count}
          />
        )}
      </Modal>
      <InnerContainer>
        <InfoPanel>
          <PanelImage
            breakpoint={theme.breakpoints.xlarge}
            src={randomCallsImage}
            label={t('random_calls.image_label')}
            alt="random calls"
          />
          <InfoPanelText>
            <Text bold tag="h2" type={TextTypes.Heading4}>
              {t('random_calls.title')}
            </Text>
            <Text>{t('random_calls.description')}</Text>
            {lobbyLoading ? (
              <Loading size={LoadingSizes.Medium} />
            ) : (
              <>
                <div>
                  <Text bold type={active ? TextTypes.Body4 : TextTypes.Body5}>
                    {t(
                      active
                        ? 'random_calls.active_heading'
                        : 'random_calls.inactive_heading',
                    )}
                  </Text>
                  {active && startTime && endTime && (
                    <Text type={TextTypes.Body4}>
                      {t('random_calls.active_time', { startTime, endTime })}
                    </Text>
                  )}
                </div>

                {active ? (
                  <ActiveUsers>
                    {(lobbyData?.active_users_count ?? 0) > 1 && (
                      <>
                        <OnlineCircle />
                        <Text bold>
                          {t('random_calls.active_users', {
                            count: lobbyData?.active_users_count,
                          })}
                        </Text>
                      </>
                    )}
                  </ActiveUsers>
                ) : (
                  <Schedule
                    title={t('random_calls.schedule_heading')}
                    description={t('random_calls.schedule_description')}
                    sessions={upcomingLobbies ?? []}
                    listMaxHeight={260}
                    addToCalendar={{
                      title: t('random_calls.title'),
                      description: t('random_calls.description'),
                      frequency: COMMUNITY_EVENT_FREQUENCIES.once,
                      durationInMinutes: 60,
                      link: getAppAbsoluteRoute(RANDOM_CALLS_ROUTE),
                      size: ButtonSizes.Small,
                    }}
                  />
                )}
                {active && (
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
                )}
              </>
            )}
          </InfoPanelText>
        </InfoPanel>
        <CallHistoryDesktop />
      </InnerContainer>
      <RandomCallsInstructions
        title={t('random_calls.instructions_title')}
        items={instructions}
      />
      <RandomCallsAccordion
        ContentWrapper={RandomCallsAccordionContentWrapper}
        defaultValue={t('random_calls.instructions_title')}
        items={[
          {
            content: <Instructions items={instructions} />,
            header: t('random_calls.instructions_title'),
          },
          { content: <CallHistory />, header: t('call_history.title') },
        ]}
      />
    </Container>
  );
};

export default RandomCalls;
