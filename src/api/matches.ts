import { apiFetch } from './helpers';

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
  denyReason,
  onError,
  onSuccess,
}: {
  matchId: string;
  acceptDeny: boolean;
  denyReason?: string;
  onError: (error: any) => void;
  onSuccess: (result: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/user/match/confirm_deny/`, {
      method: 'POST',
      body: {
        unconfirmed_match_hash: matchId,
        confirm: acceptDeny,
        deny_reason: denyReason,
      },
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const unmatch = async ({ reason, matchId, onSuccess, onError }) => {
  try {
    const result = await apiFetch(`/api/matching/unmatch/`, {
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

export const reportIssue = async ({
  keywords,
  kind,
  matchId,
  onError,
  onSuccess,
  origin,
  reason,
  reportedUserId,
}: {
  keywords?: [string];
  kind?: string;
  matchId?: string;
  onError: (error: any) => void;
  onSuccess: (result: any) => void;
  origin?: string;
  reason: string;
  reportedUserId?: string | null;
}) => {
  try {
    const body: {
      keywords?: [string];
      kind?: string;
      match_id?: string;
      message?: string;
      reason?: string;
      origin?: string;
      reported_user_id?: string;
    } = {};

    if (matchId) {
      body.match_id = matchId;
      body.reason = reason;
    } else {
      body.message = reason;
    }

    if (reportedUserId) {
      body.reported_user_id = reportedUserId;
    }
    if (kind) {
      body.kind = kind;
    }
    if (keywords) {
      body.keywords = keywords;
    }
    if (origin) {
      body.origin = origin;
    }

    const url = matchId ? '/api/matching/report_match/' : '/api/help_message/';

    const result = await apiFetch(url, {
      method: 'POST',
      body,
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
      `/api/matches/?page=${page}&page_size=${pageItems}`,
      {
        method: 'GET',
      },
    );
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
