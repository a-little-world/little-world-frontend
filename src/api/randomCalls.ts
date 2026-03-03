import { apiFetch } from './helpers';

export const joinLobby = (lobbyUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyUuid}/join`, {
    method: 'POST',
  });

export const exitLobby = (lobbyUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyUuid}/exit`, {
    method: 'POST',
  });

export const getLobbyStatus = (lobbyUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyUuid}/status`, {
    method: 'GET',
  });

export const acceptMatch = (lobbyUuid: string, matchUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyUuid}/match/${matchUuid}/accept`, {
    method: 'POST',
  });

export const rejectMatch = (lobbyUuid: string, matchUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyUuid}/match/${matchUuid}/reject`, {
    method: 'POST',
  });

export const authenticateRoom = (lobbyUuid: string, matchUuid: string) =>
  apiFetch(
    `/api/random_calls/lobby/${lobbyUuid}/match/${matchUuid}/room_authenticate`,
    {
      method: 'POST',
    },
  );

export const endRandomCallMatch = (matchUuid: string) =>
  apiFetch(`/api/random_calls/match/${matchUuid}/end_call`, {
    method: 'POST',
  });

export const getAcceptedRandomCallMatches = () =>
  apiFetch('/api/random_calls/user/history', {
    method: 'GET',
  });

export const requestRandomCallMatch = ({
  matchId,
  onSuccess,
  onError,
}: {
  matchId: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  apiFetch(`/api/random_calls/user/history/${matchId}/request_match`, {
    method: 'POST',
  })
    .then(() => onSuccess())
    .catch(err => onError(err));
};
