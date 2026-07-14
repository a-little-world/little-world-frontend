import useSWR from 'swr';

import { MATCHES_ENDPOINT } from '../features/swr';
import { MESSAGES_ROUTE, getAppSubpageRoute } from '../router/routes';

export interface SupportMatch {
  chatId?: string;
  partner?: {
    id: string;
    first_name: string;
    image: string;
    image_type: string;
    avatar_config: object;
  };
}

interface MatchesResponse {
  support?: {
    results?: SupportMatch[];
  };
}

export const getSupportMatch = (
  matches?: MatchesResponse | null,
): SupportMatch | undefined => matches?.support?.results?.[0];

export const getSupportChatUrl = (
  supportMatch?: SupportMatch,
): string | undefined => {
  const supportChatId = supportMatch?.chatId;

  if (!supportMatch?.partner?.id || !supportChatId) {
    return undefined;
  }

  return getAppSubpageRoute(MESSAGES_ROUTE, supportChatId);
};

interface UseSupportChatOptions {
  revalidateOnMount?: boolean;
}

function useSupportChat({
  revalidateOnMount = false,
}: UseSupportChatOptions = {}) {
  const { data: matches, isLoading } = useSWR<MatchesResponse>(
    MATCHES_ENDPOINT,
    {
      revalidateOnMount,
    },
  );

  const supportMatch = getSupportMatch(matches);
  const supportChatId = supportMatch?.chatId;
  const supportUrl = getSupportChatUrl(supportMatch);

  return {
    supportMatch,
    supportChatId,
    supportUrl,
    hasSupportChat: Boolean(supportUrl),
    isLoading,
  };
}

export default useSupportChat;
