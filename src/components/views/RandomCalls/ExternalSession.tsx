import { useState } from 'react';

import {
  Loading,
  LoadingSizes,
  Modal,
  Text,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import { getRandomCallLobbyEndpoint } from '../../../api/endpoints';
import { exitLobby } from '../../../api/randomCalls';
import useSystemModalBlocker from '../../../hooks/useSystemModalBlocker';
import { getAppRandomCallAfterRoute } from '../../../router/routes';
import RandomCallsLobby from '../../blocks/RandomCalls/RandomCallsLobby';
import { RandomCallLobbyDetails } from '../ExternalRandomCalls/guestSession';
import LobbyCard from '../ExternalRandomCalls/LobbyCard';
import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';
import {
  CardColumn,
  Page,
  SessionInstructions,
  StatusPane,
} from './ExternalSession.styles';
import { randomCallInstructions } from './RandomCalls';

const ExternalSession = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const {
    data: lobby,
    error,
    isLoading,
  } = useSWR<RandomCallLobbyDetails>(
    lobbyId ? getRandomCallLobbyEndpoint(lobbyId) : null,
  );
  const [lobbyOpen, setLobbyOpen] = useState(false);
  const [lobbySessionKey, setLobbySessionKey] = useState(0);

  useSystemModalBlocker(lobbyOpen, 'external-session');

  const openLobby = () => {
    setLobbySessionKey(current => current + 1);
    setLobbyOpen(true);
  };

  const onCloseLobby = async () => {
    setLobbyOpen(false);
    if (!lobby?.uuid) return;
    try {
      await exitLobby(lobby.uuid);
    } catch {
      // Leaving before a join is recorded is expected.
    }
  };

  if (isLoading) {
    return (
      <StatusPane>
        <Loading size={LoadingSizes.Medium} />
      </StatusPane>
    );
  }

  if (error || !lobby?.start_time || !lobby.end_time) {
    return (
      <StatusPane>
        <Text>{t('external_random_calls.unavailable')}</Text>
      </StatusPane>
    );
  }

  const startsAt = new Date(lobby.start_time);
  const endsAt = new Date(lobby.end_time);

  return (
    <Page>
      <Modal
        open={lobbyOpen}
        onClose={onCloseLobby}
        closeOnBackdropClick={false}
      >
        <RandomCallsLobby
          key={`${lobby.uuid}-${lobbySessionKey}`}
          lobbyUuid={lobby.uuid}
          onCancel={onCloseLobby}
          activeUsersCount={lobby.active_users_count}
          exitPath={lobbyId ? getAppRandomCallAfterRoute(lobbyId) : undefined}
        />
      </Modal>
      <CardColumn>
        <LobbyCard
          isGuest={false}
          startsAt={startsAt}
          endsAt={endsAt}
          timeZone={PARTNER_EVENT_TIME_ZONE}
          onStart={openLobby}
        />
      </CardColumn>
      <SessionInstructions
        title={t('random_calls.instructions_title')}
        items={randomCallInstructions}
      />
    </Page>
  );
};

export default ExternalSession;
