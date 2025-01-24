import { apiFetch } from './helpers.ts';
import Cookies from 'js-cookie';

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
        rating: rating,
        review: review || '',
      },
    });
    onSuccess(response);
  } catch (error) {
    onError(error);
  }
};
