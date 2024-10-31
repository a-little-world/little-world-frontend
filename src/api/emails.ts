import { apiFetch } from './helpers.ts';

// eslint-disable-next-line import/prefer-default-export
export const updateEmailPreferences = async ({
  token,
  onSuccess,
  onError,
}: {
  token: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/matching/emails/update-preferences`, {
      method: 'POST',
      body: {
        token,
      },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
