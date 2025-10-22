import { apiFetch } from './helpers';

export const joinLobby = async ({ onSuccess }: { onSuccess: () => void }) => {
  try {
    // const response = await apiFetch('/api/random-calls/join-lobby/', {
    //   method: 'POST',
    // });
    onSuccess();
  } catch (error) {
    console.error(error);
  }
};

export const submitRandomCallsFeedback = async () => {
  try {
    const response = await apiFetch('/api/random-calls/submit-feedback/', {
      method: 'POST',
      body: {
        feedback,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
