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
    const result = await apiFetch(`api/livekit/authenticate`, {
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
  onSuccess,
  onError,
}: {
  liveSessionId?: string;
  rating: number;
  review?: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const response = await apiFetch(`api/livekit/review`, {
      method: 'POST',
      body: {
        live_session_id: liveSessionId || null,
        rating: rating,
        review: review || '',
      },
    });

    if (response.ok) {
      const responseBody = await response.json();
      onSuccess(responseBody);
    } else {
      const errorBody = await response.json();
      onError(errorBody);
    }
  } catch (error) {
    onError(error);
  }
}
