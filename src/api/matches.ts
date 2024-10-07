import { apiFetch } from './helpers.ts';

export const fetchUserMatch = async ({ userId, onError, onSuccess }) => {
  try {
    const result = await apiFetch(`/api/profile/${userId}/match`, {
      method: 'GET',
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const confirmMatch = async ({ userHash, onError, onSuccess }) => {
  /** TODO: for consistency this api should also accept a matchId in the backend rather than userHashes ... */
  try {
    const result = await apiFetch(`/api/user/confirm_match/`, {
      method: 'POST',
      body: { matches: [userHash] },
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const partiallyConfirmMatch = async ({
  matchId,
  acceptDeny,
  onError,
  onSuccess,
}) => {
  try {
    const result = await apiFetch(`/api/user/match/confirm_deny/`, {
      method: 'POST',
      body: {
        unconfirmed_match_hash: matchId,
        confirm: acceptDeny,
      },
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const unmatch = async ({ reason, userHash, onSuccess, onError }) => {
  try {
    const result = await apiFetch(`/api/user/unmatch_self/`, {
      method: 'POST',
      body: {
        other_user_hash: userHash,
        reason,
      },
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const reportMatch = async ({ reason, matchId, onError, onSuccess }) => {
  try {
    const result = await apiFetch(`/api/matching/report/`, {
      method: 'POST',
      body: {
        match_id: matchId,
        reason,
      },
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const updateMatchData = async ({
  page,
  pageItems,
  onError,
  onSuccess,
}) => {
  try {
    const result = await apiFetch(
      `/api/matches/confirmed/?page=${page}&itemsPerPage=${pageItems}`,
      {
        method: 'GET',
      },
    );
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
