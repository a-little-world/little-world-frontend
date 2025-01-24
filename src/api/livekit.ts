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
  rating,
  review,
  onSuccess,
  onError,
}: {
  rating: number;
  review?: string;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`api/livekit/review`, {
      method: 'POST',
      useTagsOnly: true,
      body: { rating, review },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
