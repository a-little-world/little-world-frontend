import { apiFetch } from './helpers';

export const joinLobby = (lobbyName = 'default') =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/join`, {
    method: 'POST',
  });

export const exitLobby = (lobbyName = 'default') =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/exit`, {
    method: 'POST',
  });

export const getLobbyStatus = (lobbyName = 'default') =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/status`, {
    method: 'GET',
  });

export const acceptMatch = (lobbyName: string, matchUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/accept`, {
    method: 'POST',
  });

export const rejectMatch = (lobbyName: string, matchUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/reject`, {
    method: 'POST',
  });

export const authenticateRoom = (lobbyName: string, matchUuid: string) =>
  apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/room_authenticate`, {
    method: 'POST',
  });

export const getAcceptedRandomCallMatches = () =>
  apiFetch('/api/random_calls/history', {
    method: 'GET',
  });

export const requestRandomCallMatch = (matchUuid: string) =>
  apiFetch(`/api/random_calls/history/${matchUuid}/request_match`, {
    method: 'POST',
  });

export const submitRandomCallsFeedback = async (feedback: any) => {
  try {
    return await apiFetch('/api/random-calls/submit-feedback/', {
      method: 'POST',
      body: {
        feedback,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
