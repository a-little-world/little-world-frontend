import { apiFetch } from './helpers.ts';
import Cookies from 'js-cookie';
import { BACKEND_URL } from '../ENVIRONMENT.js';


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
  const url = `${BACKEND_URL}/api/livekit/review`;

  const data = {
    live_session_id: liveSessionId || null,
    rating: rating,
    review: review || '',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken') || '',
      },
      body: JSON.stringify(data),
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
