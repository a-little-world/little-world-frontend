import { environment } from '../environment';
import { apiFetch } from './helpers';

export type FeedbackArea = 'calls' | 'chat' | 'matching' | 'profile' | 'other';

interface FeedbackSubmission {
  kind: 'general' | 'bug';
  rating?: number;
  area?: FeedbackArea;
  areaOther?: string;
  message?: string;
  attachments?: File[];
}

export const submitFeedback = async ({
  kind,
  rating,
  area,
  areaOther,
  message,
  attachments = [],
}: FeedbackSubmission): Promise<void> => {
  const body = new FormData();
  body.append('kind', kind);
  body.append('platform', environment.isNative ? 'native' : 'web');
  if (rating) body.append('rating', String(rating));
  if (area) body.append('area', area);
  if (areaOther) body.append('area_other', areaOther);
  if (message) body.append('message', message);
  attachments.forEach(file => body.append('attachments', file, file.name));

  await apiFetch('/api/feedback/', { method: 'POST', body });
};
