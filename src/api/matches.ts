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

export const reportMatch = async ({
  reason,
  matchId,
  reportType,
  keywords,
  onError,
  onSuccess,
}: {
  reason: string;
  matchId: string;
  reportType?: string;
  keywords?: string | null;
  onError: (error: any) => void;
  onSuccess: (result: any) => void;
}) => {
  try {
    const body: {
      match_id: string;
      reason: string;
      report_type?: string;
      keywords?: string;
    } = {
      match_id: matchId,
      reason,
    };
    if (reportType) {
      body.report_type = reportType;
    }
    if (keywords) {
      body.keywords = keywords;
    }
    const result = await apiFetch(`/api/matching/report/`, {
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
