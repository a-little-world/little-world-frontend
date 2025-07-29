import { apiFetch } from './helpers.ts';

// eslint-disable-next-line import/prefer-default-export
export const archieveQuestion = async ({
  uuid,
  archive = true,
  onSuccess,
  onError,
}: {
  uuid: string;
  archive: boolean;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
}) => {
  try {
    const result = await apiFetch(`/api/user/archive_card/`, {
      method: 'POST',
      useTagsOnly: true,
      body: { uuid, archive },
    });
    onSuccess(result);
  } catch (error) {
    onError(error);
  }
};
