import { apiFetch } from '../../api/helpers';

export const getUserNotes = async () => apiFetch(`/api/user-notes/`);

export const addUserNote = async (note, source_language, target_language) =>
  apiFetch(`/api/user-notes/`, {
    method: 'POST',
    body: JSON.stringify({
      note_text: note,
      source_language,
      target_language,
    }),
  });

export const noteStatusUpdate = async bodyData =>
  apiFetch(`/api/user-notes/`, {
    method: 'PUT',
    body: JSON.stringify(bodyData),
  });

export const deleteUserNote = async id =>
  apiFetch(`/api/user-notes/?note_id=${id}`, {
    method: 'DELETE',
  });
