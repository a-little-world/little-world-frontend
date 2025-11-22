import { apiFetch } from './helpers';

export const joinLobby = async (lobbyName = 'default') => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/join`, {
    method: 'POST',
  });
};

export const exitLobby = async (lobbyName = 'default') => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/exit`, {
    method: 'POST',
  });
};

export const getLobbyStatus = async (lobbyName = 'default') => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/status`, {
    method: 'GET',
  });
};

export const acceptMatch = async (lobbyName: string, matchUuid: string) => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/accept`, {
    method: 'POST',
  });
};

export const rejectMatch = async (lobbyName: string, matchUuid: string) => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/reject`, {
    method: 'POST',
  });
};

export const authenticateRoom = async (lobbyName: string, matchUuid: string) => {
  return await apiFetch(`/api/random_calls/lobby/${lobbyName}/match/${matchUuid}/room_authenticate`, {
    method: 'POST',
  });
};

export const submitRandomCallsFeedback = async (feedback: any) => {
  try {
    const response = await apiFetch('/api/random-calls/submit-feedback/', {
      method: 'POST',
      body: {
        feedback,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
