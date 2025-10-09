import { apiFetch } from './helpers';

// eslint-disable-next-line import/prefer-default-export
export const fetchProfile = async ({ userId }: { userId: string }) =>
  apiFetch(`/api/profile/${userId}/match`);

export const updateUserSearchState = async ({
  updatedState,
  onSuccess,
  onError,
}) => {
  try {
    const result = await apiFetch(`/api/user/search_state/${updatedState}`, {
      method: 'POST',
      useTagsOnly: true,
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};

export const deleteAccount = async ({ onSuccess, onError }) => {
  try {
    const result = await apiFetch(`/api/user/delete_account/`, {
      method: 'POST',
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
