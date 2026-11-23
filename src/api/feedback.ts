import { getDeviceInfo } from '../device-info';
import { environment } from '../environment';
import { apiFetch } from './helpers';

type FeedbackSubmission =
  | { kind: 'general'; details: { rating: number } }
  | { kind: 'bug'; details: { area: string } };

export const submitFeedback = async ({
  kind,
  details,
  message,
  attachments = [],
  includeDeviceInfo,
}: FeedbackSubmission & {
  message?: string;
  attachments?: File[];
  includeDeviceInfo: boolean;
}): Promise<void> => {
  const body = new FormData();
  body.append('kind', kind);
  body.append('details', JSON.stringify(details));
  body.append('platform', environment.isNative ? 'native' : 'web');
  if (message) body.append('message', message);
  if (includeDeviceInfo)
    body.append('device', JSON.stringify(await getDeviceInfo()));
  attachments.forEach(file => body.append('attachments', file, file.name));

  await apiFetch('/api/feedback/', { method: 'POST', body });
};
