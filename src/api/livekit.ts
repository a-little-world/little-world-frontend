import { apiFetch } from './helpers.ts';

export const requestVideoAccessToken = async ({
  partnerId,
  onSuccess,
  onError,
}: {
  partnerId: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/livekit/authenticate`, {
      method: 'POST',
      useTagsOnly: true,
      body: { partner_id: partnerId },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const randomMatchPairing = async ({
  userId,
  onSuccess,
  onError,
}: {
  userId: string,
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/random_calls/match_random_pair`, {
      method: 'POST',
      useTagsOnly: true,
      body: { userId: userId },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const requestRandomToken = async ({
  matchId,
  onSuccess,
  onError,
}: {
  matchId: string | any;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/random_calls/get_token_random_call`, {
      method: 'POST',
      useTagsOnly: true,
      body: { matchId: matchId },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const joinLobby = async ({
  userId,
  onSuccess,
  onError,
}: {
  userId: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/random_calls/join_lobby`, {
      method: 'POST',
      useTagsOnly: true,
      body: { userId: userId },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
}

export const exitLobby = async ({
  userId,
  onSuccess,
  onError,
}: {
  userId: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/random_calls/exit_lobby`, {
      method: 'POST',
      useTagsOnly: true,
      body: { userId: userId },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
}

export const submitCallFeedback = async ({
  liveSessionId,
  rating,
  review,
  reviewId,
  onSuccess,
  onError,
}: {
  liveSessionId?: string;
  rating: number;
  review?: string;
  reviewId?: number;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const response = await apiFetch(`/api/livekit/review`, {
      method: 'POST',
      body: {
        live_session_id: liveSessionId || null,
        review_id: reviewId || null,
        rating,
        review: review || '',
      },
    });
    onSuccess(response);
  } catch (error) {
    onError(error);
  }
};
