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
}: FeedbackSubmission & {
  message?: string;
  attachments?: File[];
}): Promise<void> => {
  const body = new FormData();
  body.append('kind', kind);
  body.append('details', JSON.stringify(details));
  body.append('platform', environment.isNative ? 'native' : 'web');
  if (message) body.append('message', message);
  const deviceInfo = await getDeviceInfo();
  if (kind === 'bug') {
    body.append('device', JSON.stringify(deviceInfo));
  }
  attachments.forEach(file => body.append('attachments', file, file.name));

  await apiFetch('/api/feedback/', { method: 'POST', body });
};
